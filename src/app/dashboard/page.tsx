"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const [score, setScore] = useState("");
  const [leader, setLeader] = useState("");
  const [topScore, setTopScore] = useState<number | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);

  useEffect(() => {
    if (!user) router.push("/login");
  }, [user, router]);

  useEffect(() => {
    fetchLeaderboard();
  }, []);

  async function fetchLeaderboard() {
    try {
      const res = await axios.get("/api/leaderboard");
      setLeader(res.data.topScore.user_name.S);
      setTopScore(res.data.topScore.score.N);
    } catch {
      toast.error("Failed to fetch leaderboard");
    }
  }

  async function submitScore() {
    if (Number(score) < 0) {
      toast.error("Score must be positive");
      return;
    }
    setLoadingSubmit(true);
    try {
      await axios.post("/api/submit-score", {
        score: Number(score),
      });
      toast.success("Score submitted!");
      setScore("");
      fetchLeaderboard();
    } catch {
      toast.error("Failed to submit score");
    }
    setLoadingSubmit(false);
  }

  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <header className="flex justify-between items-center">
        <h2 className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">
          Welcome,
        </h2>
        <button
          onClick={() => {
            logout();
            router.push("/login");
          }}
          className="bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
        >
          Logout
        </button>
      </header>

      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold dark:text-gray-200">
          Submit Your Score
        </h3>
        <input
          type="tel"
          value={score}
          onChange={(e) => setScore(e.target.value)}
          className="w-full p-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 focus:ring-indigo-500"
        />
        <button
          onClick={submitScore}
          disabled={loadingSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg shadow-md"
        >
          {loadingSubmit ? "Submitting..." : "Submit Score"}
        </button>
      </section>

      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 space-y-4">
        <h3 className="text-xl font-semibold dark:text-gray-200">
          Leaderboard
        </h3>
        {!topScore && (
          <p className="text-gray-500 dark:text-gray-400">No scores yet.</p>
        )}
        <ul className="space-y-2">
          <li className="p-4 bg-gray-100 dark:bg-gray-700 rounded-lg flex justify-between font-medium">
            <span>{leader}</span>
            <span className="text-indigo-600 dark:text-indigo-400">
              {topScore}
            </span>
          </li>
        </ul>
      </section>
    </div>
  );
}
