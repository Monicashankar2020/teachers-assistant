import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  const { userId, classId, studentId } = req.query;

  if (req.method === "GET") {
    if (userId) {
      // Fetch classes the student has joined
      try {
        const joinedClasses = await prisma.enrollment.findMany({
          where: { studentId: userId },
          include: {
            individualClass: {
              select: { id: true, name: true, classCode: true },
            },
          },
        });

        return res
          .status(200)
          .json(joinedClasses.map((e) => e.individualClass));
      } catch (error) {
        console.error("Error fetching classes:", error);
        return res.status(500).json({ error: "Failed to fetch classes" });
      }
    }

    if (classId) {
      // Fetch only users with role 'student' in a particular class
      try {
        const students = await prisma.enrollment.findMany({
          where: {
            classId,
            student: {
              role: "student",
            },
          },
          include: {
            student: {
              select: { id: true, username: true, email: true },
            },
          },
        });

        return res.status(200).json(students.map((e) => e.student));
      } catch (error) {
        console.error("Error fetching students:", error);
        return res.status(500).json({ error: "Failed to fetch students" });
      }
    }

    return res.status(400).json({ error: "Invalid request parameters" });
  }

  if (req.method === "POST") {
    const { userId, classCode } = req.body;

    if (!userId || !classCode) {
      return res
        .status(400)
        .json({ error: "User ID and Class Code are required" });
    }

    try {
      const cls = await prisma.classes.findUnique({ where: { classCode } });
      if (!cls) {
        return res.status(404).json({ error: "Class not found" });
      }

      const existingEnrollment = await prisma.enrollment.findFirst({
        where: { studentId: userId, classId: cls.id },
      });

      if (existingEnrollment) {
        return res
          .status(400)
          .json({ error: "Already enrolled in this class" });
      }

      const newEnrollment = await prisma.enrollment.create({
        data: { studentId: userId, classId: cls.id },
        include: { individualClass: true },
      });

      return res.status(201).json(newEnrollment.individualClass);
    } catch (error) {
      console.error("Error enrolling student:", error);
      return res.status(500).json({ error: "Failed to join class" });
    }
  }

  if (req.method === "DELETE") {
    if (!studentId || !classId) {
      return res
        .status(400)
        .json({ error: "Student ID and Class ID are required" });
    }

    try {
      await prisma.enrollment.deleteMany({
        where: {
          studentId,
          classId,
        },
      });

      return res.status(200).json({ message: "Student removed from class" });
    } catch (error) {
      console.error("Error removing student:", error);
      return res.status(500).json({ error: "Failed to remove student" });
    }
  }

  return res.status(405).json({ error: "Method Not Allowed" });
}
