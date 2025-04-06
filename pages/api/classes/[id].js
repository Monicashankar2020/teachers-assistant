import { prisma } from "../../../lib/prisma";

export default async function handler(req, res) {
  const { id } = req.query; // Get classId from URL

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method Not Allowed" });
  }

  try {
    console.log("Fetching class from DB with ID:", id);

    const cls = await prisma.classes.findUnique({
      where: { id },
    });

    if (!cls) {
      return res.status(404).json({ error: "Class not found" });
    }

    res.status(200).json(cls);
  } catch (error) {
    console.error("Error fetching class:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
}
