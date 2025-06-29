'use client';

import { useEffect, useState, Suspense, useRef } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';

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
        <div className='h-screen max-h-screen dark:bg-[#454141] overflow-hidden snap-none flex flex-col justify-center py-8 px-4 relative'>
            <div className='mx-auto w-full max-w-md'>
                <div className="flex flex-col items-center justify-center text-center">
                    <Image
                        src="/logo.webp"
                        alt="Logo ANOMI"
                        width={50}
                        height={50}
                        className="dark:hidden absolute mx-auto top-[12%]"
                    />
                    <Image
                        src='/logo_dark.webp'
                        alt="Logo ANOMI"
                        width={50}
                        height={50}
                        className="hidden dark:block absolute mx-auto top-[12%]"
                    />
                </div>

                <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="py-8 px-4 sm:px-10">
                            <div className="text-center">
                                {status === 'loading' && (
                                    <>
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-[#FFB151]/20 dark:bg-[#3CBDD1]/20">
                                            <svg className="animate-spin h-6 w-6 text-[#FFB151] dark:text-[#3CBDD1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                        </div>
                                        <h2 className="mt-6 text-xl text-gray-900 dark:text-gray-100 font-bold">Vérification en cours...</h2>
                                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                                            Veuillez patienter pendant que nous vérifions votre email.
                                        </p>
                                    </>
                                )}

                                {status === 'success' && (
                                    <>
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 dark:bg-green-900/30">
                                            <svg className="h-6 w-6 text-green-600 dark:text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                        <h2 className="mt-6 text-xl text-green-600 dark:text-green-400 font-bold">Email vérifié !</h2>
                                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                                            {message}
                                        </p>
                                        <p className="mt-2 text-sm text-gray-500 dark:text-gray-500">
                                            Redirection vers la page de connexion...
                                        </p>
                                    </>
                                )}

                                {status === 'error' && (
                                    <>
                                        <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/30">
                                            <svg className="h-6 w-6 text-red-600 dark:text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                                            </svg>
                                        </div>
                                        <h2 className="mt-6 text-xl text-red-600 dark:text-red-400 font-bold">Erreur de vérification</h2>
                                        <p className="mt-4 text-gray-600 dark:text-gray-400">
                                            {message}
                                        </p>
                                        
                                        <div className="mt-6 space-y-2">
                                            <button
                                                onClick={() => router.push('/auth/register')}
                                                className="w-full bg-[#FFB151] dark:bg-[#3CBDD1] text-black py-2 px-4 rounded-md hover:bg-[#FFB151]/80 dark:hover:bg-[#3CBDD1]/80 transition-colors"
                                            >
                                                S'inscrire à nouveau
                                            </button>
                                            <button
                                                onClick={() => router.push('/')}
                                                className="w-full text-gray-600 dark:text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 text-sm"
                                            >
                                                Retour à l'accueil
                                            </button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Éléments décoratifs */}
                <div className='absolute bottom-0 left-0 w-full h-[150px] overflow-hidden pointer-events-none'>
                    <span className='bg-[#FCB259] dark:bg-[#3CBDD1] w-[298px] h-[298px] left-[-50px] top-[30px] rounded-full absolute z-0'></span>
                    <span className='w-[247px] h-[247px] bg-[#FCB259]/30 dark:bg-[#3CBDD1]/30 backdrop-blur-sm rounded-full absolute z-10 top-0 right-[-50px]'>
                    </span>
                </div>
            </div>
        </div>
    );
}

export default function VerifyEmailPage() {
    return (
        <Suspense fallback={
            <div className='h-screen max-h-screen dark:bg-[#454141] overflow-hidden snap-none flex flex-col justify-center py-8 px-4 relative'>
                <div className='mx-auto w-full max-w-md'>
                    <div className="flex flex-col items-center justify-center text-center">
                        <Image
                            src="/logo.webp"
                            alt="Logo ANOMI"
                            width={50}
                            height={50}
                            className="dark:hidden absolute mx-auto top-[12%]"
                        />
                        <Image
                            src='/logo_dark.webp'
                            alt="Logo ANOMI"
                            width={50}
                            height={50}
                            className="hidden dark:block absolute mx-auto top-[12%]"
                        />
                    </div>

                    <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                        <div className="sm:mx-auto sm:w-full sm:max-w-md">
                            <div className="py-8 px-4 sm:px-10">
                                <div className="text-center">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB151] dark:border-[#3CBDD1] mx-auto mb-4"></div>
                                    <p className="text-gray-600 dark:text-gray-400">Chargement...</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Éléments décoratifs */}
                    <div className='absolute bottom-0 left-0 w-full h-[150px] overflow-hidden pointer-events-none'>
                        <span className='bg-[#FCB259] dark:bg-[#3CBDD1] w-[298px] h-[298px] left-[-50px] top-[30px] rounded-full absolute z-0'></span>
                        <span className='w-[247px] h-[247px] bg-[#FCB259]/30 dark:bg-[#3CBDD1]/30 backdrop-blur-sm rounded-full absolute z-10 top-0 right-[-50px]'>
                        </span>
                    </div>
                </div>
            </div>
        }>
            <VerifyEmailContent />
        </Suspense>
    );
}
