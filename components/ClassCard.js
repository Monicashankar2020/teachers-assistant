export default function ClassCard({ cls, onClick }) {
    return (
      <div
        onClick={onClick}
        className="w-96 bg-dirtysky text-white p-4 rounded-lg shadow-xl shadow-black cursor-pointer hover:bg-gray-700 transition-all transform hover:scale-105 animate-fade-in"
      >
        <h2 className="text-lg font-semibold">{cls.name}</h2>
        <p className="text-gray-400">Class Code: {cls.classCode}</p>
      </div>
    );
  }
  


  //bg-gradient-to-r from-sky-900 to-blue-500