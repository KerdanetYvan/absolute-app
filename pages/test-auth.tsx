import { AuthProvider } from '../context/AuthContext';
import { AuthTest } from '../components/AuthTest';

export default function TestAuthPage() {
    return (
        <AuthProvider>
            <div className="min-h-screen bg-gray-50">
                <AuthTest />
            </div>
        </AuthProvider>
    );
}
