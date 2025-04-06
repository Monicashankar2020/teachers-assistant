import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import ClassCard from "../components/ClassCard";

export default function StudentDashboard() {
  const router = useRouter();
  const [classes, setClasses] = useState([]);
  const [classCode, setClassCode] = useState("");
  const [userId, setUserId] = useState(null);

  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");

    if (!storedUserId) {
      alert("Access Denied! Please log in.");
      router.push("/login");
      return;
    }

    setUserId(storedUserId);

    fetch(`/api/students?userId=${storedUserId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setClasses(data);
        } else {
          console.error("Invalid response format:", data);
          setClasses([]);
        }
      })
      .catch((err) => {
        console.error("Error fetching classes:", err);
        setClasses([]);
      });
  }, []);

  const joinClass = async () => {
    if (!userId) {
      alert("User not logged in!");
      return;
    }

    if (classCode.length !== 6) {
      alert("Invalid Class Code!");
      return;
    }

    const res = await fetch("/api/students", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, classCode }),
    });

    if (res.ok) {
      const newClass = await res.json();
      setClasses((prevClasses) => [...prevClasses, newClass]);
      setClassCode("");
    } else {
      const errorData = await res.json();
      alert(`Error joining class: ${errorData.error}`);
    }
  };

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Student Dashboard</h1>

      <div className="flex gap-4 mb-6">
        <input
          type="text"
          className="p-2 border border-gray-700 rounded-md bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter Class Code"
          value={classCode}
          onChange={(e) => setClassCode(e.target.value)}
        />
        <button
          onClick={joinClass}
          className="bg-green-500 hover:bg-green-600 transition px-4 py-2 rounded-md"
        >
          Join Class
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {classes.length > 0 ? (
          classes.map((cls) => (
            <ClassCard
              key={cls.id}
              cls={cls}
              onClick={() => {
                localStorage.setItem("classId", cls.id); // Store classId for use in other pages
                router.push(`/class/${cls.id}`);
              }}
            />
          ))
        ) : (
          <p className="text-gray-400">No classes joined yet.</p>
        )}
      </div>
    </div>
  );
}
