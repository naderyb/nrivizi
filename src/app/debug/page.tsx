"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

export default function SessionDebug() {
  const { data: session, status } = useSession();

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Session Debug</h1>

        <div className="bg-white rounded-lg p-6 shadow-lg">
          <h2 className="text-xl font-semibold mb-4">
            Session Status: {status}
          </h2>

          <div className="space-y-4">
            <div>
              <strong>Session Data:</strong>
              <pre className="bg-gray-100 p-4 rounded mt-2 overflow-auto">
                {JSON.stringify(session, null, 2)}
              </pre>
            </div>

            <div>
              <strong>User Role:</strong>
              <span className="ml-2 px-3 py-1 bg-blue-100 text-blue-800 rounded">
                {session?.user?.role || "No role"}
              </span>
            </div>

            <div>
              <strong>User Name:</strong>
              <span className="ml-2">{session?.user?.name || "No name"}</span>
            </div>

            <div>
              <strong>User Email:</strong>
              <span className="ml-2">{session?.user?.email || "No email"}</span>
            </div>
          </div>

          <div className="mt-6 space-x-4">
            <Link
              href="/admin"
              className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 inline-block"
            >
              Go to Admin Panel
            </Link>
            <Link
              href="/"
              className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 inline-block"
            >
              Go to Home
            </Link>
            <Link
              href="/login"
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 inline-block"
            >
              Go to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
