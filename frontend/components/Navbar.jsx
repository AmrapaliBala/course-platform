"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const { user, loading } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/logout`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Logout failed");
      }

      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <nav className="flex items-center justify-between border-b px-8 py-4">
      <Link href="/" className="text-xl font-bold">
        CoursePlatform
      </Link>

      <div className="flex items-center gap-6">
        <Link href="/courses">
          Courses
        </Link>

        {!loading && user ? (
          <>
            <Link href="/dashboard">
              Dashboard
            </Link>

            <button
              onClick={handleLogout}
              className="font-medium text-red-600 hover:text-red-700"
            >
              Logout
            </button>
          </>
        ) : (
          <Link href="/login">
            Login
          </Link>
        )}
      </div>
    </nav>
  );
}