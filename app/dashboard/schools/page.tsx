import { NavBarDashboard } from '../../../components/NavBarDashboard';
import SchoolList from '@/components/SchoolList';

export default function DashboardSchoolPage() {
  return (
    <div className="pl-[220px] flex min-h-screen bg-white dark:bg-[#454141]">
      <NavBarDashboard />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Gestion des écoles</h1>
        <div className="overflow-x-auto rounded-xl">
          <SchoolList />
        </div>
      </main>
    </div>
  );
}