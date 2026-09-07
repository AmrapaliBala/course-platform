"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";

import { useAuth } from "@/context/AuthContext";

export default function LoginPage() {
  const router = useRouter();

  const { setUser } = useAuth();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");

  const [otpSent, setOtpSent] = useState(false);

  const [loading, setLoading] = useState(false);

  const [message, setMessage] = useState("");

  const requestOtp = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/request-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            email,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setOtpSent(true);
      setMessage("OTP sent to your email.");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    try {
      setLoading(true);
      setMessage("");

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/auth/verify-otp`,
        {
          method: "POST",

          headers: {
            "Content-Type": "application/json",
          },

          credentials: "include",

          body: JSON.stringify({
            email,
            otp,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      setUser(data.user);

      router.push("/dashboard");
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 p-6">
      <Card className="w-full max-w-md p-8">

        <h1 className="mb-2 text-2xl font-bold">
          Login
        </h1>

        <p className="mb-6 text-sm text-slate-500">
          Login using a one-time password.
        </p>

        <Input
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) =>
            setEmail(e.target.value)
          }
        />

        {!otpSent ? (
          <Button
            className="mt-4 w-full"
            onClick={requestOtp}
            disabled={loading}
          >
            {loading
              ? "Sending..."
              : "Send OTP"}
          </Button>
        ) : (
          <>
            <Input
              className="mt-4"
              placeholder="Enter 6-digit OTP"
              value={otp}
              onChange={(e) =>
                setOtp(e.target.value)
              }
            />

            <Button
              className="mt-4 w-full"
              onClick={verifyOtp}
              disabled={loading}
            >
              {loading
                ? "Verifying..."
                : "Verify OTP"}
            </Button>
          </>
        )}

        {message && (
          <p className="mt-4 text-sm">
            {message}
          </p>
        )}
      </Card>
    </main>
  );
}