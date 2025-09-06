"use client";

import { useState, useEffect, useRef, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const message = searchParams.get("message");
  const cardRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const [fullName, setFullName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [showRecoveryModal, setShowRecoveryModal] = useState(false);
  const [recoveryFullName, setRecoveryFullName] = useState("");
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  // Mouse tracking effect
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (containerRef.current && cardRef.current) {
        const container = containerRef.current.getBoundingClientRect();
        const centerX = container.left + container.width / 2;
        const centerY = container.top + container.height / 2;

        const deltaX = (e.clientX - centerX) * 0.01; // Reduced sensitivity for subtlety
        const deltaY = (e.clientY - centerY) * 0.01;

        // Apply transform to the card
        cardRef.current.style.transform = `translate(${deltaX}px, ${deltaY}px) rotateX(${
          -deltaY * 0.5
        }deg) rotateY(${deltaX * 0.5}deg)`;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");
    setLoading(true);

    try {
      const result = await signIn("credentials", {
        fullName,
        password,
        redirect: false,
      });

      if (result?.error) {
        setError("Identifiants invalides");
      } else {
        setSuccessMessage(`Bonjour, ${fullName}!`);
        setTimeout(() => {
          // For now, always redirect to home and let home page handle admin redirect
          router.push("/");
          // Force a page refresh to ensure session is properly loaded
          window.location.href = "/";
        }, 2000);
      }
    } catch {
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  };

  const handlePasswordRecovery = async (e: React.FormEvent) => {
    e.preventDefault();
    setRecoveryLoading(true);
    setError("");

    try {
      const response = await fetch("/api/admin/password-recovery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: recoveryFullName,
          email: recoveryEmail,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccessMessage(
          "Demande de récupération envoyée avec succès. Un administrateur traitera votre demande."
        );
        setShowRecoveryModal(false);
        setRecoveryFullName("");
        setRecoveryEmail("");
      } else {
        setError(data.error || "Erreur lors de l'envoi de la demande");
      }
    } catch (error) {
      console.error("Password recovery error:", error);
      setError("Une erreur s'est produite. Veuillez réessayer.");
    } finally {
      setRecoveryLoading(false);
    }
  };

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50/30 to-cyan-50/50 flex items-center justify-center p-4 relative overflow-hidden"
      style={{ perspective: "1000px" }}
    >
      {/* Subtle animated background elements - complementary to signup */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-emerald-100/40 to-teal-100/40 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-cyan-100/40 to-blue-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-20 right-1/4 w-32 h-32 bg-gradient-to-br from-green-100/30 to-emerald-100/30 rounded-full blur-2xl animate-bounce"></div>
      </div>

      {/* Floating academic icons - different positions from signup */}
      <div className="absolute top-20 right-16 text-emerald-300/40 animate-float">
        <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      </div>
      <div className="absolute top-40 left-20 text-teal-300/40 animate-float delay-500">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
        </svg>
      </div>
      <div className="absolute bottom-40 left-32 text-cyan-300/40 animate-float delay-1000">
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
          <path d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      </div>

      <div
        ref={cardRef}
        className="w-full max-w-md relative z-10 transition-all duration-300 ease-out transform-gpu"
        style={{
          transformStyle: "preserve-3d",
        }}
      >
        <div className="bg-white/80 backdrop-blur-xl border border-white/40 rounded-2xl p-8 shadow-xl shadow-slate-200/50">
          {/* Header - with different icon and color scheme */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl mb-6 shadow-lg shadow-emerald-500/25 relative group overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -skew-x-12 transform translate-x-full group-hover:translate-x-[-200%] transition-transform duration-1000"></div>
              <svg
                className="w-8 h-8 text-white relative z-10"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-slate-800 mb-2">
              Bon Retour
            </h2>
            <p className="text-slate-600">
              Continuez votre parcours d&apos;apprentissage
            </p>
            <div className="flex items-center justify-center gap-4 mt-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                Connexion Sécurisée
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-teal-500 rounded-full"></div>
                Accès Rapide
              </span>
              <span className="flex items-center gap-1">
                <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                Sûr et Rapide
              </span>
            </div>
          </div>

          {/* Success message */}
          {message && (
            <div className="bg-emerald-50/80 border border-emerald-200 rounded-xl p-4 backdrop-blur-sm mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-emerald-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-emerald-700 text-sm">{message}</p>
              </div>
            </div>
          )}

          {/* Login Success message */}
          {successMessage && (
            <div className="bg-green-50/80 border border-green-200 rounded-xl p-4 backdrop-blur-sm mb-6">
              <div className="flex items-center">
                <svg
                  className="w-5 h-5 text-green-500 mr-2"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <p className="text-green-700 text-sm font-medium">
                  {successMessage}
                </p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Nom Complet
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  required
                  className="w-full px-4 py-3 bg-white/60 border border-slate-200 rounded-xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 text-slate-800 placeholder-slate-400 hover:border-slate-300"
                  placeholder="Entrez votre nom complet"
                />
                <div className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"></div>
              </div>
            </div>

            {/* Password */}
            <div className="group">
              <label className="block text-sm font-semibold text-slate-700 mb-2">
                Mot de Passe
              </label>
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full px-4 py-3 pr-12 bg-white/60 border border-slate-200 rounded-xl focus:ring-3 focus:ring-emerald-500/20 focus:border-emerald-500 outline-none transition-all duration-300 text-slate-800 placeholder-slate-400 hover:border-slate-300"
                  placeholder="Entrez votre mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
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
                <div className="absolute left-0 bottom-0 h-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 scale-x-0 group-focus-within:scale-x-100 transition-transform duration-300 rounded-full"></div>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50/80 border border-red-200 rounded-xl p-4 backdrop-blur-sm">
                <div className="flex items-center">
                  <svg
                    className="w-5 h-5 text-red-500 mr-2"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <p className="text-red-700 text-sm">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 disabled:from-slate-400 disabled:to-slate-400 text-white font-semibold py-3.5 px-6 rounded-xl shadow-lg shadow-emerald-500/25 hover:shadow-xl hover:shadow-emerald-500/30 transition-all duration-300 transform hover:scale-[1.01] disabled:scale-100 disabled:cursor-not-allowed relative overflow-hidden group"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <span className="relative flex items-center justify-center">
                {loading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Connexion en cours...
                  </>
                ) : (
                  "Se Connecter"
                )}
              </span>
            </button>
          </form>

          {/* Password Recovery Link */}
          <div className="mt-4 text-center">
            <button
              onClick={() => setShowRecoveryModal(true)}
              className="text-emerald-600 hover:text-emerald-700 text-sm font-medium transition-colors hover:underline"
            >
              Mot de passe oublié ?
            </button>
          </div>

          {/* Additional Info - different from signup */}
          <div className="mt-6 p-4 bg-emerald-50/50 rounded-xl border border-emerald-100">
            <p className="text-xs text-slate-600 text-center">
              🔐 Vos données sont protégées avec une sécurité de niveau
              entreprise
            </p>
          </div>

          {/* Sign Up Link */}
          <div className="mt-6 text-center">
            <p className="text-slate-600 text-sm">
              Vous n&apos;avez pas de compte ?{" "}
              <a
                href="/signup"
                className="text-emerald-600 hover:text-emerald-700 font-semibold transition-colors hover:underline"
              >
                Créez-en un ici
              </a>
            </p>
          </div>
        </div>
      </div>

      {/* Password Recovery Modal */}
      {showRecoveryModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Récupération de mot de passe
            </h3>
            <p className="text-gray-600 mb-6 text-sm">
              Entrez vos informations pour demander une réinitialisation de mot
              de passe.
            </p>

            <form onSubmit={handlePasswordRecovery} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Nom complet
                </label>
                <input
                  type="text"
                  value={recoveryFullName}
                  onChange={(e) => setRecoveryFullName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-500"
                  placeholder="Votre nom complet"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adresse e-mail
                </label>
                <input
                  type="email"
                  value={recoveryEmail}
                  onChange={(e) => setRecoveryEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500 text-gray-900 placeholder-gray-500"
                  placeholder="votre.email@exemple.com"
                  required
                />
              </div>

              <div className="flex space-x-3 mt-6">
                <button
                  type="submit"
                  disabled={recoveryLoading}
                  className="flex-1 bg-emerald-600 text-white py-2 px-4 rounded-lg hover:bg-emerald-700 transition-colors disabled:opacity-50"
                >
                  {recoveryLoading ? "Envoi..." : "Envoyer la demande"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowRecoveryModal(false);
                    setRecoveryFullName("");
                    setRecoveryEmail("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    }>
      <LoginContent />
    </Suspense>
  );
}
