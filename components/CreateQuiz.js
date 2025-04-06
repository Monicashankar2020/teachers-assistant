// This component takes topic and number of questions from the user and sends them to the gemini backend to generate a quiz

import { useState, useEffect } from "react";

export default function CreateQuiz({ classId }) {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5); // Default to 5 questions
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);

  // Get userId from localStorage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (!storedUserId) {
      alert("Access Denied! Please log in.");
    } else {
      setUserId(storedUserId);
    }
  }, []);

  const createQuiz = async () => {
    if (!classId) {
      alert("Class ID is missing!");
      return;
    }

    if (!userId) {
      alert("Access Denied! Please log in.");
      return;
    }

    if (!topic) {
      alert("Please enter a quiz topic!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/createQuiz", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ topic, numQuestions, classId, createdBy: userId }),
      });

      const data = await res.json();

      if (res.ok) {
        alert(`Quiz created successfully! Google Form: ${data.formUrl}`);
        setTopic("");
        setNumQuestions(5);
      } else {
        alert(`Error creating quiz: ${data.error}`);
      }
    } catch (error) {
      console.error("Quiz creation error:", error);
      alert("Something went wrong. Please try again.");
    }

    setLoading(false);
  };

  return (
    <div className="glowy-box">
      <h2 className="text-lg font-semibold text-white mb-3">Create Quiz</h2>

      <input
        type="text"
        value={topic}
        onChange={(e) => setTopic(e.target.value)}
        placeholder="Enter Quiz Topic"
        className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
      />

      <input
        type="number"
        value={numQuestions}
        onChange={(e) => setNumQuestions(Number(e.target.value))}
        placeholder="Enter Number of Questions"
        className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
      />

      <button
        onClick={createQuiz}
        disabled={loading}
        className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600 transition"
      >
        {loading ? "Creating Quiz..." : "Create Quiz"}
      </button>
    </div>
  );
}

//   return (
//     <div className="glowy-box">
//       <h2 className="text-lg font-semibold text-white mb-3">Create Quiz</h2>

//       <input
//         type="text"
//         value={topic}
//         onChange={(e) => setTopic(e.target.value)}
//         placeholder="Enter Quiz Topic"
//         className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
//       />

//       <input
//         type="number"
//         value={numQuestions}
//         onChange={(e) => setNumQuestions(Number(e.target.value))}
//         placeholder="Enter Number of Questions"
//         className="w-full p-2 mb-2 rounded-md bg-gray-700 text-white"
//       />

//       <button
//         onClick={createQuiz}
//         disabled={loading}
//         className="bg-blue-500 px-4 py-2 rounded-md text-white hover:bg-blue-600 transition"
//       >
//         {loading ? "Creating Quiz..." : "Create Quiz"}
//       </button>
//     </div>
//   );
// }
