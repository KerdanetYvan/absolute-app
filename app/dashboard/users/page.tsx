'use client';

import { useEffect, useState } from 'react';
import { NavBarDashboard } from '../../../components/NavBarDashboard';

async function fetchUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/users`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Erreur lors du chargement des utilisateurs');
  return res.json();
}

async function updateAdminStatus(userId: string, isAdmin: boolean) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/users/${userId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ isAdmin }),
  });
  if (!res.ok) throw new Error('Erreur lors de la mise à jour');
  return res.json();
}

async function deleteUser(userId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/users/${userId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return res.json();
}

export default function DashboardUsersPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUsers()
      .then(data => setUsers(Array.isArray(data) ? data : data.users || []))
      .catch(() => setUsers([]))
      .finally(() => setLoading(false));
  }, []);

  const handleAdminSwitch = async (userId: string, current: boolean) => {
    try {
      await updateAdminStatus(userId, !current);
      setUsers(users =>
        users.map(u =>
          u._id === userId ? { ...u, isAdmin: !current } : u
        )
      );
    } catch (e) {
      alert("Erreur lors de la mise à jour du statut administrateur.");
    }
  };

  const handleDeleteUser = async (userId: string) => {
    if (!window.confirm("Supprimer cet utilisateur ?")) return;
    try {
      await deleteUser(userId);
      setUsers(users => users.filter(u => u._id !== userId));
    } catch (e) {
      alert("Erreur lors de la suppression de l'utilisateur.");
    }
  };

  return (
    <div className="pl-[220px] flex min-h-screen bg-white dark:bg-[#454141]">
      <NavBarDashboard />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Gestion des utilisateurs</h1>
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200 dark:border-gray-800 mt-6">
          <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
            <thead className="text-xs text-gray-700 uppercase bg-[#FFB151] dark:bg-[#3CBDD1] dark:text-gray-200">
              <tr>
                <th className="px-6 py-3">Nom d'utilisateur</th>
                <th className="px-6 py-3">Email</th>
                <th className="px-6 py-3 text-center">Vérifié</th>
                <th className="px-6 py-3 text-center">Administrateur</th>
                <th className="px-6 py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500 bg-white">Chargement...</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user: any) => (
                  <tr key={user._id} className="bg-white border-b dark:bg-gray-700/30 dark:border-gray-800 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{user.username}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-800 dark:text-gray-200">{user.email}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${user.isEmailVerified ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                        {user.isEmailVerified ? 'Oui' : 'Non'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <label className="inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={user.isAdmin}
                          onChange={() => handleAdminSwitch(user._id, user.isAdmin)}
                          className="sr-only peer"
                          aria-pressed={user.isAdmin}
                          aria-label={user.isAdmin ? 'Retirer le statut administrateur' : 'Donner le statut administrateur'}
                          title={user.isAdmin ? 'Retirer le statut administrateur' : 'Donner le statut administrateur'}
                        />
                        <div className="relative w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-[#FFB151]/40 dark:peer-focus:ring-[#3CBDD1]/40 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-[#FFB151] dark:peer-checked:bg-[#3CBDD1]"></div>
                      </label>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        className="text-red-600 hover:text-red-800 transition-colors text-xl"
                        aria-label="Supprimer l'utilisateur"
                        title="Supprimer l'utilisateur"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="text-center py-8 text-gray-500 bg-white">
                    Aucun utilisateur trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}