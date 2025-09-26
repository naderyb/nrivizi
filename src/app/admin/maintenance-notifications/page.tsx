"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

interface Subscriber {
  email: string;
  created_at: string;
}

export default function MaintenanceAdminPage() {
  const { data: session, status } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSubscribers, setIsLoadingSubscribers] = useState(false);
  const [message, setMessage] = useState("");
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);

  const fetchSubscribers = async () => {
    setIsLoadingSubscribers(true);
    setMessage("");

    try {
      const response = await fetch("/api/maintenance/subscribers");

      if (response.ok) {
        const data = await response.json();
        setSubscribers(data.subscribers || []);
        setMessage(`📊 Found ${data.count} email subscribers`);
      } else {
        const error = await response.json();
        setMessage(`❌ Error fetching subscribers: ${error.error}`);
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error}`);
    } finally {
      setIsLoadingSubscribers(false);
    }
  };

  const sendCompleteNotifications = async () => {
    if (subscribers.length === 0) {
      setMessage("❌ No subscribers to notify. Load subscribers first.");
      return;
    }

    if (
      !confirm(
        `Are you sure you want to send "back online" notifications to ${subscribers.length} subscribers?`
      )
    ) {
      return;
    }

    setIsLoading(true);
    setMessage("📧 Sending notifications...");

    try {
      const response = await fetch("/api/maintenance/complete", {
        method: "POST",
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`✅ ${data.message}`);
        // Optionally clear subscribers after successful send
        // setSubscribers([]);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
    } catch (error) {
      setMessage(`❌ Network error: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Auto-load subscribers on page load
  useEffect(() => {
    fetchSubscribers();
  }, []);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    );
  }

  if (!session || session.user?.role !== "admin") {
    redirect("/login");
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔧 Maintenance Management
          </h1>
          <p className="text-gray-600">
            Manage maintenance notifications and subscriber communications
          </p>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Subscribers Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">
                📧 Email Subscribers
              </h2>
              <span className="bg-blue-100 text-blue-800 text-sm font-medium px-3 py-1 rounded-full">
                {subscribers.length} subscribers
              </span>
            </div>

            <button
              onClick={fetchSubscribers}
              disabled={isLoadingSubscribers}
              className="w-full bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed mb-6 transition-colors"
            >
              {isLoadingSubscribers ? (
                <span className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Refreshing...
                </span>
              ) : (
                `🔄 Refresh Subscribers (${subscribers.length})`
              )}
            </button>

            {/* Subscribers List */}
            <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
              {subscribers.length > 0 ? (
                <div className="space-y-2">
                  {subscribers.map((subscriber, index) => (
                    <div
                      key={index}
                      className="bg-white p-3 rounded-lg border border-gray-200 flex items-center justify-between"
                    >
                      <div className="flex items-center space-x-3">
                        <span className="text-blue-600">📧</span>
                        <span className="text-sm font-medium text-gray-900">
                          {subscriber.email}
                        </span>
                      </div>
                      <span className="text-xs text-gray-500">
                        {new Date(subscriber.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center text-gray-500 py-8">
                  <span className="text-4xl mb-4 block">📪</span>
                  <p>No subscribers found</p>
                  <p className="text-sm">
                    Users who sign up for maintenance notifications will appear
                    here
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Actions Card */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">
              🚀 Send Notifications
            </h2>

            <div className="space-y-6">
              {/* Back Online Notification */}
              <div className="border border-green-200 rounded-lg p-4 bg-green-50">
                <h3 className="text-lg font-medium text-green-900 mb-3">
                  🎉 Send &quot;Back Online&quot; Notifications
                </h3>
                <p className="text-sm text-green-700 mb-4">
                  This will notify all subscribers that nrivizi is back online
                  and maintenance is complete.
                </p>
                <button
                  onClick={sendCompleteNotifications}
                  disabled={isLoading || subscribers.length === 0}
                  className="w-full bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading ? (
                    <span className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Sending...
                    </span>
                  ) : (
                    `🎉 Send to ${subscribers.length} Subscribers`
                  )}
                </button>
              </div>

              {/* Message Display */}
              {message && (
                <div className="border rounded-lg p-4 bg-gray-50">
                  <h4 className="font-medium text-gray-900 mb-2">Status:</h4>
                  <p className="text-sm text-gray-700 whitespace-pre-line">
                    {message}
                  </p>
                </div>
              )}

              {/* Instructions */}
              <div className="border border-yellow-200 rounded-lg p-4 bg-yellow-50">
                <h4 className="font-medium text-yellow-900 mb-2">
                  📝 Instructions:
                </h4>
                <ol className="text-sm text-yellow-800 space-y-1">
                  <li>
                    1. Click &quot;Refresh Subscribers&quot; to load current email list
                  </li>
                  <li>2. Review the subscriber list</li>
                  <li>3. Click &quot;Send to X Subscribers&quot; to notify everyone</li>
                  <li>4. Users will receive beautiful bilingual emails</li>
                </ol>
              </div>
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="mt-8 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            📊 Statistics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-blue-600">
                {subscribers.length}
              </div>
              <div className="text-sm text-blue-700">Total Subscribers</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-green-600">
                {
                  subscribers.filter(
                    (s) =>
                      new Date(s.created_at) >
                      new Date(Date.now() - 24 * 60 * 60 * 1000)
                  ).length
                }
              </div>
              <div className="text-sm text-green-700">Last 24 Hours</div>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <div className="text-2xl font-bold text-purple-600">
                {subscribers.length > 0
                  ? new Date(subscribers[0].created_at).toLocaleDateString()
                  : "N/A"}
              </div>
              <div className="text-sm text-purple-700">Latest Signup</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
