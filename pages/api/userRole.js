import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  const { userId } = req.query; // Extract userId from request

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    if (!userId) {
      return res.status(400).json({ error: "User ID is required" });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { role: true }, // Only fetch role
    });

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ role: user.role });
  } catch (error) {
    console.error("Error fetching user role:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
