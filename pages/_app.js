import { useEffect } from "react";
import { useRouter } from "next/router";
import '../styles/globals.css';

function MyApp({ Component, pageProps }) {
  const router = useRouter();

  useEffect(() => {
    const publicRoutes = ["/", "/login", "/signup", "/forgot-password"];
    const isPublicRoute = publicRoutes.includes(router.pathname);

    const user = typeof window !== "undefined" ? JSON.parse(localStorage.getItem("user")) : null;

    if (!isPublicRoute && !user) {
      router.push("/login");
    }
  }, [router.pathname]);

  return <Component {...pageProps} />;
}

export default MyApp;
