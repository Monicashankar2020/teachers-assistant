import { useState, useEffect } from "react";
import { useRouter } from "next/router";

export default function StudentClassPage() {
  const router = useRouter();
  const { classId } = router.query;
  const [quizzes, setQuizzes] = useState([]);
  const [results, setResults] = useState({});
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  useEffect(() => {
    if (!router.isReady || !classId) return;

    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      alert("Access Denied! Please log in.");
      router.push("/login");
      return;
    }

    setUserId(storedUserId);
  
    fetchQuizzes(classId);
  }, [router.isReady, classId]);

  // const fetchAccessToken = async (userId) => {
  //   try {
  //     const res = await fetch(`/api/getAccessToken?userId=${userId}`);
  //     const data = await res.json();

  //     if (res.ok && data.accessToken) {
  //       setAccessToken(data.accessToken);
  //     } else {
  //       alert("Failed to retrieve access token. Please log in again.");
  //     }
  //   } catch (error) {
  //     console.error("Error fetching access token:", error);
  //     alert("Error fetching access token.");
  //   }
  // };

  const fetchQuizzes = async (classId) => {
    try {
      const quizRes = await fetch(`/api/quizzes?classId=${classId}`);
      if (!quizRes.ok) throw new Error(await quizRes.text());

      setQuizzes(await quizRes.json());
      setLoading(false);
    } catch (error) {
      console.error("Error fetching quizzes:", error);
    }
  };


  if (loading) return <div className="text-white text-center mt-10">Loading quizzes...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4 text-center font-mono">Available Quizzes</h1>
      {quizzes.length > 0 ? (
        <ul className="space-y-4">
          {quizzes.map((quiz) => (
            <li key={quiz.id} className="bg-gray-800 p-3 rounded-md shadow-lg shadow-black">
              <a href={quiz.formUrl} target="_blank" rel="noopener noreferrer" className="text-blue-200 hover:underline">
                {quiz.title}
              </a>
             
              {results[quiz.id] && (
                <div className="mt-2 text-gray-300">
                  <strong>Marks:</strong> {results[quiz.id].marks} <br />
                  <strong>Feedback:</strong> {results[quiz.id].feedback} <br />
                  <strong>Study Resources:</strong>{" "}
                  <a href={results[quiz.id].resources} className="text-blue-400 hover:underline" target="_blank" rel="noopener noreferrer">
                    Click here
                  </a>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <p className="text-gray-400">No quizzes available yet.</p>
      )}
    </div>
  );
}
