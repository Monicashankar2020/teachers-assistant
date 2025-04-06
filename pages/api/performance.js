import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const { classId } = req.query;

    const students = await prisma.enrollment.findMany({
      where: { classId },
      include: { student: true }
    });

    const performances = await Promise.all(
      students.map(async (enrollment) => {
        const responses = await prisma.response.findMany({
          where: { studentId: enrollment.studentId }
        });

        const avgScore = responses.length ? responses.reduce((acc, r) => acc + r.score, 0) / responses.length : 0;
        return { student: enrollment.student, avgScore, attendedQuizzes: responses.length };
      })
    );

    res.json({ performances });
  }
}
