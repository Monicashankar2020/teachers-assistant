export default function ClassCard({ cls, onClick }) {
    return (
      <div
        onClick={onClick}
        className="bg-gray-800 text-white p-4 rounded-lg shadow-lg cursor-pointer hover:bg-gray-700 transition-all transform hover:scale-105 animate-fade-in"
      >
        <h2 className="text-lg font-semibold">{cls.name}</h2>
        <p className="text-gray-400">Class Code: {cls.classCode}</p>
      </div>
    );
  }
  