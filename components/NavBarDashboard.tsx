import Link from 'next/link';
import Image from 'next/image';

export const NavBarDashboard = () => {
  return (
    <nav style={{
      position: 'fixed',
      top: 0,
      left: 0,
      display: 'flex',
      flexDirection: 'column',
      width: '220px',
      height: '100vh',
      background: '#1a202c',
      padding: '2rem 1rem',
      color: '#fff'
    }}>
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
        <Link href="/" style={{ display: 'inline-block' }}>
          <Image
            src="/logo.webp"
            alt="Logo"
            width={64}
            height={64}
          />
        </Link>
      </div>
      <h2 style={{ marginBottom: '2rem', fontSize: '1.5rem', fontWeight: 'bold' }}>
        <Link href="/dashboard" style={{ color: '#fff', textDecoration: 'none' }}>
          Admin Dashboard
        </Link>
      </h2>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        <li style={{ marginBottom: '1.5rem' }}>
          <Link href="/dashboard/users" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>
            Utilisateurs
          </Link>
        </li>
        <li style={{ marginBottom: '1.5rem' }}>
          <Link href="/dashboard/articles" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>
            Articles
          </Link>
        </li>
        <li>
          <Link href="/dashboard/schools" style={{ color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>
            Écoles
          </Link>
        </li>
      </ul>
    </nav>
  );
};