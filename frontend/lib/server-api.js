import { cookies } from "next/headers";

export async function serverApiFetch(
  endpoint
) {
  const cookieStore = await cookies();

  const cookieHeader =
    cookieStore
      .getAll()
      .map(
        ({ name, value }) =>
          `${name}=${value}`
      )
      .join("; ");

  const response = await fetch(
    `${process.env.NEXT_PUBLIC_API_URL}${endpoint}`,
    {
      headers: {
        Cookie: cookieHeader,
      },

      cache: "no-store",
    }
  );

  return response;
}