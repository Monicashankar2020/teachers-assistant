import { useState } from "react";
import CreateQuiz from "./CreateQuiz";
import StudentList from "./StudentList";

export default function ClassDashboard({ classId }) {
  const [activeTab, setActiveTab] = useState("quizzes"); // Default tab

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-md mt-6 animate-fade-in">
      {/* Navbar for Switching Between Quizzes & Students */}
      <div className="flex space-x-4 mb-6">
        <button
          onClick={() => setActiveTab("quizzes")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "quizzes" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Quizzes
        </button>
        <button
          onClick={() => setActiveTab("students")}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition ${
            activeTab === "students" ? "bg-blue-500 text-white" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
          }`}
        >
          Students
        </button>
      </div>

      {/* Display Content Based on Active Tab */}
      {activeTab === "quizzes" ? (
        <CreateQuiz classId={classId} />
      ) : (
        <StudentList classId={classId} />
      )}
    </div>
  );
}
