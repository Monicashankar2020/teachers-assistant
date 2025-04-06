//API to help fetch response for the quiz submitted by a particular student from the database.
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { quizId, studentId } = req.query;

  if (req.method !== "GET") return res.status(405).end();

  try {
    const response = await prisma.response.findUnique({
      where: {
        quizId_studentId: {
          quizId,
          studentId,
        },
      },
    });

    if (!response) return res.status(404).json({ error: "No response found" });

    res.status(200).json(response);
  } catch (err) {
    console.error("Error fetching response:", err);
    res.status(500).json({ error: "Failed to fetch response" });
  }
}
