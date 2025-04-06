//API to fetch teahcers classes based on the teacher's ID
import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { teacherId } = req.query;

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  if (!teacherId) {
    return res.status(400).json({ error: "Missing teacherId" });
  }

  try {
    const classes = await prisma.classes.findMany({
      where: {
        teacherId,
      },
     
    });

    res.status(200).json(classes);
  } catch (error) {
    console.error("Error fetching teacher's classes:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
