import { google } from "googleapis";

export default async function handler(req, res) {
  try {
    const oauth2Client = new google.auth.OAuth2(
      process.env.GOOGLE_CLIENT_ID,
      process.env.GOOGLE_CLIENT_SECRET,
      process.env.GOOGLE_REDIRECT_URI
    );

    const { tokens } = await oauth2Client.getAccessToken();
    res.status(200).json(tokens);
  } catch (error) {
    console.error("Google OAuth error:", error);
    res.status(500).json({ error: "Failed to authenticate with Google" });
  }
}
