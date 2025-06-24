import { LoginForm } from '../../../components/LoginForm';

export default function LoginPage() {
    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ANOMI</h1>
                    <h2 className="text-xl text-gray-600 mb-8">Se connecter</h2>
                </div>
                <LoginForm />
            </div>
        </div>
    );
}
