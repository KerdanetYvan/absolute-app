'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

function VerifyEmailContent() {
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');
    const hasStartedVerification = useRef(false); // Utiliser useRef pour persister entre renders
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');

    useEffect(() => {
        if (!token) {
            setStatus('error');
            setMessage('Token de vérification manquant');
            return;
        }

        // Vérification stricte pour éviter les appels multiples
        if (hasStartedVerification.current) {
            console.log('🚫 Appel évité - vérification déjà en cours');
            return;
        }

        hasStartedVerification.current = true;

        const verifyEmail = async () => {
            try {
                console.log('🔄 Début vérification avec token:', token.substring(0, 10) + '...');
                
                const response = await fetch(`/api/auth/verify-email?token=${token}`);
                const data = await response.json();

                console.log('📨 Réponse API:', response.status, data);

                if (response.ok) {
                    console.log('✅ Vérification réussie - affichage succès');
                    setStatus('success');
                    setMessage(data.message || 'Email vérifié avec succès !');
                    
                    // Redirection vers la page de connexion après 3 secondes
                    setTimeout(() => {
                        router.push('/auth/login');
                    }, 3000);
                } else {
                    console.log('❌ Vérification échouée:', data.error);
                    setStatus('error');
                    setMessage(data.error || 'Erreur lors de la vérification');
                }
            } catch (error) {
                console.error('❌ Erreur de connexion:', error);
                setStatus('error');
                setMessage('Erreur de connexion au serveur');
            }
        };

        verifyEmail();
    }, [token, router]); // Suppression de hasVerified des dépendances

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                    <div className="text-center">
                        {status === 'loading' && (
                            <>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-blue-100">
                                    <svg className="animate-spin h-6 w-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                </div>
                                <h1 className="mt-6 text-3xl font-bold text-gray-900">ANOMI</h1>
                                <h2 className="mt-2 text-xl text-gray-600">Vérification en cours...</h2>
                                <p className="mt-4 text-gray-500">
                                    Veuillez patienter pendant que nous vérifions votre email.
                                </p>
                            </>
                        )}

                        {status === 'success' && (
                            <>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100">
                                    <svg className="h-6 w-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                                <h1 className="mt-6 text-3xl font-bold text-gray-900">ANOMI</h1>
                                <h2 className="mt-2 text-xl text-green-600">Email vérifié !</h2>
                                <p className="mt-4 text-gray-500">
                                    {message}
                                </p>
                                <p className="mt-2 text-sm text-gray-400">
                                    Redirection vers la page de connexion...
                                </p>
                            </>
                        )}

                        {status === 'error' && (
                            <>
                                <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100">
                                    <svg className="h-6 w-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                    </svg>
                                </div>
                                <h1 className="mt-6 text-3xl font-bold text-gray-900">ANOMI</h1>
                                <h2 className="mt-2 text-xl text-red-600">Erreur de vérification</h2>
                                <p className="mt-4 text-gray-500">
                                    {message}
                                </p>
                                
                                <div className="mt-6 space-y-2">
                                    <button
                                        onClick={() => router.push('/auth/register')}
                                        className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
                                    >
                                        S'inscrire à nouveau
                                    </button>
                                    <button
                                        onClick={() => router.push('/')}
                                        className="w-full text-gray-600 hover:text-gray-500 text-sm"
                                    >
                                        Retour à l'accueil                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                            <p className="text-gray-600">Chargement...</p>
                        </div>
                    </div>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
