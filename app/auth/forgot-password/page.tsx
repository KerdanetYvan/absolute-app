"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

export default function ForgotPasswordPage() {
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);
    const router = useRouter();

    const validateEmail = (email: string): boolean => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!email) {
            setError('Veuillez saisir votre adresse email');
            return;
        }

        if (!validateEmail(email)) {
            setError('Veuillez saisir une adresse email valide');
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                setIsSubmitted(true);
                
                // Afficher l'URL de prévisualisation en développement
                if (data.emailPreviewUrl && process.env.NODE_ENV !== 'production') {
                    console.log('📧 Prévisualisation email:', data.emailPreviewUrl);
                }
            } else {
                setError(data.error || 'Erreur lors de l\'envoi de l\'email');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        } finally {
            setIsLoading(false);
        }
    };

    if (isSubmitted) {
        return (
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                <div className="sm:mx-auto sm:w-full sm:max-w-md">
                    <div className="text-center">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">
                            Email envoyé ! 📧
                        </h2>
                        <p className="text-gray-600 mb-8">
                            Vérifiez votre boîte de réception
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className='h-screen max-h-screen overflow-hidden snap-none flex flex-col justify-center py-8 px-4 relative'>
            <div className='mx-auto w-full max-w-md'>
                <div className="flex flex-col items-center justify-center text-center">
                    <Image
                        src="/logo.webp"
                        alt="Logo ANOMI"
                        width={50}
                        height={50}
                        className="absolute mx-auto top-[12%]"
                    />
                </div>
            
                <div className="min-h-screen flex flex-col justify-center py-12 sm:px-6 lg:px-8">
                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="text-center">
                            <h2 className="text-3xl font-bold text-gray-900 mb-2">
                                Mot de passe oublié ?
                            </h2>
                            <p className="text-gray-600">
                                Pas de problème !
                            </p>
                        </div>
                    </div>

                    <div className="sm:mx-auto sm:w-full sm:max-w-md">
                        <div className="bg-white py-8 px-4 sm:px-10">
                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div className='w-full flex justify-center'>
                                    <input
                                        id="email"
                                        name="email"
                                        type="email"
                                        autoComplete="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        className="appearance-none block w-[226px] px-3 py-2 border border-[#FFB151] text-[#828282] rounded-[6px] placeholder-gray-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                                        placeholder="Email"
                                    />
                                </div>

                                {error && (
                                    <div className="text-red-600 text-sm p-3 bg-red-50 rounded-md border border-red-200">
                                        {error}
                                    </div>
                                )}

                                <div className='w-full flex justify-center'>
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-[226px] flex justify-center py-2 px-4 rounded-md shadow-sm text-xs font-medium text-black bg-[#FFB151] disabled:opacity-50 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Envoi en cours...
                                            </span>
                                        ) : (
                                            'Envoyer le lien de réinitialisation'
                                        )}
                                    </button>
                                </div>
                            </form>
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
