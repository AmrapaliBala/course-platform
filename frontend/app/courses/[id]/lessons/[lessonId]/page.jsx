"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

export default function LessonPage() {
  const params = useParams();
  const router = useRouter();

  const { lessonId } = params;

  const [lesson, setLesson] = useState(null);
  const [completed, setCompleted] = useState(false);

  const [loading, setLoading] = useState(true);
  const [completing, setCompleting] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    const fetchLesson = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lessonId}`,
          {
            credentials: "include",
          }
        );

        const data = await response.json();

        if (response.status === 401) {
          router.push("/login");
          return;
        }

        if (response.status === 403) {
          setMessage(
            "You must be enrolled in this course."
          );
          return;
        }

        if (!response.ok) {
          throw new Error(data.message);
        }

        setLesson(data.lesson);
        setCompleted(data.completed);
      } catch (error) {
        setMessage(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLesson();
  }, [lessonId, router]);

  const markComplete = async () => {
    try {
      setCompleting(true);
      setMessage("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/lessons/${lessonId}/complete`,
        {
          method: "POST",
          credentials: "include",
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (response.status === 403) {
        setMessage(
          "You must be enrolled in this course."
        );
        return;
      }

      if (!response.ok) {
        throw new Error(data.message);
      }

      setCompleted(true);
      setMessage("Lesson marked as complete!");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <p>Loading lesson...</p>
      </main>
    );
  }

  if (!lesson) {
    return (
      <main className="mx-auto max-w-4xl p-8">
        <p className="text-red-500">{message}</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl p-8">
      <Card className="p-8">
        <h1 className="text-3xl font-bold">
          {lesson.title}
        </h1>

        <div className="mt-6 whitespace-pre-line leading-7 text-slate-700">
          {lesson.content}
        </div>

        {lesson.videoUrl && (
          <div className="mt-6">
            <a
              href={lesson.videoUrl}
              target="_blank"
              rel="noreferrer"
              className="text-blue-600 underline"
            >
              Watch lesson video
            </a>
          </div>
        )}

        <Button
          className="mt-8"
          onClick={markComplete}
          disabled={completed || completing}
        >
          {completed
            ? "✓ Completed"
            : completing
            ? "Saving..."
            : "Mark as complete"}
        </Button>

        {message && (
          <p className="mt-4 text-sm">
            {message}
          </p>
        )}
      </Card>
    </main>
  );
}