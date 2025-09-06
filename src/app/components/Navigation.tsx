"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";

export default function Navigation() {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return (
      <nav
        className="border-b shadow-lg p-4"
        style={{
          background: "rgba(255, 255, 255, 0.95)",
          backdropFilter: "blur(10px)",
          borderColor: "rgba(255, 255, 255, 0.2)",
        }}
      >
        <div className="container mx-auto flex justify-between items-center">
          <Link href="/" className="flex items-center space-x-2">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center"
              style={{
                background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
              }}
            >
              <span className="text-white font-bold">n</span>
            </div>
            <span className="text-xl font-bold text-gray-800">nrivizi</span>
          </Link>
          <div className="text-gray-500">Loading...</div>
        </div>
      </nav>
    );
  }

  return (
    <nav
      className="border-b shadow-lg p-4"
      style={{
        background: "rgba(255, 255, 255, 0.95)",
        backdropFilter: "blur(10px)",
        borderColor: "rgba(255, 255, 255, 0.2)",
      }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="flex items-center space-x-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{
              background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
            }}
          >
            <span className="text-white font-bold">n</span>
          </div>
          <span className="text-xl font-bold text-gray-800">nrivizi</span>
        </Link>

        <div className="flex items-center space-x-4">
          {session ? (
            <>
              <span className="text-gray-700 hidden sm:block">
                Hello, {session.user?.name || session.user?.email}
              </span>
              <button
                onClick={() => signOut()}
                className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #ef4444, #dc2626)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 rounded-lg text-white font-medium transition-all duration-200 hover:shadow-lg"
                style={{
                  background: "linear-gradient(135deg, #06b6d4, #8b5cf6)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "scale(1.05)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "scale(1)";
                }}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
