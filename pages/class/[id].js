import { useState, useEffect } from "react";
import { useRouter } from "next/router";
import CreateQuiz from "../../components/CreateQuiz";
import StudentList from "../../components/StudentList";

export default function ClassPage() {
  const router = useRouter();
  const { id: classId } = router.query;
  const [cls, setCls] = useState(null);
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isTeacher, setIsTeacher] = useState(null); // Null to indicate not fetched yet

  useEffect(() => {
    if (!router.isReady || !classId) return;

    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      alert("Access Denied! Please log in.");
      router.push("/login");
      return;
    }

    fetchUserRoleFromDB(storedUserId);
  }, [router.isReady, classId]);

  // Fetch user role directly from the database (NOT via /api/userRole)
  const fetchUserRoleFromDB = async (userId) => {
    try {
      console.log("Fetching user role from database...");
      const res = await fetch(`/api/getUserFromDB?userId=${userId}`);
      if (!res.ok) throw new Error("Failed to fetch role");

      const userData = await res.json();
      console.log("User Data:", userData);

      const role = userData.role;
      if (!role) throw new Error("Invalid role data");

      setIsTeacher(role === "teacher");

      if (role === "student") {
        router.replace(`/class/student?classId=${classId}`);
        return;
      }

      fetchClassData(classId);
    } catch (error) {
      console.error("Error fetching user role:", error);
    }
  };

  // Fetch class and quiz data
  const fetchClassData = async (classId) => {
    try {
      console.log("Fetching class data...");
      const [classRes, quizRes] = await Promise.all([
        fetch(`/api/classes/${classId}`),
        fetch(`/api/quizzes?classId=${classId}`)
      ]);

      if (!classRes.ok) throw new Error(await classRes.text());
      setCls(await classRes.json());

      if (!quizRes.ok) throw new Error(await quizRes.text());
      setQuizzes(await quizRes.json());

      setLoading(false);
    } catch (error) {
      console.error("Error fetching class data:", error);
    }
  };

  if (loading || isTeacher === null) return <div className="text-white text-center mt-10">Loading...</div>;
  if (!cls) return <div className="text-white text-center mt-10">Class not found.</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">{cls.name}</h1>
      <p className="text-gray-400 mb-4">
        Class Code: <span className="font-mono bg-gray-800 px-2 py-1 rounded">{cls.classCode}</span>
      </p>

      

      <CreateQuiz classId={cls.id} />
      <h2 className="text-lg font-semibold mb-4 mt-6">Posted Quizzes</h2>
      {quizzes.length > 0 ? (
        <ul className="space-y-2">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="bg-gray-800 p-3 rounded-md">
              <a href={quiz.formUrl} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
                {quiz.title}
              </a>
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No quizzes available yet.</p>
      )}

      <StudentList classId={cls.id} />
    </div>
  );
}
