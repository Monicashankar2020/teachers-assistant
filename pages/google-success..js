import { useRouter } from "next/router";
import { useEffect } from "react";

export default function GoogleSuccess() {
  const router = useRouter();

  useEffect(() => {
    if (router.isReady) {
      const { userId, role } = router.query;

      if (userId) {
        localStorage.setItem("userId", userId);
        router.push(role === "teacher" ? "/teacher-dashboard" : "/student-dashboard");
      } else {
        router.push("/login");
      }
    }
  }, [router.isReady, router.query]);

  return <div className="text-white text-center mt-10">Logging in...</div>;
}
