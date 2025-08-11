/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const Register = () => {
  const [preferredUsername, setPreferredUsername] = useState("");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferred_username: preferredUsername,
          email,
          name,
          password,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || "Signup failed");
      }

      toast.success(
        "Signup successful! Please check your email to confirm your account."
      );
      router.push("/confirm-signup");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="mb-6 text-3xl font-semibold">Sign Up</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded bg-white p-6 shadow"
      >
        <label className="mb-2 block font-medium">Preferred Username</label>
        <input
          type="text"
          required
          value={preferredUsername}
          onChange={(e) => setPreferredUsername(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 p-2"
          placeholder="Choose a username"
        />

        <label className="mb-2 block font-medium">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 p-2"
          placeholder="you@example.com"
        />

        <label className="mb-2 block font-medium">Full Name</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 p-2"
          placeholder="Your full name"
        />

        <label className="mb-2 block font-medium">Password</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-6 w-full rounded border border-gray-300 p-2"
          placeholder="Create a password"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </main>
  );
};

export default Register;
