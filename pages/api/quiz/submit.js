import { prisma } from "../../../lib/prisma";
import fetch from "node-fetch";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const { quizId, answers, studentId } = req.body;

  // Basic validation
  if (!quizId || !studentId || !answers || typeof answers !== "object") {
    return res.status(400).json({ error: "Missing or invalid data in request body" });
  }

  try {
    // Check if already submitted
    const existingResponse = await prisma.response.findUnique({
      where: {
        quizId_studentId: {
          quizId,
          studentId,
        },
      },
    });

    if (existingResponse) {
      return res.status(400).json({ error: "You have already submitted this quiz." });
    }

    // Fetch quiz and questions
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: { questions: true },
    });

    if (!quiz) return res.status(404).json({ error: "Quiz not found" });

    let score = 0;
    const totalQuestions = quiz.questions.length;
    const incorrectQuestions = [];

    quiz.questions.forEach((q) => {
      const userAnswer = answers[q.id];
      if (userAnswer === q.correctAnswer) {
        score++;
      } else {
        incorrectQuestions.push({
          question: q.question,
          correctAnswer: q.correctAnswer,
          userAnswer: userAnswer || "No Answer",
        });
      }
    });

    const feedbackPrompt = `
The student scored ${score} out of ${totalQuestions} on the topic "${quiz.title}".

Here are the questions they got wrong:
${incorrectQuestions.map((item, i) => `${i + 1}. ${item.question}\nYour Answer: ${item.userAnswer}\nCorrect Answer: ${item.correctAnswer}`).join("\n\n")}

Provide:
1. Personalized feedback based on the mistakes.
2. A list of 2-3 clickable URLs for study resources to help the student improve.
`;

    const geminiResponse = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [{ parts: [{ text: feedbackPrompt }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        }),
      }
    );

    const geminiData = await geminiResponse.json();
    let fullText = geminiData.candidates?.[0]?.content?.parts?.[0]?.text?.trim() || "No feedback available.";
    fullText = fullText.replace(/\*\*/g, ""); 
  
    const urls = fullText.match(/https?:\/\/[^\s)]+/g) || [];
    const studyResources = urls.slice(0, 3).join("\n");
    

    await prisma.response.create({
      data: {
        quizId,
        studentId,
        score,
        answers,
        feedback: fullText,
        studyResources,
      },
    });

    res.status(200).json({ score, feedback: fullText });
  } catch (err) {
    console.error("Error submitting quiz:", err);
    res.status(500).json({ error: "Failed to submit quiz" });
  }
}
