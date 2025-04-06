import { useState, useEffect } from "react";

export default function CreateQuiz({ classId }) {
  const [topic, setTopic] = useState("");
  const [numQuestions, setNumQuestions] = useState(5); // Default to 5 questions
  const [loading, setLoading] = useState(false);
  const [userId, setUserId] = useState(null);
  const [accessToken, setAccessToken] = useState(null);

  // Fetch user ID and access token from the backend
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = localStorage.getItem("userId"); // Get userId from localStorage
        if (!userId) return alert("Access Denied! Please log in.");

        setUserId(userId);

        // Fetch access token from the backend
        const res = await fetch(`/api/getAccessToken?userId=${userId}`);
        const data = await res.json();

        if (res.ok && data.accessToken) {
          setAccessToken(data.accessToken);
        } else {
          alert("Failed to retrieve access token. Please log in again.");
        }
      } catch (error) {
        console.error("Error fetching access token:", error);
        alert("Error fetching access token.");
      }
    };

    fetchUserData();
  }, []);

  const createQuiz = async () => {
    if (!classId) {
      alert("Class ID is missing!");
      return;
    }

    if (!userId || !accessToken) {
      alert("Access Denied! Please log in.");
      return;
    }

    if (!topic) {
      alert("Please enter a quiz topic!");
      return;
    }

    setLoading(true);

    const res = await fetch("/api/createQuiz", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Use access token from backend
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

    setLoading(false);
  };

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6">
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
