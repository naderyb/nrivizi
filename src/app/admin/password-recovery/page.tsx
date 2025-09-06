"use client";

import { useEffect, useState } from "react";

interface PasswordRecoveryRequest {
  id: string;
  full_name: string;
  email: string;
  requested_at: string;
  status: "pending" | "resolved" | "rejected";
  admin_notes?: string;
}

export default function PasswordRecovery() {
  const [requests, setRequests] = useState<PasswordRecoveryRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState<string | null>(null);
  const [selectedRequest, setSelectedRequest] =
    useState<PasswordRecoveryRequest | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [adminNotes, setAdminNotes] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/admin/password-recovery");
      if (response.ok) {
        const data = await response.json();
        setRequests(data.requests);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequest = async (
    requestId: string,
    action: "approve" | "reject"
  ) => {
    if (action === "approve" && !newPassword.trim()) {
      alert("Veuillez entrer un nouveau mot de passe");
      return;
    }

    setActionLoading(requestId);
    try {
      const response = await fetch("/api/admin/password-recovery", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requestId,
          action,
          newPassword: action === "approve" ? newPassword : undefined,
          adminNotes,
        }),
      });

      if (response.ok) {
        alert(
          `Demande ${
            action === "approve" ? "approuvée" : "rejetée"
          } avec succès`
        );
        setShowModal(false);
        setNewPassword("");
        setAdminNotes("");
        fetchRequests();
      }
    } catch (error) {
      console.error("Error handling request:", error);
      alert("Erreur lors du traitement de la demande");
    } finally {
      setActionLoading(null);
    }
  };

  const openModal = (request: PasswordRecoveryRequest) => {
    setSelectedRequest(request);
    setShowModal(true);
    setAdminNotes(request.admin_notes || "");
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-300 rounded w-1/3 mb-6"></div>
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-24 bg-gray-200 rounded-lg"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 md:space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 shadow-lg border border-gray-100">
        <div className="flex items-center space-x-3 md:space-x-4">
          <div className="w-10 h-10 md:w-12 md:h-12 bg-gradient-to-r from-orange-500 to-red-600 rounded-xl flex items-center justify-center">
            <span className="text-xl md:text-2xl">🔑</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold text-gray-800">
              Récupération de mots de passe
            </h1>
            <p className="text-sm md:text-base text-gray-600">
              Gérez les demandes de récupération de mot de passe des étudiants
            </p>
          </div>
        </div>
      </div>

      {/* Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 md:gap-6">
        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
              <span className="text-yellow-600 text-lg md:text-xl">⏳</span>
            </div>
            <div>
              <h3 className="text-sm md:text-lg font-semibold text-gray-800">
                En attente
              </h3>
              <p className="text-xl md:text-2xl font-bold text-yellow-600">
                {requests.filter((r) => r.status === "pending").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-green-100 rounded-lg flex items-center justify-center">
              <span className="text-green-600 text-lg md:text-xl">✅</span>
            </div>
            <div>
              <h3 className="text-sm md:text-lg font-semibold text-gray-800">
                Approuvées
              </h3>
              <p className="text-xl md:text-2xl font-bold text-green-600">
                {requests.filter((r) => r.status === "resolved").length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-6 shadow-lg border border-gray-100">
          <div className="flex items-center space-x-3 md:space-x-4">
            <div className="w-8 h-8 md:w-10 md:h-10 bg-red-100 rounded-lg flex items-center justify-center">
              <span className="text-red-600 text-lg md:text-xl">❌</span>
            </div>
            <div>
              <h3 className="text-sm md:text-lg font-semibold text-gray-800">
                Rejetées
              </h3>
              <p className="text-xl md:text-2xl font-bold text-red-600">
                {requests.filter((r) => r.status === "rejected").length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Requests List */}
      <div className="bg-white rounded-xl md:rounded-2xl shadow-lg border border-gray-100">
        <div className="p-4 md:p-6 border-b border-gray-100">
          <h2 className="text-lg md:text-xl font-semibold text-gray-800">
            Demandes de récupération
          </h2>
        </div>

        <div className="divide-y divide-gray-100">
          {requests.length === 0 ? (
            <div className="p-6 md:p-8 text-center text-gray-500">
              Aucune demande de récupération trouvée
            </div>
          ) : (
            requests.map((request) => (
              <div
                key={request.id}
                className="p-4 md:p-6 hover:bg-gray-50 transition-colors"
              >
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-3 md:space-x-4">
                      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center text-white font-semibold flex-shrink-0">
                        {request.full_name.charAt(0).toUpperCase()}
                      </div>
                      <div className="min-w-0 flex-1">
                        <h3 className="font-semibold text-gray-800 truncate">
                          {request.full_name}
                        </h3>
                        <p className="text-sm text-gray-600 truncate">
                          {request.email}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                      <span className="text-sm text-gray-500">
                        Demandé le:{" "}
                        {new Date(request.requested_at).toLocaleDateString(
                          "fr-FR"
                        )}
                      </span>
                      <span
                        className={`px-2 py-1 rounded-full text-xs font-medium inline-block w-fit ${
                          request.status === "pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : request.status === "resolved"
                            ? "bg-green-100 text-green-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {request.status === "pending"
                          ? "En attente"
                          : request.status === "resolved"
                          ? "Approuvée"
                          : "Rejetée"}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2 lg:flex-shrink-0">
                    {request.status === "pending" && (
                      <button
                        onClick={() => openModal(request)}
                        className="bg-blue-600 text-white px-3 md:px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium"
                      >
                        Traiter
                      </button>
                    )}
                    <button
                      onClick={() => openModal(request)}
                      className="bg-gray-200 text-gray-800 px-3 md:px-4 py-2 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                    >
                      Voir détails
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Request Modal */}
      {showModal && selectedRequest && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl md:rounded-2xl p-4 md:p-8 max-w-lg w-full">
            <h3 className="text-lg md:text-xl font-bold text-gray-800 mb-4">
              Demande de {selectedRequest.full_name}
            </h3>

            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-600">
                  Email:
                </label>
                <p className="text-gray-800">{selectedRequest.email}</p>
              </div>

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Statut:
                </label>
                <p
                  className={`inline-block px-2 py-1 rounded text-sm ${
                    selectedRequest.status === "pending"
                      ? "bg-yellow-100 text-yellow-800"
                      : selectedRequest.status === "resolved"
                      ? "bg-green-100 text-green-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {selectedRequest.status === "pending"
                    ? "En attente"
                    : selectedRequest.status === "resolved"
                    ? "Approuvée"
                    : "Rejetée"}
                </p>
              </div>

              {selectedRequest.status === "pending" && (
                <>
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
                </>
              )}

              <div>
                <label className="text-sm font-medium text-gray-600">
                  Notes administratives:
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full mt-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900 placeholder-gray-500"
                  rows={3}
                  placeholder="Ajoutez des notes..."
                  disabled={selectedRequest.status !== "pending"}
                />
              </div>

              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                {selectedRequest.status === "pending" ? (
                  <>
                    <button
                      onClick={() =>
                        handleRequest(selectedRequest.id, "approve")
                      }
                      disabled={
                        actionLoading === selectedRequest.id ||
                        !newPassword.trim()
                      }
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50 text-sm font-medium"
                    >
                      {actionLoading === selectedRequest.id
                        ? "Traitement..."
                        : "Approuver"}
                    </button>
                    <button
                      onClick={() =>
                        handleRequest(selectedRequest.id, "reject")
                      }
                      disabled={actionLoading === selectedRequest.id}
                      className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
                    >
                      {actionLoading === selectedRequest.id
                        ? "Traitement..."
                        : "Rejeter"}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setNewPassword("");
                      setAdminNotes("");
                    }}
                    className="w-full bg-gray-200 text-gray-800 py-2 px-4 rounded-lg hover:bg-gray-300 transition-colors text-sm font-medium"
                  >
                    Fermer
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
