/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

const ConfirmSignup = () => {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/auth/confirm-signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferred_username: username,
          confirmationCode: code,
        }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData?.message || "Confirmation failed");
      }

      toast.success("Account confirmed! You can now log in.");
      router.push("/login");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="mb-6 text-3xl font-semibold">Confirm Account</h1>
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm rounded bg-white p-6 shadow"
      >
        <label className="mb-2 block font-medium">Username</label>
        <input
          type="text"
          required
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="mb-4 w-full rounded border border-gray-300 p-2"
          placeholder="Enter username"
        />

        <label className="mb-2 block font-medium">Confirmation Code</label>
        <input
          type="text"
          required
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="mb-6 w-full rounded border border-gray-300 p-2"
          placeholder="Enter code from email"
        />

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Confirming..." : "Confirm account"}
        </button>
      </form>
    </main>
  );
};

export default ConfirmSignup;
