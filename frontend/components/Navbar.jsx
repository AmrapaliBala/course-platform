"use client";

import Link from "next/link";

import { useAuth } from "@/context/AuthContext";

export default function Navbar() {
  const {user,loading,} = useAuth();

  return (
    <nav className="flex items-center justify-between border-b px-8 py-4">

      <Link href="/" className="text-xl font-bold"> CoursePlatform</Link>

      <div className="flex items-center gap-6">

        <Link href="/courses">
          Courses
        </Link>

        {!loading && user ? (
          <Link href="/dashboard">
            Dashboard
          </Link>
        ) : (
          <Link href="/login">
            Login
          </Link>
        )}

      </div>
    </nav>
  );
}