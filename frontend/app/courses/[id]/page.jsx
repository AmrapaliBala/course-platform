import Link from "next/link";
import { notFound } from "next/navigation";

import { serverApiFetch } from "@/lib/server-api";

import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import EnrollButton from "@/components/EnrollButton";

async function getCourse(id) {
    //   const response = await fetch(
    //     `${process.env.NEXT_PUBLIC_API_URL}/api/courses/${id}`,
    //     {
    //       cache: "no-store",
    //     }
    //   );
    const response =
        await serverApiFetch(
            `/api/courses/${id}`
        );

    if (response.status === 404) {
        notFound();
    }

    if (!response.ok) {
        throw new Error(
            "Failed to fetch course"
        );
    }

    return response.json();
}

export default async function CoursePage({
    params,
}) {
    const { id } = await params;

    const data = await getCourse(id);

    const course = data.course;

    return (
        <main className="mx-auto max-w-5xl p-8">

            <h1 className="text-4xl font-bold">
                {course.title}
            </h1>

            <p className="mt-4 text-slate-600">
                {course.description}
            </p>

            <p className="mt-4 text-xl font-bold">
                ₹{course.price}
            </p>

            <div className="mt-8 space-y-6">

                {course.chapters.map((chapter) => (
                    <Card
                        key={chapter._id}
                        className="p-6">
                        <h2 className="text-xl font-semibold">
                            {chapter.title}
                        </h2>

                        <div className="mt-4 space-y-2">

                            {chapter.lessons.map((lesson) => (
                                <Link
                                    key={lesson._id}
                                    href={`/courses/${course._id}/lessons/${lesson._id}`}>
                                    <div className="rounded-md bg-slate-50 p-3 hover:bg-slate-100">
                                        {lesson.title}
                                    </div>
                                </Link>
                            ))}

                        </div>
                    </Card>
                ))}

            </div>

            <div className="mt-8">

                {data.enrolled ? (
                    <Link href="/dashboard">
                        <Button>
                            Continue learning
                        </Button>
                    </Link>
                ) : (
                    <EnrollButton
                        courseId={course._id}
                    />
                )}

            </div>
        </main>
    );
}