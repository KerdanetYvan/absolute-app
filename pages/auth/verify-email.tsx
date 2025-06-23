import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { NextPage } from 'next';

const VerifyEmailPage: NextPage = () => {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const [resendEmail, setResendEmail] = useState('');
    const [isResending, setIsResending] = useState(false);
    const router = useRouter();
    const { token } = router.query;

    useEffect(() => {
        if (token && typeof token === 'string') {
            verifyEmail(token);
        }
    }, [token]);

    const verifyEmail = async (verificationToken: string) => {
        try {
            const response = await fetch(`/api/auth/verify-email?token=${verificationToken}`);
            const data = await response.json();

            if (response.ok) {
                setStatus('success');
                setMessage(data.message);
                // Redirection automatique vers la page de login après 3 secondes
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            } else {
                setStatus('error');
                setMessage(data.error);
            }
        } catch (error) {
            setStatus('error');
            setMessage('Erreur lors de la vérification de l\'email');
        }
    };

    const handleResendEmail = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!resendEmail) return;

        setIsResending(true);
        try {
            const response = await fetch('/api/auth/verify-email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: resendEmail }),
            });

            const data = await response.json();
            
            if (response.ok) {
                alert('Email de vérification renvoyé avec succès !');
                setResendEmail('');
            } else {
                alert(data.error);
            }
        } catch (error) {
            alert('Erreur lors du renvoi de l\'email');
        } finally {
            setIsResending(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">ANOMI</h1>
                    <p className="text-gray-600">Toute l'info sur l'animation</p>
                </div>
            </div>

            <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    {status === 'loading' && (
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <h2 className="mt-4 text-xl font-medium text-gray-900">
                                Vérification en cours...
                            </h2>
                            <p className="mt-2 text-gray-600">
                                Veuillez patienter pendant que nous vérifions votre email.
                            </p>
                        </div>
                    )}

                    {status === 'success' && (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                <svg className="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="mt-4 text-xl font-medium text-gray-900">
                                Email vérifié !
                            </h2>
                            <p className="mt-2 text-gray-600">{message}</p>
                            <p className="mt-2 text-sm text-gray-500">
                                Redirection automatique vers la page de connexion...
                            </p>
                            <button
                                onClick={() => router.push('/auth/login')}
                                className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                            >
                                Se connecter maintenant
                            </button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                            <h2 className="mt-4 text-xl font-medium text-gray-900">
                                Erreur de vérification
                            </h2>
                            <p className="mt-2 text-gray-600">{message}</p>
                            
                            {/* Formulaire pour renvoyer l'email */}
                            <div className="mt-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Renvoyer l'email de vérification
                                </h3>
                                <form onSubmit={handleResendEmail}>
                                    <input
                                        type="email"
                                        placeholder="Votre adresse email"
                                        value={resendEmail}
                                        onChange={(e) => setResendEmail(e.target.value)}
                                        required
                                        className="mb-3 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                    />
                                    <button
                                        type="submit"
                                        disabled={isResending}
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                                    >
                                        {isResending ? 'Envoi en cours...' : 'Renvoyer l\'email'}
                                    </button>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default VerifyEmailPage;
