import { useState, useEffect } from "react";

export default function StudentList({ classId }) {
  const [students, setStudents] = useState([]);

  useEffect(() => {
    fetch(`/api/students?classId=${classId}`)
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setStudents(data);
        } else {
          setStudents([]);
        }
      })
      .catch(() => setStudents([]));
  }, [classId]);

  const removeStudent = async (studentId) => {
    const res = await fetch(
      `/api/students?studentId=${studentId}&classId=${classId}`,
      {
        method: "DELETE",
      }
    );

    if (res.ok) {
      setStudents((prevStudents) =>
        prevStudents.filter((s) => s?.id !== studentId)
      );
    } else {
      alert("Error removing student.");
    }
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg shadow-sky-600 mt-6 animate-fade-in">
      <h2 className="text-2xl text-center font-mono font-semibold text-white mb-3">Students</h2>
      {students.length > 0 ? (
        <ul>
          {students.map((student) => {
            if (!student) return null;

            return (
              <li
                key={student.id}
                className="flex justify-between items-center p-2 bg-gray-700 rounded-md mb-2 shadow-lg shadow-black"
              >
                <span className="text-white">{student.username}</span>
                <button
                  onClick={() => removeStudent(student.id)}
                  className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-all duration-200"
                >
                  Remove
                </button>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-gray-400">No students found.</p>
      )}
    </div>
  );
}
