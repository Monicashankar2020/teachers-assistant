import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ClassCard from "../components/ClassCard";

export default function TeacherDashboard() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [name, setName] = useState("");
  const [classCode, setClassCode] = useState("");
  const [loading, setLoading] = useState(true);
  const teacherId = typeof window !== "undefined" ? localStorage.getItem("userId") : null; // Get userId from localStorage

  useEffect(() => {
    async function fetchClasses() {
      if (!teacherId) return;
      try {
        const res = await fetch(`/api/classes/teacher?teacherId=${teacherId}`);
        if (!res.ok) throw new Error("Failed to fetch teacher's classes");
        const data = await res.json();
        setClasses(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error("Error fetching classes:", error);
        setClasses([]);
      } finally {
        setLoading(false);
      }
    }
  
    fetchClasses();
  }, [teacherId]);

  const createClass = async () => {
    if (!teacherId) {
      alert("User not authenticated. Please log in again.");
      return;
    }

    if (classCode.length !== 6) {
      alert("Class Code must be 6 characters long.");
      return;
    }

    try {
      const res = await fetch("/api/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, classCode, teacherId }),
      });

      const data = await res.json();
      if (res.ok) {
        setClasses((prev) => [...prev, data]);
        setName("");
        setClassCode("");
      } else {
        alert(data.error || "Error creating class. Try again.");
      }
    } catch (error) {
      console.error("Error creating class:", error);
      alert("Failed to create class. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 animate-fade-in">
      <h1 className="text-5xl font-bold mb-4 text-center">Teacher's Dashboard</h1>

      <div className="glowy-box">
        <input
          type="text"
          className="p-2 border border-gray-700 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
          placeholder="Class Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          className="p-2 border border-gray-700 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-transform transform hover:scale-105"
          placeholder="6-digit Class Code"
          maxLength="6"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
        />
        <button
          onClick={createClass}
          className="bg-blue-500 hover:bg-blue-600 transition-transform transform hover:scale-105 px-4 py-2 rounded-md"
        >
          Create Class
        </button>
      </div>

      {loading ? (
        <p className="text-gray-400 animate-pulse">Loading classes...</p>
      ) : (
        <div className="flex flex-wrap justify-center gap-4 scroll-smooth">
          {classes.length > 0 ? (
            classes.map((cls) => (
              <ClassCard key={cls.id} cls={cls} onClick={() => router.push(`/class/${cls.id}`)} />
            ))
          ) : (
            <p className="text-gray-400">No classes found.</p>
          )}
        </div>
      )}
    </div>
  );
}
