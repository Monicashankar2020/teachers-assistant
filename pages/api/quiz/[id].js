import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const {
    query: { id },
  } = req;

  try {
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: { questions: true },
    });

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    res.status(200).json(quiz);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch quiz" });
  }
}
