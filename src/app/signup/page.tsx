"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useTranslation } from "@/contexts/LanguageContext";
import LanguageSwitcher from "@/components/LanguageSwitcher";

export default function SignupPage() {
  const { t } = useTranslation();
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [form, setForm] = useState({
    fullName: "",
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && cardRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        const centerX = container.left + container.width / 2;
        const centerY = container.top + container.height / 2;

        const deltaX = (e.clientX - centerX) * 0.01;
        const deltaY = (e.clientY - centerY) * 0.01;

        cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) rotateX(${
          -deltaY * 0.5
        }deg) rotateY(${deltaX * 0.5}deg)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    if (!form.fullName || !form.email || !form.password) {
      setError(t("errors.required"));
      setLoading(false);
      return;
    }

    if (form.password.length < 8) {
      setError(t("errors.passwordLength"));
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        router.push("/login?message=signup-success");
      } else {
        const data = await response.json();
        setError(data.error || t("errors.signupFailed"));
      }
    } catch {
      setError(t("errors.networkError"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50 flex items-center justify-center p-4 relative overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Language Switcher */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageSwitcher />
      </div>

      {/* Subtle animated background elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-100/40 to-purple-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-20 left-1/4 w-32 h-32 bg-gradient-to-br from-emerald-100/30 to-teal-100/30 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Floating academic icons */}
      <div className="absolute top-16 left-16 text-blue-300/40 animate-float">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 3L1 9l4 2.18v6L12 21l7-3.82v-6l2-1.09V17h2V9L12 3zm6.82 6L12 12.72 5.18 9 12 5.28 18.82 9zM17 15.99l-5 2.73-5-2.73v-3.72L12 15l5-2.73v3.72z" />
        </svg>
      </div>

      <div className="absolute bottom-16 right-20 text-indigo-300/40 animate-float delay-500">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
      </div>

      <div
        ref={cardRef}
        className="w-full max-w-md relative z-10 transition-all duration-300 ease-out transform-gpu"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div
          className="bg-white/90 safari-blur border border-white/40 rounded-2xl p-6 shadow-xl shadow-slate-200/50"
          style={{
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            backgroundColor: "rgba(255, 255, 255, 0.9)",
          }}
        >
          {/* Header */}
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-lg">
              <svg
                className="w-8 h-8 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-1">
              {t("auth.signupTitle")}
            </h2>
            <p className="text-slate-600 text-sm">{t("auth.signupSubtitle")}</p>
            <div className="flex items-center justify-center gap-3 mt-3 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-blue-500 rounded-full"></div>
                {t("common.computerScience")}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full"></div>
                {t("common.marketing")}
              </span>
              <span className="flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-purple-500 rounded-full"></div>
                {t("common.finance")}
              </span>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Full Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t("auth.fullName")}
              </label>
              <div className="relative">
                <input
                  type="text"
                  name="fullName"
                  value={form.fullName}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400"
                  placeholder={t("auth.fullName")}
                />
                <div className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"></div>
              </div>
            </div>

            {/* Email */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t("common.email")}
              </label>
              <div className="relative">
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400"
                  placeholder={t("auth.emailPlaceholder")}
                />
                <div className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"></div>
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                {t("common.password")}
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={form.password}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 bg-slate-50/50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-slate-700 placeholder-slate-400 pr-12"
                  placeholder={t("common.password")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  title={
                    showPassword
                      ? t("auth.hidePassword")
                      : t("auth.showPassword")
                  }
                >
                  {showPassword ? (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                      />
                    </svg>
                  ) : (
                    <svg
                      className="w-5 h-5"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                      />
                    </svg>
                  )}
                </button>
                <div className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-blue-500 to-indigo-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"></div>
              </div>
              <p className="text-xs text-slate-500 mt-1">
                {t("auth.passwordRequirement")}
              </p>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 text-white py-3 px-6 rounded-xl font-semibold hover:from-blue-600 hover:via-indigo-600 hover:to-purple-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98] shadow-lg hover:shadow-xl"
            >
              <span className="relative flex items-center justify-center">
                {loading ? (
                  <>
                    <span className="relative flex items-center justify-center">
                      <span className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></span>
                      <span className="opacity-75">
                        {t("auth.creatingAccount")}
                      </span>
                    </span>
                  </>
                ) : (
                  t("common.signup")
                )}
              </span>
            </button>
          </form>

          {/* Additional Info */}
          <div className="mt-4 p-3 bg-blue-50/50 rounded-xl border border-blue-100">
            <p className="text-xs text-slate-600 text-center">
              🎓 {t("auth.joinStudents")}
            </p>
          </div>

          {/* Sign In Link */}
          <div className="mt-4 text-center">
            <p className="text-slate-600 text-sm">
              {t("auth.hasAccount")}{" "}
              <a
                href="/login"
                className="text-blue-600 hover:text-blue-700 font-semibold transition-colors hover:underline"
              >
                {t("auth.signInHere")}
              </a>
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-10px);
          }
        }
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
}
