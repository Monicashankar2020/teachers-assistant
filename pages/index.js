import Link from 'next/link';
import Navbar from '../components/Navbar';

export default function Home() {
  return (
    <div className="h-screen bg-dark text-white flex flex-col items-center justify-center px-4">
     
      <div className="text-center space-y-8 animate-fade-in mt-[-60px]">
        <h1 className="text-5xl md:text-6xl font-extrabold tracking-wide text-white drop-shadow-lg">
          Welcome to <span className="text-blue-400">Teacher&apos;s Assistant</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-xl mx-auto">
          Empowering teachers to create quizzes with AI and helping students enhance learning through personalized feedback.
        </p>

        <div className="flex justify-center space-x-6 mt-6">
          <Link href="/signup" className="bg-gradient-to-r from-purple-500 to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300">
            Signup
          </Link>
          <Link href="/login" className="bg-gradient-to-r from-purple-500 to-blue-700 text-white font-semibold py-3 px-8 rounded-full shadow-lg hover:shadow-xl hover:scale-105 transform transition-all duration-300">
            Login
          </Link>
        </div>
      </div>
    </div>
  );
}
