import { prisma } from "../../lib/prisma";
import fetch from "node-fetch";
import { v4 as uuidv4 } from "uuid";

export default async function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ error: "Method not allowed" });

  const { classId, topic, numQuestions, createdBy } = req.body;

  try {
    // Step 1: Generate Questions using Gemini
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-pro:generateContent?key=${process.env.GOOGLE_API_KEY}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          contents: [
            {
              parts: [
                {
                  text: `Generate ${numQuestions} multiple-choice questions on the topic "${topic}". The response must be a valid JSON array with the following format:
                  [
                    {
                      "question": "What is 2 + 2?",
                      "options": ["3", "4", "5", "6"],
                      "correctAnswer": "4"
                    }
                  ]`,
                },
              ],
            },
          ],
          generationConfig: { temperature: 0.7, maxOutputTokens: 2048 },
        })
      }
    );

    const geminiData = await geminiRes.json();
    if (!geminiData?.candidates?.length) {
      throw new Error("Gemini API did not return any candidates.");
    }

    const responseText = geminiData.candidates[0]?.content?.parts?.[0]?.text?.trim();
    if (!responseText) {
      throw new Error("Gemini API response is empty.");
    }

    let jsonText = responseText.replace(/```json|```/g, "").trim();
    let questions;
    try {
      questions = JSON.parse(jsonText);
      if (!Array.isArray(questions)) {
        throw new Error("Parsed response is not an array.");
      }
    } catch (err) {
      throw new Error("Failed to parse questions from Gemini API response.");
    }

    // Clean up question/option newlines
    questions = questions.map((q) => ({
      question: q.question.replace(/\n/g, " "),
      options: q.options.map((opt) => opt.replace(/\n/g, " ")),
      correctAnswer: q.correctAnswer.replace(/\n/g, " "),
    }));

    // Step 2: Create Quiz in DB (Custom Form)
    const quizId = uuidv4(); // Generate a unique ID for frontend quiz path
    const formUrl = `${process.env.NEXT_PUBLIC_BASE_URL}/quiz/${quizId}`; // Link to custom UI

    const quiz = await prisma.quiz.create({
      data: {
        id: quizId, // Store quiz with a custom UUID (or use auto-incremented ID if preferred)
        classId,
        title: `${topic} Quiz`,
        formUrl,
        formId: quizId, // Reuse the same ID
        createdBy,
        questions: {
          create: questions.map((q) => ({
            question: q.question,
            options: q.options,
            correctAnswer: q.correctAnswer,
          })),
        },
      },
      include: {
        questions: true,
      },
    });

    res.status(201).json(quiz);
  } catch (error) {
    console.error("Error creating quiz:", error);
    res.status(500).json({
      error: error.message || "Failed to create quiz",
    });
  }
}
