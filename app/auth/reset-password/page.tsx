"use client";

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ResetPasswordPage() {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [message, setMessage] = useState('');
    const [error, setError] = useState('');
    const [isValidToken, setIsValidToken] = useState(false);
    const [isCheckingToken, setIsCheckingToken] = useState(true);
    const router = useRouter();
    const searchParams = useSearchParams();
    const token = searchParams?.get('token');

    useEffect(() => {
        if (!token) {
            setError('Token de réinitialisation manquant');
            setIsCheckingToken(false);
            return;
        }

        // Vérifier la validité du token
        const verifyToken = async () => {
            try {
                const response = await fetch(`/api/auth/reset-password?token=${encodeURIComponent(token)}`, {
                    method: 'GET',
                });

                const data = await response.json();

                if (response.ok) {
                    setIsValidToken(true);
                } else {
                    setError(data.error || 'Token de réinitialisation invalide ou expiré');
                }
            } catch (err) {
                setError('Erreur lors de la vérification du token');
            } finally {
                setIsCheckingToken(false);
            }
        };

        verifyToken();
    }, [token]);

    const validateForm = (): boolean => {
        if (!password || !confirmPassword) {
            setError('Tous les champs sont requis');
            return false;
        }

        if (password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }

        if (password !== confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setMessage('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ token, password }),
            });

            const data = await response.json();

            if (response.ok) {
                setMessage(data.message || 'Mot de passe réinitialisé avec succès !');
                
                // Redirection vers la page de login après 3 secondes
                setTimeout(() => {
                    router.push('/auth/login');
                }, 3000);
            } else {
                setError(data.error || 'Erreur lors de la réinitialisation');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        } finally {
            setIsLoading(false);
        }
    };

    if (isCheckingToken) {
        return (
            <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FFB151] mx-auto"></div>
                        <p className="mt-4 text-gray-600">Vérification du token...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (!isValidToken) {
        return (
            <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <Image
                        src="/logo.webp"
                        alt="Logo ANOMI"
                        width={50}
                        height={50}
                        className="absolute mx-auto top-[12%]"
                    />
                </div>
                
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-4">
                            Token invalide
                        </h2>
                    </div>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className='flex flex-col items-center justify-center'>
                        <div className="w-[226px] text-center">
                            {error && (
                                <div className="text-red-600 text-sm mb-4 p-3 bg-red-50 rounded-md border border-red-200">
                                    {error}
                                </div>
                            )}

                            <div className="space-y-4">

                                <div className="space-y-3">
                                    <Link
                                        href="/auth/forgot-password"
                                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#FFB151]"
                                    >
                                        Demander un nouveau lien
                                    </Link>

                                    <Link
                                        href="/auth/login"
                                        className="w-full flex justify-center py-2 px-4 border rounded-md shadow-sm text-sm font-medium text-[#FFB151] border-[#FFB151]"
                                    >
                                        Retour à la connexion
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className='absolute bottom-0 left-0 w-full h-[150px] overflow-hidden pointer-events-none'>
                    <span className='bg-[#FCB259] w-[298px] h-[298px] left-[-50px] top-[30px] rounded-full absolute z-0'></span>
                    <span className='w-[247px] h-[247px] bg-[#FCB259]/30 backdrop-blur-sm rounded-full absolute z-10 top-0 right-[-50px]'>
                    </span>
                </div>
            </div>
        );
    }

    if (message) {
        return (
            <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="flex flex-col items-center justify-center text-center">
                    <Image
                        src="/logo.webp"
                        alt="Logo ANOMI"
                        width={50}
                        height={50}
                        className="absolute mx-auto top-[12%]"
                    />
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold mb-2">
                            Succès ! ✅
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Votre mot de passe a été réinitialisé
                        </p>
                    </div>
                </div>

                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div>
                        <div className="flex flex-col items-center justify-center text-center">
                            <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-orange-100 mb-4">
                                <svg className="h-6 w-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                                </svg>
                            </div>

                            <div className="w-[226px] text-green-600 text-sm mb-4 p-3 bg-green-50 rounded-md border border-green-200">
                                {message}
                            </div>

                            <Link
                                href="/auth/login"
                                className="w-[226px] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#FFB151] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Me connecter maintenant
                            </Link>
                        </div>
                    </div>
                </div>

                <div className='absolute bottom-0 left-0 w-full h-[150px] overflow-hidden pointer-events-none'>
                    <span className='bg-[#FCB259] w-[298px] h-[298px] left-[-50px] top-[30px] rounded-full absolute z-0'></span>
                    <span className='w-[247px] h-[247px] bg-[#FCB259]/30 backdrop-blur-sm rounded-full absolute z-10 top-0 right-[-50px]'>
                    </span>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col justify-center">
            <div className="flex flex-col items-center justify-center text-center">
                <Image
                    src="/logo.webp"
                    alt="Logo ANOMI"
                    width={50}
                    height={50}
                    className="absolute mx-auto top-[12%]"
                />
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">
                        Nouveau mot de passe
                    </h2>
                    <p className="text-gray-600 mb-8">
                        Choisissez un mot de passe sécurisé
                    </p>
                </div>
            </div>

            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <div className='w-full flex justify-center'>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="appearance-none block w-[226px] px-3 py-2 border border-[#FFB151] text-[#828282] rounded-[6px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Nouveau mot de passe"
                            />
                        </div>

                        <div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                autoComplete="new-password"
                                required
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                className="appearance-none block w-[226px] px-3 py-2 border border-[#FFB151] text-[#828282] rounded-[6px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                placeholder="Confirmer le mot de passe"
                            />
                        </div>

                        {error && (
                            <div className="w-[226px] text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">
                                {error}
                            </div>
                        )}

                        <div>
                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-[226px] flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-black bg-[#FFB151] hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Réinitialisation...
                                    </span>
                                ) : (
                                    'Réinitialiser le mot de passe'
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            <div className='absolute bottom-0 left-0 w-full h-[150px] overflow-hidden pointer-events-none'>
                <span className='bg-[#FCB259] w-[298px] h-[298px] left-[-50px] top-[30px] rounded-full absolute z-0'></span>
                <span className='w-[247px] h-[247px] bg-[#FCB259]/30 backdrop-blur-sm rounded-full absolute z-10 top-0 right-[-50px]'>
                </span>
            </div>
        </div>
    );
}
