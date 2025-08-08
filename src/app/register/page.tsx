/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";
import Link from "next/link";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [preferred_username, setPreferredUsername] = useState("");
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/register", {
        email,
        preferred_username,
        name,
        password,
      });
      toast.success("Signup successful! Please check your email to confirm.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Signup failed");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <form
        onSubmit={handleSignup}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold dark:text-gray-100">Sign Up</h2>
        <input
          type="email"
          required
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500"
        />
        <input
          type="text"
          required
          placeholder="Username"
          value={preferred_username}
          onChange={(e) => setPreferredUsername(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500"
        />
        <input
          type="text"
          required
          placeholder="Full Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500"
        />
        <input
          type="password"
          required
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg shadow-md"
        >
          {loading ? "Signing up..." : "Sign Up"}
        </button>
        <p className="text-center text-gray-600 dark:text-gray-300">
          Already have an account?{" "}
          <Link href="/login" className="text-indigo-600 hover:underline">
            Login
          </Link>
        </p>
      </form>
    </div>
  );
}
