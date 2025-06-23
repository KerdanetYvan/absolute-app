import { useAuth } from '../hooks/useAuth';
import { LoginForm } from './LoginForm';

export const AuthTest = () => {
    const { auth, logout, isLoading } = useAuth();

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold text-center mb-8">Authentication Test</h1>
            
            {/* Authentication Status Display */}
            <div className="max-w-md mx-auto mb-8 p-4 bg-gray-100 rounded-lg">
                <h3 className="text-lg font-semibold mb-2">Auth Status:</h3>
                <p className="text-sm">
                    <strong>Authenticated:</strong> {auth ? 'Yes' : 'No'}
                </p>
                <p className="text-sm">
                    <strong>Loading:</strong> {isLoading ? 'Yes' : 'No'}
                </p>
                
                {auth && (
                    <div className="mt-4">
                        <h4 className="font-medium">User Data:</h4>
                        <pre className="text-xs bg-white p-2 rounded mt-2 overflow-auto max-h-40">
                            {JSON.stringify(auth, null, 2)}
                        </pre>
                        
                        <button
                            onClick={logout}
                            className="mt-4 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
            
            {/* Login Form - only show if not authenticated */}
            {!auth && <LoginForm />}
        </div>
    );
};
