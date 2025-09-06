"use client";

import { useState, useEffect } from "react";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useTranslation } from "@/contexts/LanguageContext";
import Image from "next/image";

export default function DemoPage() {
  const { t } = useTranslation();
  const [currentFeature, setCurrentFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 6);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      title: t("demo.authTitle"),
      description: t("demo.authDesc"),
      icon: "🔐",
      color: "from-blue-500 to-indigo-600",
    },
    {
      title: t("demo.adminTitle"),
      description: t("demo.adminDesc"),
      icon: "👑",
      color: "from-purple-500 to-pink-600",
    },
    {
      title: t("demo.studentTitle"),
      description: t("demo.studentDesc"),
      icon: "📚",
      color: "from-green-500 to-emerald-600",
    },
    {
      title: t("demo.multilingualTitle"),
      description: t("demo.multilingualDesc"),
      icon: "🌍",
      color: "from-orange-500 to-red-600",
    },
    {
      title: t("demo.responsiveTitle"),
      description: t("demo.responsiveDesc"),
      icon: "📱",
      color: "from-teal-500 to-cyan-600",
    },
    {
      title: t("demo.modernTitle"),
      description: t("demo.modernDesc"),
      icon: "✨",
      color: "from-violet-500 to-purple-600",
    },
  ];

  const technologies = [
    { name: "Next.js 15", icon: "⚡", color: "text-black" },
    { name: "React 19", icon: "⚛️", color: "text-blue-500" },
    { name: "TypeScript", icon: "🔷", color: "text-blue-600" },
    { name: "Tailwind CSS", icon: "🎨", color: "text-cyan-500" },
    { name: "NextAuth.js", icon: "🔐", color: "text-green-500" },
    { name: "PostgreSQL", icon: "🐘", color: "text-blue-700" },
    { name: "Vercel", icon: "▲", color: "text-black" },
    { name: "i18n", icon: "🌍", color: "text-orange-500" },
  ];

  const stats = [
    { label: t("demo.activeUsers"), value: "1,200+", icon: "👥" },
    { label: t("demo.coursesAvailable"), value: "50+", icon: "📖" },
    { label: t("demo.languages"), value: "2", icon: "🗣️" },
    { label: t("demo.uptime"), value: "99.9%", icon: "⚡" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-indigo-50/50">
      {/* Language Switcher */}
      <div className="fixed top-4 right-4 z-50">
        <LanguageSwitcher />
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-32">
        <div className="absolute inset-0">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-100/40 to-indigo-100/40 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute -bottom-40 -left-40 w-96 h-96 bg-gradient-to-tr from-violet-100/40 to-purple-100/40 rounded-full blur-3xl animate-pulse delay-1000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div
            className={`transition-all duration-1000 ${
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-8"
            }`}
          >
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-xl">
                <span className="text-3xl text-white font-bold">N</span>
              </div>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
                nrivizi
              </span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto">
              {t("demo.tagline")}
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <a
                href="/login"
                className="px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
              >
                {t("demo.tryDemo")} ✨
              </a>
              <a
                href="https://github.com/naderyb/nrivizi"
                target="_blank"
                rel="noopener noreferrer"
                className="px-8 py-4 bg-white text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-200"
              >
                {t("demo.sourceCode")} 📂
              </a>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
              {stats.map((stat, index) => (
                <div
                  key={index}
                  className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-white/40"
                >
                  <div className="text-2xl mb-2">{stat.icon}</div>
                  <div className="text-2xl md:text-3xl font-bold text-gray-900">
                    {stat.value}
                  </div>
                  <div className="text-sm text-gray-600">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features Showcase */}
      <section className="py-20 bg-white/50 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t("demo.featuresTitle")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("demo.featuresSubtitle")}
            </p>
          </div>

          {/* Feature Slider */}
          <div className="relative">
            <div className="bg-white rounded-2xl shadow-2xl p-8 md:p-12 border border-gray-100">
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div>
                  <div
                    className={`w-16 h-16 bg-gradient-to-r ${features[currentFeature].color} rounded-xl flex items-center justify-center text-2xl mb-6 shadow-lg`}
                  >
                    {features[currentFeature].icon}
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    {features[currentFeature].title}
                  </h3>
                  <p className="text-lg text-gray-600 mb-8 leading-relaxed">
                    {features[currentFeature].description}
                  </p>

                  {/* Feature dots */}
                  <div className="flex space-x-2">
                    {features.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentFeature(index)}
                        className={`w-3 h-3 rounded-full transition-all duration-300 ${
                          index === currentFeature
                            ? "bg-blue-600 w-8"
                            : "bg-gray-300 hover:bg-gray-400"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="relative">
                  <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl p-8 h-96 flex items-center justify-center">
                    <div className="text-6xl opacity-50">
                      {features[currentFeature].icon}
                    </div>
                  </div>
                  <div className="absolute -top-4 -right-4 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-lg">
                    ✓
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Stack */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t("demo.techStack")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("demo.techStackDesc")}
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {technologies.map((tech, index) => (
              <div
                key={index}
                className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 border border-gray-100"
              >
                <div className="text-3xl mb-4">{tech.icon}</div>
                <h3 className={`font-semibold ${tech.color}`}>{tech.name}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Screenshots/Mockups Section - FIXED MOBILE IMAGES */}
      <section className="py-20 bg-gradient-to-br from-blue-50 to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              {t("demo.screenshots")}
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {t("demo.screenshotsDesc")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            {/* Login Page */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <Image
                  src="/screenshots/login.png"
                  alt={t("demo.loginInterface")}
                  fill
                  className="object-contain sm:object-cover sm:object-top bg-gray-50"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-emerald-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  🔐 {t("demo.loginInterface")}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">
                  {t("demo.loginInterface")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("demo.loginInterfaceDesc")}
                </p>
              </div>
            </div>

            {/* Signup Page */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative h-48 sm:h-56 md:h-64 overflow-hidden">
                <Image
                  src="/screenshots/signup.png"
                  alt={t("demo.signupInterface")}
                  fill
                  className="object-contain sm:object-cover sm:object-top bg-gray-50"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  ✨ {t("demo.signupInterface")}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">
                  {t("demo.signupInterface")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("demo.signupInterfaceDesc")}
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Admin Dashboard */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                <Image
                  src="/screenshots/admin_portal.png"
                  alt={t("demo.adminDashboard")}
                  fill
                  className="object-contain sm:object-cover sm:object-top bg-gray-50"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-purple-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  👑 {t("demo.adminDashboard")}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">
                  {t("demo.adminDashboard")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("demo.adminDashboardDesc")}
                </p>
              </div>
            </div>

            {/* Student Portal */}
            <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 transform hover:scale-105">
              <div className="relative h-56 sm:h-64 md:h-72 overflow-hidden">
                <Image
                  src="/screenshots/student_portal.png"
                  alt={t("demo.studentPortal")}
                  fill
                  className="object-contain sm:object-cover sm:object-top bg-gray-50"
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                <div className="absolute top-4 left-4 bg-indigo-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  📚 {t("demo.studentPortal")}
                </div>
              </div>
              <div className="p-6">
                <h3 className="font-bold text-lg mb-2">
                  {t("demo.studentPortal")}
                </h3>
                <p className="text-gray-600 text-sm">
                  {t("demo.studentPortalDesc")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            {t("demo.readyToStart")}
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            {t("demo.readyToStartDesc")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a
              href="/signup"
              className="px-8 py-4 bg-white text-blue-600 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105"
            >
              {t("demo.signupNow")} 🚀
            </a>
            <a
              href="/login"
              className="px-8 py-4 bg-transparent border-2 border-white text-white font-semibold rounded-xl hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              {t("demo.tryDemoButton")} 👨‍🎓
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
                  <span className="text-lg font-bold">N</span>
                </div>
                <span className="text-xl font-bold">nrivizi</span>
              </div>
              <p className="text-gray-300 mb-4">{t("demo.footerDesc")}</p>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">{t("demo.features")}</h3>
              <ul className="space-y-2 text-gray-300">
                <li>• {t("demo.authTitle")}</li>
                <li>• {t("demo.adminTitle")}</li>
                <li>• {t("demo.multilingualTitle")}</li>
                <li>• {t("demo.responsiveTitle")}</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-lg mb-4">{t("demo.contact")}</h3>
              <div className="space-y-2 text-gray-300">
                <p>📧 nexusclub@insag.edu.dz</p>
                <p>🌍 Campus IFAG, Hydra, Alger</p>
                <p>💻 {t("demo.builtWithPassion")}</p>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-300">
            <p>
              &copy; 2025 nrivizi. {t("demo.allRights")}. {t("demo.madeWith")}{" "}
              ❤️
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
