/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import { useAuth } from "@/context/AuthContext";
import { useEffect, useState } from "react";
import { toast } from "sonner";

interface ScoreEntry {
  id: string;
  user_name: string;
  score: number;
  timestamp: number;
}

const Leaderboard = () => {
  const { isAuthenticated, accessToken } = useAuth();
  const [scores, setScores] = useState<ScoreEntry[]>([]);
  const [loadingScores, setLoadingScores] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [score, setScore] = useState<number | "">("");
  const [error, setError] = useState<string | null>(null);

  async function fetchLeaderboard() {
    setLoadingScores(true);
    setError(null);
    try {
      const res = await fetch("/api/leaderboard", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to load leaderboard");
      }
      const data = await res.json();
      setScores(data.topScore ?? []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoadingScores(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (score === "" || score < 0) {
      toast.error("Please enter a valid score.");
      return;
    }
    setLoadingSubmit(true);
    setError(null);

    try {
      const res = await fetch("/api/submit-score", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ score: Number(score) }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.message || "Failed to submit score");
      }

      toast.success("Score submitted successfully!");
      setScore("");
      fetchLeaderboard();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setLoadingSubmit(false);
    }
  }

  useEffect(() => {
    if (isAuthenticated) {
      fetchLeaderboard();
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4">
        <p className="text-center text-lg text-gray-700">
          Please log in to view the leaderboard and submit your score.
        </p>
      </main>
    );
  }

  return (
    <main className="flex min-h-screen flex-col items-center bg-gray-50 px-4 py-8">
      <h1 className="mb-6 text-3xl font-semibold">Leaderboard</h1>

      <section className="mb-10 w-full max-w-3xl overflow-x-auto rounded border border-gray-300 bg-white shadow">
        {loadingScores ? (
          <p className="p-6 text-center text-gray-600">
            Loading leaderboard...
          </p>
        ) : error ? (
          <p className="p-6 text-center text-red-600">{error}</p>
        ) : scores.length === 0 ? (
          <p className="p-6 text-center text-gray-700">
            No scores submitted yet.
          </p>
        ) : (
          <table className="w-full table-auto">
            <thead className="bg-gray-100 text-left text-sm font-semibold text-gray-700">
              <tr>
                <th className="border px-4 py-3">User</th>
                <th className="border px-4 py-3 text-right">Score</th>
                <th className="border px-4 py-3 text-right">Date</th>
              </tr>
            </thead>
            <tbody>
              {scores.map(({ id, user_name, score, timestamp }) => (
                <tr key={id} className="even:bg-gray-50">
                  <td className="border px-4 py-2">{user_name}</td>
                  <td className="border px-4 py-2 text-right">{score}</td>
                  <td className="border px-4 py-2 text-right">
                    {new Date(timestamp * 1000).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>

      <section className="w-full max-w-sm rounded bg-white p-6 shadow">
        <form onSubmit={handleSubmit}>
          <label className="mb-2 block font-medium">Enter Your Score</label>
          <input
            type="number"
            min={0}
            required
            value={score}
            onChange={(e) =>
              setScore(e.target.value === "" ? "" : Number(e.target.value))
            }
            className="mb-6 w-full rounded border border-gray-300 p-2"
            placeholder="e.g. 1234"
          />
          <button
            type="submit"
            disabled={loadingSubmit}
            className="w-full rounded bg-blue-600 py-2 text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loadingSubmit ? "Submitting..." : "Submit Score"}
          </button>
        </form>
      </section>
    </main>
  );
};

export default Leaderboard;
