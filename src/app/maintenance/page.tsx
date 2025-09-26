"use client";

import { useState } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/contexts/LanguageContext";

export default function MaintenancePage() {
  const { t } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setLoading(true);
    try {
      const response = await fetch("/api/maintenance/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (response.ok) {
        setIsSubmitted(true);
      }
    } catch (error) {
      console.error("Error submitting email:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-100/40 to-purple-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      {/* Main Content */}
      <div className="w-full max-w-2xl relative z-10">
        <div className="bg-white/90 backdrop-blur-sm border border-white/40 rounded-2xl p-8 shadow-xl text-center">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
              <span className="text-3xl text-white font-bold">N</span>
            </div>
          </div>

          {/* Title */}
          <h1 className="text-4xl font-bold text-gray-800 mb-4">
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              nrivizi
            </span>
          </h1>

          {/* Maintenance Icon */}
          <div className="mb-6">
            <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-4xl">🔧</span>
            </div>
          </div>

          {/* Main Message */}
          <h2 className="text-2xl font-bold text-gray-800 mb-4">
            {t("maintenance.title")}
          </h2>

          <p className="text-gray-600 mb-6 text-lg leading-relaxed">
            {t("maintenance.message")}
          </p>

          {/* Nexus Club Apology */}
          <div className="bg-blue-50 rounded-lg p-4 mb-8">
            <p className="text-blue-800 font-medium">
              {t("maintenance.apology")}
            </p>
          </div>

          {/* Email Notification Form */}
          {!isSubmitted ? (
            <form onSubmit={handleEmailSubmit} className="max-w-md mx-auto">
              <p className="text-gray-700 mb-4 font-medium">
                {t("maintenance.emailPrompt")}
              </p>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t("maintenance.emailPlaceholder")}
                  className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-700"
                  required
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg hover:shadow-lg transition-all duration-200 disabled:opacity-50"
                >
                  {loading
                    ? t("maintenance.submitting")
                    : t("maintenance.notify")}
                </button>
              </div>
            </form>
          ) : (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 max-w-md mx-auto">
              <div className="flex items-center justify-center mb-2">
                <svg
                  className="w-6 h-6 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-green-700 font-medium">
                  {t("maintenance.thankYou")}
                </span>
              </div>
              <p className="text-green-600 text-sm mb-3">
                {t("maintenance.confirmMessage")}
              </p>
              {/* Spam Check Message */}
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3 mt-3">
                <p className="text-yellow-800 text-xs">
                  {t("maintenance.checkSpam")}
                </p>
              </div>
            </div>
          )}

          {/* Contact Info */}
          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-gray-600 text-sm mb-2">
              {t("maintenance.contactInfo")}
            </p>
            <div className="flex items-center justify-center space-x-4 text-sm text-gray-500">
              <span>📧 nexusclub@insag.edu.dz</span>
              <span>📍 Campus IFAG, Hydra, Alger</span>
            </div>
          </div>

          {/* Estimated Time */}
          <div className="mt-6 bg-yellow-50 rounded-lg p-4">
            <p className="text-yellow-800 font-medium text-sm">
              {t("maintenance.estimatedTime")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
