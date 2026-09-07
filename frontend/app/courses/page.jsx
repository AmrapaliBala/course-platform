import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

async function getCourses() {
  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}/api/courses`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    throw new Error("Failed to fetch courses");
  }

  return response.json();
}

export default async function CoursesPage() {
  const data = await getCourses();

  return (
    <main className="mx-auto max-w-6xl p-8">
      <h1 className="mb-8 text-3xl font-bold">Courses</h1>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {data.courses.map((course) => (
          <Card key={course._id} className="p-6">
            <h2 className="text-xl font-semibold">
              {course.title}
            </h2>

            <p className="mt-2 text-sm text-slate-600">
              {course.description}
            </p>

            <p className="mt-4 text-lg font-bold">
              ₹{course.price}
            </p>

            <Link href={`/courses/${course._id}`}>
              <Button className="mt-4 w-full">
                View Course
              </Button>
            </Link>
          </Card>
        ))}
      </div>
    </main>
  );
}