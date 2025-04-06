import { useState } from "react";
import { useRouter } from "next/router";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();

    const response = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();
    if (response.ok) {
      // Store userId securely
      localStorage.setItem("userId", data.userId);

      router.push(data.role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
    } else {
      alert(data.error);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = "/api/auth/google"; // Redirect to Google OAuth
  };

  return (
    <div className="h-screen bg-dark text-white flex items-center justify-center">
      <form className="bg-blueShade p-8 rounded-lg shadow-lg w-full max-w-md" onSubmit={handleLogin}>
        <h2 className="text-3xl mb-6 text-center">Login</h2>

        <input
          className="w-full mb-4 p-3 rounded-md bg-grey text-black"
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />

        <input
          className="w-full mb-4 p-3 rounded-md bg-grey text-black"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />

        <button
          type="submit"
          className="w-full p-3 bg-blue-500 rounded-md hover:bg-blue-700 transition-all"
        >
          Login
        </button>

        <p
          className="text-center mt-4 text-grey cursor-pointer hover:text-white"
          onClick={() => router.push("/forgot-password")}
        >
          Forgot Password?
        </p>

        <hr className="my-4 border-gray-600" />

        <button
          type="button"
          onClick={handleGoogleLogin}
          className="w-full p-3 bg-red-500 rounded-md hover:bg-red-700 transition-all flex items-center justify-center"
        >
          <img src="/google-icon.svg" alt="Google" className="w-6 h-6 mr-2" />
          Login with Google
        </button>
      </form>
    </div>
  );
}
