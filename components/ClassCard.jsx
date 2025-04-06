export default function ClassCard({ className, teacherName, onClick }) {
    return (
      <div
        className="bg-grey p-4 rounded-lg shadow-md hover:bg-blue-500 
                   transition-all cursor-pointer transform hover:scale-105"
        onClick={onClick}
      >
        <h3 className="text-xl font-bold">{className}</h3>
        <p className="text-sm text-white mt-2">Teacher: {teacherName}</p>
      </div>
    );
  }
  