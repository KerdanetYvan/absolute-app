import { NavBarDashboard } from '../../../components/NavBarDashboard';
import SchoolList from '@/components/SchoolList';

export default function DashboardSchoolPage() {
  return (
    <div style={{ display: 'flex' }}>
      <NavBarDashboard />
      <SchoolList />
    </div>
  );
}