import Link from "next/link";

import { Button } from "@/components/ui/button";

export default function HomePage() {
  return (
    <main className="mx-auto max-w-5xl px-8 py-20">

      <h1 className="text-5xl font-bold">
        Learn skills that move you forward.
      </h1>

      <p className="mt-6 max-w-2xl text-lg text-slate-600">
        Explore practical courses, learn at your own
        pace, and continue where you left off.
      </p>

      <Link href="/courses">
        <Button className="mt-8">
          Browse Courses
        </Button>
      </Link>

    </main>
  );
}