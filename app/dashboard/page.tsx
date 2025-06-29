import Link from 'next/link';
import { NavBarDashboard } from '../../components/NavBarDashboard';

export default function DashboardPage() {
  return (
    <div className="flex min-h-screen">
      <NavBarDashboard />
      <main className="flex-1 p-4 sm:p-6 md:p-8 bg-white">
        <h1 className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-gray-800 text-center md:text-left">
          Bienvenue sur le Dashboard Admin
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 max-w-5xl mx-auto">
          {/* Carte CRUD Utilisateurs */}
          <Link href="/dashboard/users" className="group">
            <div className="rounded-xl shadow-lg p-4 sm:p-6 bg-white border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer hover:border-[#FFB151] flex flex-col items-center text-center h-full">
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFB151]/20 mb-3 sm:mb-4">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFB151]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-4a4 4 0 1 0-8 0 4 4 0 0 0 8 0zm6 8v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
                Gestion des utilisateurs
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Créer, lire, modifier et supprimer les utilisateurs de la
                plateforme.
              </p>
            </div>
          </Link>
          {/* Carte CRUD Articles */}
          <Link href="/dashboard/articles" className="group">
            <div className="rounded-xl shadow-lg p-4 sm:p-6 bg-white border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer hover:border-[#FFB151] flex flex-col items-center text-center h-full">
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFB151]/20 mb-3 sm:mb-4">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFB151]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
                Gestion des articles
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Créer, lire, modifier et supprimer les articles publiés.
              </p>
            </div>
          </Link>
          {/* Carte CRUD Écoles */}
          <Link href="/dashboard/schools" className="group">
            <div className="rounded-xl shadow-lg p-4 sm:p-6 bg-white border border-gray-100 hover:shadow-xl transition-shadow cursor-pointer hover:border-[#FFB151] flex flex-col items-center text-center h-full">
              <div className="flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-[#FFB151]/20 mb-3 sm:mb-4">
                <svg
                  className="w-7 h-7 sm:w-8 sm:h-8 text-[#FFB151]"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  viewBox="0 0 24 24"
                >
                  <path d="M12 3l9 6-9 6-9-6 9-6zm0 13v5m0 0h6m-6 0H6"></path>
                </svg>
              </div>
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 sm:mb-2">
                Gestion des écoles
              </h2>
              <p className="text-gray-500 text-sm sm:text-base">
                Créer, lire, modifier et supprimer les écoles référencées.
              </p>
            </div>
          </Link>
        </div>
      </main>
    </div>
  );
}