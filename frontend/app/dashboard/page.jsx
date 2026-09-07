"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function DashboardPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments/my-courses`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message);
        }

        setCourses(data.courses);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCourses();
  }, []);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-8">
        <p>Loading your courses...</p>
      </main>
    );
  }

  if (error) {
    return (
      <main className="mx-auto max-w-6xl p-8">
        <p className="text-red-500">{error}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">
          Student Dashboard
        </h1>

        <p className="mt-2 text-slate-600">
          Continue learning from where you left off.
        </p>
      </div>

      {courses.length === 0 ? (
        <Card className="p-8 text-center">
          <h2 className="text-xl font-semibold">
            No courses yet
          </h2>

          <p className="mt-2 text-slate-600">
            You haven't enrolled in any courses.
          </p>

          <Link href="/courses">
            <Button className="mt-4">
              Browse Courses
            </Button>
          </Link>
        </Card>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {courses.map((item) => {
            const completed = item.completedCount;
            const total = item.totalLessons;

            const progress =
              total > 0
                ? Math.round((completed / total) * 100)
                : 0;

            return (
              <Card
                key={item.enrollmentId}
                className="p-6"
              >
                <h2 className="text-xl font-semibold">
                  {item.course.title}
                </h2>

                <p className="mt-2 text-sm text-slate-600">
                  {item.course.description}
                </p>

                <div className="mt-6">
                  <div className="mb-2 flex justify-between text-sm">
                    <span>Progress</span>

                    <span>
                      {completed} of {total} lessons complete
                    </span>
                  </div>

                  <div className="h-2 w-full rounded-full bg-slate-200">
                    <div
                      className="h-2 rounded-full bg-black"
                      style={{
                        width: `${progress}%`,
                      }}
                    />
                  </div>

                  <p className="mt-2 text-sm text-slate-500">
                    {progress}% complete
                  </p>
                </div>

                {progress === 100 ? (
                  <Button
                    className="mt-6 w-full"
                    disabled
                  >
                    Course completed 🎉
                  </Button>
                ) : (
                  <Link
                    href={
                      item.firstLessonId
                        ? `/courses/${item.course._id}/lessons/${item.firstLessonId}`
                        : `/courses/${item.course._id}`
                    }
                  >
                    <Button className="mt-6 w-full">
                      Continue learning
                    </Button>
                  </Link>
                )}
              </Card>
            );
          })}
        </div>
      )}
    </main>
  );
}