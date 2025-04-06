import { useEffect } from "react";
import { useRouter } from "next/router";
import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const protectedRoutes = ["/teacher-dashboard", "/student-dashboard"];
    const userId = typeof window !== "undefined" ? localStorage.getItem("userId") : null;

    // Redirect if trying to access protected route without login
    if (protectedRoutes.includes(router.pathname) && !userId) {
      router.replace("/login");
    }

    // Clear userId when tab/browser is closed
    const handleBeforeUnload = () => {
      localStorage.removeItem("userId");
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, [router.pathname]);

  return <Component {...pageProps} />;
}

export default MyApp;
