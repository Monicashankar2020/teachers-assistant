import { prisma } from "../../lib/prisma";

export default async function handler(req, res) {
  if (req.method === "GET") {
    const studentId = "student-id-placeholder";
    const classes = await prisma.enrollment.findMany({
      where: { studentId },
      include: { class: true },
    });
    res.json(classes.map((e) => e.class));
  } else if (req.method === "POST") {
    const { classCode } = req.body;
    const classObj = await prisma.class.findUnique({ where: { classCode } });
    if (!classObj) return res.status(404).json({ error: "Class not found" });

    const enrollment = await prisma.enrollment.create({
      data: { studentId: "student-id-placeholder", classId: classObj.id },
    });
    res.json(enrollment);
  }
}
