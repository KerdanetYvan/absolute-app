import { NavBarDashboard } from '../../../components/NavBarDashboard';

export default function DashboardPage() {
  return (
    <div style={{ display: 'flex' }}>
      <NavBarDashboard />
      <main style={{ flex: 1, padding: '2rem' }}>
        {/* Contenu principal du dashboard */}
        <h1>Liste des articles</h1>
      </main>
    </div>
  );
}