import { useEffect, useState } from "react";
import { useRouter } from "next/router";

export default function QuizPage() {
  const router = useRouter();
  const { id: quizId } = router.query;

  const [quiz, setQuiz] = useState(null);
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(null);
  const [feedback, setFeedback] = useState("");
  const [error, setError] = useState("");
  const [previousResponse, setPreviousResponse] = useState(null);

  const studentId =
    typeof window !== "undefined" ? localStorage.getItem("userId") : null;

  useEffect(() => {
    if (!quizId || !studentId) return;

    const fetchQuiz = async () => {
      try {
        const res = await fetch(`/api/quiz/${quizId}`);
        const data = await res.json();
        if (res.ok) setQuiz(data);
        else setError(data.error);
      } catch {
        setError("Failed to load quiz.");
      }
    };

    const fetchPreviousResponse = async () => {
      try {
        const res = await fetch(
          `/api/quiz/response?quizId=${quizId}&studentId=${studentId}`
        );
        if (res.ok) {
          const data = await res.json();
          if (data && data.answers) {
            setPreviousResponse(data);
            setSubmitted(true);
          }
        }
      } catch (err) {
        console.error("Check previous response failed", err);
      }
    };

    fetchQuiz();
    fetchPreviousResponse();
  }, [quizId, studentId]);

  const handleSelect = (questionId, selectedOption) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  const handleSubmit = async () => {
    if (!quizId || !studentId || Object.keys(answers).length === 0) {
      setError("Please answer all questions before submitting.");
      return;
    }
  
    try {
      const res = await fetch("/api/quiz/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ quizId, answers, studentId }),
      });
  
      const data = await res.json();
      console.log("Submit response:", data); // 🔍 Log response
  
      if (res.ok) {
        setSubmitted(true);
        setScore(data.score);
        setFeedback(data.feedback);
      } else {
        setError(data.error || "Submission failed");
      }
    } catch (err) {
      console.error("Submit failed:", err);
      setError("Submission failed.");
    }
  };

  if (!quiz) {
    return (
      <div className="text-white text-center mt-10 animate-pulse">
        Loading quiz...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-6 py-10">
      <div className="max-w-4xl mx-auto bg-gray-950 shadow-2xl rounded-xl p-8 transition-all duration-500 animate-fade-in">
        <h1 className="text-4xl font-extrabold text-blue-400 mb-6 text-center animate-slide-down">
          {quiz.title}
        </h1>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        {!submitted ? (
          <>
            {quiz.questions.map((q, index) => (
              <div
                key={q.id}
                className="mb-8 bg-gray-800 rounded-lg p-5 shadow-lg hover:scale-[1.02] transition-transform duration-300"
              >
                <p className="text-lg font-semibold text-white mb-3">
                  {index + 1}. {q.question}
                </p>
                <div className="space-y-2">
                  {q.options.map((option, idx) => (
                    <label
                      key={idx}
                      className="block bg-gray-700 px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-600 transition-all"
                    >
                      <input
                        type="radio"
                        name={`question-${q.id}`}
                        value={option}
                        checked={answers[q.id] === option}
                        onChange={() => handleSelect(q.id, option)}
                        className="mr-3 accent-blue-500"
                      />
                      {option}
                    </label>
                  ))}
                </div>
              </div>
            ))}

            <button
              onClick={handleSubmit}
              className="w-full mt-6 bg-blue-600 hover:bg-blue-700 transition duration-300 text-white font-bold py-3 rounded-lg shadow-md hover:shadow-blue-700"
            >
              Submit Quiz
            </button>
          </>
        ) : (
          <div className="mt-8 animate-fade-in-slow">
            <h2 className="text-2xl font-bold text-center text-blue-400 mb-4">
              Your Score:{" "}
              <span className="text-white font-extrabold">
                {score ?? previousResponse?.score}
              </span>{" "}
              / {quiz.questions.length}
            </h2>

            <div className="mt-6 space-y-6">
              {quiz.questions.map((q, index) => {
                const studentAnswer =
                  previousResponse?.answers?.[q.id] || answers[q.id];
                const isCorrect = studentAnswer === q.correctAnswer;

                return (
                  <div
                    key={q.id}
                    className="p-5 bg-gray-800 rounded-xl border border-gray-600 hover:border-blue-500 transition duration-300"
                  >
                    <p className="text-lg font-semibold text-white mb-2">
                      {index + 1}. {q.question}
                    </p>
                    {q.options.map((opt, idx) => {
                      const isSelected = studentAnswer === opt;
                      const isCorrectAnswer = opt === q.correctAnswer;

                      return (
                        <div key={idx} className="ml-4 flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              isSelected
                                ? isCorrect
                                  ? "bg-green-500"
                                  : "bg-red-500"
                                : isCorrectAnswer
                                ? "bg-green-400"
                                : "bg-gray-500"
                            }`}
                          ></div>
                          <span
                            className={`${
                              isCorrectAnswer
                                ? "text-green-400"
                                : isSelected && !isCorrect
                                ? "text-red-400"
                                : "text-gray-300"
                            }`}
                          >
                            {opt}
                            {isSelected && " (Your Answer)"}
                            {isCorrectAnswer && " (Correct)"}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>

            <div className="mt-10 p-6 bg-gray-900 rounded-lg shadow-inner border border-gray-700">
              <h3 className="text-xl font-bold text-blue-400 mb-2">
                Feedback & Resources
              </h3>
              <p className="text-gray-300 whitespace-pre-line leading-relaxed">
                {feedback || previousResponse?.feedback}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
