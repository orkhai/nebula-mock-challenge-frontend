/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { toast } from "sonner";
import axios from "axios";

export default function ConfirmPage() {
  const [username, setUsername] = useState("");
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleConfirm(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post("/api/auth/confirm-signup", {
        preferred_username: username,
        confirmationCode: code,
      });
      toast.success("Email confirmed! You can now login.");
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Confirmation failed");
    }
    setLoading(false);
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 p-4">
      <form
        onSubmit={handleConfirm}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-md space-y-6"
      >
        <h2 className="text-2xl font-bold dark:text-gray-100">Confirm Email</h2>
        <input
          type="username"
          required
          placeholder="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500"
        />
        <input
          type="text"
          required
          placeholder="Confirmation Code"
          value={code}
          onChange={(e) => setCode(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500"
        />
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-2 rounded-lg shadow-md"
        >
          {loading ? "Confirming..." : "Confirm"}
        </button>
      </form>
    </div>
  );
}
