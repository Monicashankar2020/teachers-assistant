//API to handle the creation of new classes. 
import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  try {
    if (req.method === "POST") {
      const { name, classCode, teacherId } = req.body;

      if (!name || !classCode || !teacherId) {
        return res.status(400).json({ error: "Missing fields. Ensure all fields are provided." });
      }

      // Only teachers can create a new class
      const teacher = await prisma.user.findUnique({
        where: { id: teacherId },
      });

      if (!teacher) {
        return res.status(400).json({ error: "Invalid teacher ID." });
      }

      const existingClass = await prisma.classes.findUnique({ where: { classCode } });

      if (existingClass) {
        return res.status(400).json({ error: "Class code already exists. Try another one." });
      }

      const newClass = await prisma.classes.create({
        data: { name, classCode, teacherId },
      });

      return res.status(201).json(newClass);
    }

    if (req.method === "GET") {
      if (req.query.id) {
        const classId = req.query.id;
        const classDetails = await prisma.classes.findUnique({
          where: { id: classId },
        });

        if (!classDetails) {
          return res.status(404).json({ error: "Class not found" });
        }

        return res.status(200).json(classDetails);
      }

      // Fetch all classes
      const classes = await prisma.classes.findMany();
      return res.status(200).json(classes);
    }

    return res.status(405).json({ error: "Method Not Allowed" });
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
}
