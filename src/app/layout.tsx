import "./globals.css";
import { Toaster } from "sonner";
import { AuthProvider } from "@/context/AuthContext";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Nebula Mock Challenge",
  description:
    "Mock code challenge for senior full stack engineer role at Nebula",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-gray-100 dark:bg-gray-900">
      <head />
      <body className="min-h-screen flex flex-col">
        <AuthProvider>
          <Toaster richColors position="top-right" />
          <header className="bg-white dark:bg-gray-800 shadow-md p-4 flex justify-between items-center">
            <h1 className="text-indigo-600 dark:text-indigo-400 font-bold text-xl">
              Leaderboard App
            </h1>
          </header>
          <main className="flex-grow max-w-4xl mx-auto p-6">{children}</main>
        </AuthProvider>
      </body>
    </html>
  );
}
