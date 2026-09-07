"use client";

import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";

export default function EnrollButton({
  courseId,
}) {
  const router = useRouter();

  const enroll = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/enrollments`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            courseId,
          }),
        }
      );

      const data = await response.json();

      if (response.status === 401) {
        router.push("/login");
        return;
      }

      if (!response.ok) {
        throw new Error(data.message);
      }

      router.refresh();
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <Button onClick={enroll}>
      Enroll
    </Button>
  );
}