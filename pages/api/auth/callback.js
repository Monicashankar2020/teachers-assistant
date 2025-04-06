import { google } from "googleapis";
import { serialize } from "cookie";
import { prisma } from "../../../lib/prisma";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_REDIRECT_URI
);

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { code } = req.query;
  if (!code) return res.status(400).json({ error: "Authorization code is missing." });

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    // Decode ID token to get user email
    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    const { email, name } = ticket.getPayload();

    // Create an user only if they don't already exist in the database
    let user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      user = await prisma.user.create({
        data: {
          email,
          username: name,
          role: "student", 
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          password: "", // No password required for Google accounts
        },
      });
    } else {
      // To update tokens, especially if user logged in using Google OAuth, as that token expires every 2 hours.
      await prisma.user.update({
        where: { email },
        data: { accessToken: tokens.access_token, refreshToken: tokens.refresh_token },
      });
    }

    // Store userId and role in cookies
    res.setHeader(
      "Set-Cookie",
      serialize("authToken", tokens.access_token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 3600 * 24, 
        path: "/",
      })
    );

    // Redirect to frontend with userId and role
    res.redirect(`/google-success?userId=${user.id}&role=${user.role}`);
  } catch (error) {
    console.error("OAuth callback error:", error);
    res.redirect("/login?error=authentication_failed");
  }
}
