import { useRouter } from "next/router";
import { useState, useEffect } from "react";

export default function QuizResultPage() {
  const router = useRouter();
  const { quizId } = router.query;
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!quizId) return;

    const fetchResult = async () => {
      try {
        const userId = localStorage.getItem("userId");
        const res = await fetch(`/api/quizResult?userId=${userId}&quizId=${quizId}`);

        if (!res.ok) throw new Error(await res.text());
        setResult(await res.json());
      } catch (error) {
        console.error("Error fetching result:", error);
      }
    };

    fetchResult();
  }, [quizId]);

  if (!result) return <div className="text-white text-center mt-10">Loading result...</div>;

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8">
      <h1 className="text-3xl font-bold mb-4">Quiz Result</h1>
      <p className="text-lg">Score: {result.score}/100</p>
      <p className="text-lg">Feedback: {result.feedback}</p>
      <a href={result.studyResources} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
        Study Resources
      </a>
    </div>
  );
}
