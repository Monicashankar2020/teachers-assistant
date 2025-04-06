export default function AnimatedButton({ text, onClick }) {
    return (
      <button
        onClick={onClick}
        className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-700 
                   transition-all transform hover:scale-105 animate-pulse"
      >
        {text}
      </button>
    );
  }
  