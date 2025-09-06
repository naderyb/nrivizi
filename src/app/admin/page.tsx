"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import ProgressBar from "@/components/ProgressBar";

interface DashboardStats {
  totalUsers: number;
  activeAnnouncements: number;
  upcomingExams: number;
  recentLogins: number;
  pendingPasswordRecoveries: number;
  userGrowth: number;
  systemHealth: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [stats, setStats] = useState<DashboardStats>({
    totalUsers: 0,
    activeAnnouncements: 0,
    upcomingExams: 0,
    recentLogins: 0,
    pendingPasswordRecoveries: 0,
    userGrowth: 0,
    systemHealth: 95,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/admin/dashboard-stats");
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const statsCards = [
    {
      title: "Utilisateurs Totaux",
      value: stats.totalUsers,
      icon: "👥",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      textColor: "text-blue-600",
      change: `+${stats.userGrowth}%`,
      changeColor: "text-green-600",
    },
    {
      title: "Demandes en Attente",
      value: stats.pendingPasswordRecoveries,
      icon: "🔑",
      color: "from-red-500 to-red-600",
      bgColor: "bg-red-50",
      textColor: "text-red-600",
      change: "-8%",
      changeColor: "text-green-600",
    },
    {
      title: "Santé du Système",
      value: `${stats.systemHealth}%`,
      icon: "💚",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      textColor: "text-green-600",
      change: "+2%",
      changeColor: "text-green-600",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 shadow-lg border border-gray-100 text-white">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 bg-white/20 rounded-xl flex items-center justify-center backdrop-blur-sm">
              <span className="text-3xl">👑</span>
            </div>
            <div>
              <h1 className="text-3xl font-bold">
                Bonjour, {session?.user?.name}!
              </h1>
              <p className="text-blue-100 mt-1">
                Bienvenue dans le panneau d&apos;administration de nrivizi
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-blue-100 text-sm">Dernière connexion</p>
            <p className="text-white font-semibold">
              {new Date().toLocaleDateString("fr-FR")}
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {statsCards.map((card, index) => (
          <div
            key={index}
            className={`${card.bgColor} rounded-2xl p-6 border border-gray-100 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 group`}
          >
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <div className="flex items-center justify-between mb-2">
                  <p className="text-gray-600 text-sm font-medium">
                    {card.title}
                  </p>
                  <span
                    className={`text-xs font-semibold ${card.changeColor} bg-white px-2 py-1 rounded-full`}
                  >
                    {card.change}
                  </span>
                </div>
                <p
                  className={`text-3xl font-bold ${card.textColor} group-hover:scale-105 transition-transform`}
                >
                  {loading ? (
                    <div className="animate-pulse bg-gray-300 h-8 w-16 rounded"></div>
                  ) : (
                    card.value
                  )}
                </p>
              </div>
              <div
                className={`w-12 h-12 bg-gradient-to-r ${card.color} rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}
              >
                <span className="text-2xl">{card.icon}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8"></div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
          <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
            <span className="mr-2">📈</span>
            Métriques de Performance
          </h3>
          <div className="space-y-4">
            <ProgressBar
              label="Engagement Utilisateurs"
              value={stats.recentLogins}
              maxValue={stats.totalUsers}
              color="#3b82f6"
            />
            <ProgressBar
              label="Taux d'Activité"
              value={stats.activeAnnouncements + stats.upcomingExams}
              maxValue={50}
              color="#10b981"
            />
            <ProgressBar
              label="Gestion des Demandes"
              value={Math.max(0, 20 - stats.pendingPasswordRecoveries)}
              maxValue={20}
              color="#f59e0b"
            />
            <ProgressBar
              label="Sécurité du Système"
              value={stats.systemHealth}
              maxValue={100}
              color="#ef4444"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
        <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <span className="mr-2">🖥️</span>
          État du Système
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-lg">✓</span>
            </div>
            <p className="font-semibold text-green-800">Base de Données</p>
            <p className="text-sm text-green-600">Opérationnelle</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-lg">✓</span>
            </div>
            <p className="font-semibold text-green-800">API</p>
            <p className="text-sm text-green-600">Fonctionnelle</p>
          </div>

          <div className="bg-yellow-50 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-lg">!</span>
            </div>
            <p className="font-semibold text-yellow-800">Stockage</p>
            <p className="text-sm text-yellow-600">78% utilisé</p>
          </div>

          <div className="bg-green-50 rounded-xl p-4 text-center">
            <div className="w-12 h-12 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-white text-lg">✓</span>
            </div>
            <p className="font-semibold text-green-800">Sécurité</p>
            <p className="text-sm text-green-600">Sécurisé</p>
          </div>
        </div>
      </div>
    </div>
  );
}
