import { NavBarDashboard } from '../../../components/NavBarDashboard';

// Récupération côté serveur (Server Component)
async function fetchUsers() {
  // Utilisation du chemin relatif pour Next.js API route
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/users`, {
    cache: 'no-store',
    // En SSR, Next.js gère le contexte d'URL automatiquement
  });
  if (!res.ok) {
    throw new Error('Erreur lors du chargement des utilisateurs');
  }
  return res.json();
}

export default async function DashboardUsersPage() {
  let users = [];
  try {
    // fetchUsers retourne un objet { users } ou un tableau direct selon l'API
    const data = await fetchUsers();
    users = Array.isArray(data) ? data : data.users || [];
  } catch (e) {
    users = [];
  }

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
              </tr>
            </thead>
            <tbody>
              {Array.isArray(users) && users.length > 0 ? (
                users.map((user: any) => (
                  <tr key={user._id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.username}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.email}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {user.isEmailVerified ? 'Oui' : 'Non'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                      {user.isAdmin ? 'Oui' : 'Non'}
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