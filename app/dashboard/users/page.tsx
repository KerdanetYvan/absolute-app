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
    <div style={{ display: 'flex' }}>
      <NavBarDashboard />
      <main style={{ flex: 1, padding: '2rem' }}>
        <h1>Liste des utilisateurs</h1>
        <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nom d'utilisateur</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Vérifié</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Administrateur</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '16px' }}>Chargement...</td>
                </tr>
              ) : users.length > 0 ? (
                users.map((user: any) => (
                  <tr key={user._id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.username}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {user.isEmailVerified ? 'Oui' : 'Non'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      <label style={{ display: 'inline-block', position: 'relative', width: '40px', height: '22px' }}>
                        <input
                          type="checkbox"
                          checked={user.isAdmin}
                          onChange={() => handleAdminSwitch(user._id, user.isAdmin)}
                          style={{
                            opacity: 0,
                            width: 0,
                            height: 0,
                          }}
                          aria-label={user.isAdmin ? 'Administrateur' : 'Non administrateur'}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            cursor: 'pointer',
                            top: 0,
                            left: 0,
                            right: 0,
                            bottom: 0,
                            backgroundColor: user.isAdmin ? '#4caf50' : '#ccc',
                            borderRadius: '22px',
                            transition: '.4s',
                            display: 'block',
                          }}
                        />
                        <span
                          style={{
                            position: 'absolute',
                            content: '""',
                            height: '16px',
                            width: '16px',
                            left: user.isAdmin ? '20px' : '4px',
                            bottom: '3px',
                            backgroundColor: 'white',
                            borderRadius: '50%',
                            transition: '.4s',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.2)',
                            display: 'block',
                          }}
                        />
                      </label>
                    </td>
                   <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleDeleteUser(user._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#e53935',
                          fontSize: '20px',
                        }}
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
                  <td colSpan={4} style={{ textAlign: 'center', padding: '16px' }}>
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