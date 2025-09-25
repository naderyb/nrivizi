"use client";

import { useState } from "react";

export default function MaintenancePage() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!isValid) {
      setError("Please enter a valid email / Veuillez saisir un email valide");
      return;
    }

    try {
      setStatus("sending");
      const res = await fetch("/api/maintenance/notify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!res.ok) throw new Error("Request failed");
      setStatus("success");
    } catch {
      setStatus("error");
      setError(
        "Something went wrong. Please try again. / Une erreur est survenue. Réessayez."
      );
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r from-purple-500/5 to-blue-500/5 rounded-full blur-3xl animate-spin duration-[20s]"></div>
      </div>

      {/* Main card */}
      <div className="relative w-full max-w-2xl bg-gray-900/80 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-8 shadow-2xl shadow-purple-500/10 transform hover:scale-105 transition-all duration-300">
        {/* Badge */}
        <div className="text-center mb-6">
          <span className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 px-4 py-2 rounded-full text-sm font-semibold tracking-wide animate-pulse">
            <div className="w-2 h-2 bg-gray-900 rounded-full animate-ping"></div>
            MAINTENANCE
          </span>
        </div>

        {/* Main content */}
        <div className="text-center space-y-6">
          {/* English Section */}
          <div className="space-y-3">
            <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent">
              Site Under Maintenance
            </h1>
            <p className="text-lg text-gray-300 leading-relaxed">
              <span className="font-semibold text-purple-400">nrivizi</span> is currently undergoing scheduled maintenance.
            </p>
            <p className="text-gray-400">
              <span className="font-semibold text-blue-400">Nexus Club</span> apologizes for the inconvenience — we&apos;ll email you as soon as it&apos;s ready.
            </p>
          </div>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gradient-to-r from-transparent via-gray-600 to-transparent"></div>
            </div>
            <div className="relative flex justify-center">
              <div className="bg-gray-900 px-4">
                <div className="flex space-x-1">
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce"></div>
                  <div className="w-1 h-1 bg-blue-400 rounded-full animate-bounce delay-100"></div>
                  <div className="w-1 h-1 bg-purple-400 rounded-full animate-bounce delay-200"></div>
                </div>
              </div>
            </div>
          </div>

          {/* French Section */}
          <div className="space-y-3">
            <h2 className="text-2xl font-bold text-gray-100">
              Site en Maintenance
            </h2>
            <p className="text-gray-300">
              <span className="font-semibold text-purple-400">nrivizi</span> est actuellement en maintenance programmée.
            </p>
            <p className="text-gray-400">
              <span className="font-semibold text-blue-400">Nexus Club</span> s&apos;excuse du désagrément — on vous enverra un email dès qu&apos;il sera prêt.
            </p>
          </div>

          {/* Email form */}
          <div className="space-y-4 mt-8">
            <label htmlFor="email" className="block text-left text-gray-200 font-medium">
              Get notified by email / Soyez averti par email
            </label>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <div className="flex-1 relative">
                <input
                  id="email"
                  type="email"
                  inputMode="email"
                  placeholder="your.email@example.com / votre.email@exemple.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  disabled={status === "sending" || status === "success"}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 transition-all duration-200 backdrop-blur-sm disabled:opacity-50 disabled:cursor-not-allowed"
                  onKeyDown={(e) => e.key === 'Enter' && onSubmit(e)}
                />
                {status === "success" && (
                  <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                    <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              
              <button
                type="button"
                onClick={onSubmit}
                disabled={status === "sending" || status === "success"}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold rounded-xl transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-105 active:scale-95 shadow-lg hover:shadow-purple-500/25 flex items-center justify-center gap-2 min-w-[140px]"
              >
                {status === "sending" ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Sending…
                  </>
                ) : status === "success" ? (
                  <>
                    <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </div>
                    Sent!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                    Notify me / Prévenez‑moi
                  </>
                )}
              </button>
            </div>

            {/* Status messages */}
            {status === "success" && (
              <div className="p-4 bg-green-500/10 border border-green-500/20 rounded-xl">
                <p className="text-green-400 text-center flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  We&apos;ll notify you when it&apos;s back. / Nous vous avertirons dès le retour du site.
                </p>
              </div>
            )}
            
            {error && (
              <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-xl">
                <p className="text-red-400 text-center flex items-center justify-center gap-2">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <p className="text-sm text-gray-500 mt-8 flex items-center justify-center gap-2">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            Thank you for your patience / Merci pour votre patience
          </p>
        </div>
      </div>
    </div>
  );
}