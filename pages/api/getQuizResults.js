import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method !== "GET") return res.status(405).json({ error: "Method not allowed" });

  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ error: "User ID is required" });
  }

  try {
    const results = await prisma.quizResult.findMany({
      where: { userId },
      include: { quiz: true },
    });

    res.status(200).json(results);
  } catch (error) {
    console.error("Error fetching quiz results:", error);
    res.status(500).json({ error: "Failed to fetch quiz results" });
  }
}
