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
      buttons: [
        { name: "LAC1", href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/EhuySCHiiqNLtkuBxGswF7sBUQG9-jiQVJBJoM4KZWGg6Q?e=tR26VO" },
        { name: "LAC2", href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/ElE6px4MYJdCkUrtIMCtXEgB8OZRWVbaDrRtMHIC7KkvhQ?e=Vvg9GQ" },
        { name: "LAC3", href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/EjHDE50qHRZKmuyOq27eSAcBpTZ0E1vFdnAqiyZvwRcTRQ?e=FVs5u7" },
      ],
    },
    {
      title: "Informatique",
      icon: "💻",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      buttons: [
        { name: "LMI1", href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/Ej7z3cFUlQxHsHMFcTfPDC8BQKQhfbrKatwOnjlqH8W2ng?e=wozqx4" },
        { name: "LMI2", href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/Em4TQW_J6y5HuR_fS1wnffoBFz_5Q_XHRY24Y54Zk7oSQw?e=lxsb1t" },
      ],
    },
    {
      title: "Comptabilité et Finance",
      icon: "📊",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      buttons: [{ name: "LCF1", href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/EimXHyOky1tOkihLF4dl89QBijqrkmdw1MWrdqdIrahiKA?e=td5Udh" }],
    },
    {
      title: "Extra et Divers",
      icon: "📚",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      buttons: [{ name: "Livre", href: "https://insagbs-my.sharepoint.com/:f:/g/personal/nexusclub_insag_edu_dz/El9M2AgtmydEqlZhbjLNqLcBO4z7INvPJ_EJpTNH1u19fA?e=HZ0UoE" }],
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-teal-100 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
        <div className="absolute top-40 left-40 w-80 h-80 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Navbar */}
        <nav className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-14">
              {/* Right side - nrivizi logo */}
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
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
                className={`${section.bgColor} rounded-xl p-5 shadow-lg border border-white/30 hover:shadow-xl transition-all duration-200 backdrop-blur-sm bg-white/60`}
              >
                {/* Section Header */}
                <div className="flex items-center space-x-3 mb-4">
                  <div
                    className={`w-10 h-10 bg-gradient-to-r ${section.color} rounded-lg flex items-center justify-center shadow-md`}
                  >
                    <span className="text-lg">{section.icon}</span>
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    {section.title}
                  </h3>
                </div>

                {/* Buttons */}
                <div className="space-y-2">
                  {section.buttons.map((button, buttonIndex) => (
                    <a
                      key={buttonIndex}
                      href={button.href}
                      className={`block w-full bg-gradient-to-r ${section.color} text-white py-2.5 px-4 rounded-lg hover:shadow-lg transition-all duration-200 text-sm font-medium text-center transform hover:scale-105`}
                    >
                      {button.name}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-white/80 backdrop-blur-md py-8 mt-12 border-t border-white/20">
          <div className="max-w-6xl mx-auto px-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Club Info */}
              <div className="text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start space-x-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-sm">N</span>
                  </div>
                  <span className="text-gray-800 font-semibold text-lg">
                    nrivizi
                  </span>
                </div>
                <p className="text-gray-600 text-sm mb-4">
                  Club étudiant dédié à l&apos;excellence académique et au
                  développement professionnel. Nous accompagnons nos membres
                  vers la réussite dans leurs études et leur carrière.
                </p>
                <div className="flex justify-center md:justify-start space-x-3">
                  <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-700 transition-colors shadow-md">
                    <span className="text-xs">📘</span>
                  </div>
                  <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center cursor-pointer hover:bg-blue-500 transition-colors shadow-md">
                    <span className="text-xs">🐦</span>
                  </div>
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center cursor-pointer hover:bg-purple-700 transition-colors shadow-md">
                    <span className="text-xs">📸</span>
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div className="text-center md:text-left">
                <h4 className="text-gray-800 font-semibold mb-4">Contact</h4>
                <div className="space-y-3 text-gray-600 text-sm">
                  <p className="flex items-center justify-center md:justify-start space-x-2">
                    <span>📧</span>
                    <span>contact@nrivizi.club</span>
                  </p>
                  <p className="flex items-center justify-center md:justify-start space-x-2">
                    <span>📱</span>
                    <span>+33 1 23 45 67 89</span>
                  </p>
                  <p className="flex items-center justify-center md:justify-start space-x-2">
                    <span>📍</span>
                    <span>Campus Universitaire, Bât. A</span>
                  </p>
                  <p className="flex items-center justify-center md:justify-start space-x-2">
                    <span>🕒</span>
                    <span>Lun-Ven: 9h-18h</span>
                  </p>
                </div>
              </div>

              {/* Quick Links */}
              <div className="text-center md:text-left">
                <h4 className="text-gray-800 font-semibold mb-4">
                  Liens Rapides
                </h4>
                <ul className="space-y-3 text-gray-600 text-sm">
                  <li>
                    <a
                      href="#"
                      className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-start space-x-2"
                    >
                      <span>🎯</span>
                      <span>Nos Objectifs</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-start space-x-2"
                    >
                      <span>🏆</span>
                      <span>Réussites</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-start space-x-2"
                    >
                      <span>📅</span>
                      <span>Événements</span>
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      className="hover:text-purple-600 transition-colors flex items-center justify-center md:justify-start space-x-2"
                    >
                      <span>💡</span>
                      <span>Ressources</span>
                    </a>
                  </li>
                </ul>
              </div>
            </div>

            {/* Bottom */}
            <div className="border-t border-gray-200 mt-8 pt-6 text-center">
              <p className="text-gray-500 text-sm">
                © 2025 nrivizi Club - Tous droits réservés | Fait avec ❤️ pour
                nos étudiants
              </p>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}
