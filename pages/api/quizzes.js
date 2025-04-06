import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { classId } = req.query;

    if (!classId) {
      return res.status(400).json({ error: "Class ID is required" });
    }

    try {
      const quizzes = await prisma.quiz.findMany({
        where: { classId },
        select: {
          id: true,
          title: true,
          formUrl: true,
        },
      });

      return res.status(200).json(quizzes);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
      return res.status(500).json({ error: "Failed to fetch quizzes" });
    }
  }

  if (req.method === "POST") {
    const { title, classId, createdBy } = req.body;

    if (!title || !classId || !createdBy) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    try {
      const newQuiz = await prisma.quiz.create({
        data: {
          title,
          classId,
          createdBy,
          formUrl: "", // Google Form URL to be added later
        },
      });

      return res.status(201).json(newQuiz);
    } catch (error) {
      console.error("Error creating quiz:", error);
      return res.status(500).json({ error: "Failed to create quiz" });
    }
  }

  return res.status(405).json({ error: "Method not allowed" });
}
