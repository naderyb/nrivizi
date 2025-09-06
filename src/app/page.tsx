"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Redirect admin users to admin panel
    if (session?.user?.role === "admin") {
      router.push("/admin");
    }
  }, [session, router]);

  const handleLogout = async () => {
    setLoading(true);
    await signOut({ callbackUrl: "/login" });
  };

  if (status === "loading") {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="w-8 h-8 border-4 border-gray-200 border-t-blue-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!session) {
    router.push("/login");
    return null;
  }

  const sections = [
    {
      title: "Action Commerciale",
      icon: "💼",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      buttons: ["LLAC1", "LAC2", "LAC3"],
    },
    {
      title: "Informatique",
      icon: "💻",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      buttons: ["LMI1", "LMI2"],
    },
    {
      title: "Comptabilité et Finance",
      icon: "📊",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      buttons: ["LCF1"],
    },
    {
      title: "Extra et Divers",
      icon: "📚",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      buttons: ["Livre"],
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-white shadow-sm border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-14">
            {/* Right side - nrivizi logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h1 className="text-xl font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                nrivizi
              </h1>
            </div>

            {/* Left side - user info and logout */}
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <div className="w-7 h-7 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs font-semibold">
                    {session.user?.name?.charAt(0)?.toUpperCase()}
                  </span>
                </div>
                <span className="text-gray-700 text-sm font-medium">
                  {session.user?.name}
                </span>
              </div>
              <button
                onClick={handleLogout}
                disabled={loading}
                className="bg-red-500 hover:bg-red-600 text-white px-3 py-1.5 rounded-md transition-colors duration-200 text-xs font-medium disabled:opacity-50"
              >
                {loading ? "..." : "Déconnexion"}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-semibold text-gray-800 mb-2">
            Salut {session.user?.name} 👋
          </h2>
          <p className="text-gray-500 text-sm">
            Choisis ton domaine pour commencer
          </p>
        </div>

        {/* Sections Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-12">
          {sections.map((section, index) => (
            <div
              key={index}
              className={`${section.bgColor} rounded-xl p-5 shadow-sm border border-gray-100 hover:shadow-md transition-all duration-200`}
            >
              {/* Section Header */}
              <div className="flex items-center space-x-3 mb-4">
                <div
                  className={`w-10 h-10 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center`}
                >
                  <span className="text-lg">{section.icon}</span>
                </div>
                <h3 className="text-lg font-medium text-gray-700">
                  {section.title}
                </h3>
              </div>

              {/* Buttons */}
              <div className="space-y-2">
                {section.buttons.map((button, buttonIndex) => (
                  <button
                    key={buttonIndex}
                    className={`w-full bg-gradient-to-r ${section.color} text-white py-2 px-4 rounded-lg hover:shadow-sm transition-all duration-200 font-medium text-sm`}
                  >
                    {button}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8 mt-12">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            {/* Club Info */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">N</span>
              </div>
              <h3 className="text-lg font-medium">nrivizi</h3>
            </div>

            {/* Contact */}
            <div className="text-center md:text-left">
              <p className="text-gray-300 text-sm">
                📧 contact@nrivizi.club | 📱 +33 1 23 45 67 89
              </p>
            </div>

            {/* Social */}
            <div className="flex space-x-3">
              <div className="w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors">
                <span className="text-xs">�</span>
              </div>
              <div className="w-7 h-7 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors">
                <span className="text-xs">�</span>
              </div>
            </div>
          </div>

          {/* Bottom */}
          <div className="border-t border-gray-700 mt-6 pt-4 text-center">
            <p className="text-gray-400 text-xs">
              © 2025 nrivizi Club - Fait avec ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
