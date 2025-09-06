"use client";

import { useEffect, useState } from "react";

interface User {
  id: string;
  full_name: string;
  email: string;
  password_hash: string;
  role: string;
  created_at: string;
}

export default function UsersManagement() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch("/api/admin/users");
      if (response.ok) {
        const data = await response.json();
        setUsers(data.users);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (userId: string) => {
    if (!newPassword.trim()) {
      alert("Veuillez entrer un nouveau mot de passe");
      return;
    }

    setActionLoading(userId);
    try {
      const response = await fetch("/api/admin/users/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, newPassword }),
      });

      if (response.ok) {
        alert(
          `Mot de passe réinitialisé avec succès pour ${selectedUser?.full_name}`
        );
        setShowPasswordModal(false);
        setNewPassword("");
      }
    } catch (error) {
      console.error("Error resetting password:", error);
      alert("Erreur lors de la réinitialisation du mot de passe");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="h-20 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-2xl p-8 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-4">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
            <span className="text-2xl">👥</span>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">
              Gestion des Utilisateurs
            </h1>
            <p className="text-gray-600">
              Gérer tous les utilisateurs de la plateforme
            </p>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Utilisateur
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Email
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Rôle
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Mot de Passe
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {user.full_name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {user.full_name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {user.id}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        user.role === "admin"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                      {user.role === "admin" ? "Admin" : "Étudiant"}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => {
                        setSelectedUser(user);
                        setShowPasswordModal(true);
                      }}
                      className="text-sm text-blue-600 hover:text-blue-800 font-medium"
                    >
                      Voir/Réinitialiser
                    </button>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => resetPassword(user.id)}
                        disabled={actionLoading === user.id}
                        className="px-3 py-1 text-xs font-semibold bg-blue-100 text-blue-700 hover:bg-blue-200 rounded-lg transition-colors disabled:opacity-50"
                      >
                        {actionLoading === user.id ? "..." : "Reset MDP"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
              Réinitialiser le mot de passe de {selectedUser.full_name}
            </h3>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Mot de passe haché actuel:
                </label>
                <div className="mt-1 p-3 bg-gray-100 rounded-lg text-sm text-gray-800 break-all">
                  {selectedUser.password_hash}
                </div>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Nouveau mot de passe:
                </label>
                <input
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  placeholder="Entrez le nouveau mot de passe"
                />
              </div>
              <div className="flex space-x-3">
                <button
                  onClick={() => resetPassword(selectedUser.id)}
                  disabled={
                    actionLoading === selectedUser.id || !newPassword.trim()
                  }
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {actionLoading === selectedUser.id
                    ? "Réinitialisation..."
                    : "Réinitialiser le mot de passe"}
                </button>
                <button
                  onClick={() => {
                    setShowPasswordModal(false);
                    setNewPassword("");
                  }}
                  className="flex-1 bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Annuler
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
