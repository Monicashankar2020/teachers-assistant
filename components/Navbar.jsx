import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="bg-blue-500 text-white p-4 shadow-lg">
      <div className="flex justify-between items-center container mx-auto">
        <Link href="/">
          <span className="text-2xl font-bold cursor-pointer">
            Teacher's Assistant
          </span>
        </Link>
        <div className="space-x-4">
          <Link href="/signup">
            <span className="hover:text-blue-300 cursor-pointer">Signup</span>
          </Link>
          <Link href="/login">
            <span className="hover:text-blue-300 cursor-pointer">Login</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
