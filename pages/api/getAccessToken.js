import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { userId } = req.query;
  if (!userId) return res.status(400).json({ error: "Missing userId parameter" });

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user || !user.accessToken) return res.status(404).json({ error: "User not found or no access token" });

    res.status(200).json({ accessToken: user.accessToken });
  } catch (error) {
    res.status(500).json({ error: "Database error" });
  }
}
