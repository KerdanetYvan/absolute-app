"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';

interface RegisterFormData {
    username: string;
    email: string;
    password: string;
    confirmPassword: string;
}

export const RegisterForm = () => {
    const [formData, setFormData] = useState<RegisterFormData>({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const router = useRouter();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const validateForm = (): boolean => {
        if (!formData.username || !formData.email || !formData.password || !formData.confirmPassword) {
            setError('Tous les champs sont requis');
            return false;
        }

        if (formData.username.length < 3) {
            setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
            return false;
        }

        if (formData.password.length < 6) {
            setError('Le mot de passe doit contenir au moins 6 caractères');
            return false;
        }

        if (formData.password !== formData.confirmPassword) {
            setError('Les mots de passe ne correspondent pas');
            return false;
        }

        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Veuillez saisir un email valide');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setSuccess('');

        if (!validateForm()) {
            return;
        }

        setIsLoading(true);

        try {
            const response = await fetch('/api/users', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    username: formData.username,
                    email: formData.email,
                    password: formData.password
                }),
            });

            const data = await response.json();            if (response.ok) {
                if (data.emailSent) {
                    setSuccess(data.message || 'Inscription réussie ! Vérifiez votre email.');
                } else {
                    setSuccess(data.message || 'Inscription réussie ! Cependant, l\'email de vérification n\'a pas pu être envoyé.');
                    console.warn('Email non envoyé:', data.emailError);
                }
                
                // Afficher l'URL de prévisualisation en développement
                if (data.emailPreviewUrl && process.env.NODE_ENV !== 'production') {
                    console.log('📧 Prévisualisation email:', data.emailPreviewUrl);
                }
                
                // Redirection vers une page de confirmation
                setTimeout(() => {
                    router.push('/auth/check-email');
                }, 2000);
            } else {
                setError(data.error || 'Erreur lors de l\'inscription');
            }
        } catch (err) {
            setError('Erreur de connexion au serveur');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div>
            <div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="mb-[32px] flex flex-col items-center justify-center gap-[12px]">
                        <div>
                            <input
                                id="username"
                                name="username"
                                type="text"
                                value={formData.username}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-[226px] px-3 py-2 bg-[#D9D9D9] text-[#828282] text-sm rounded-[14px] shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Votre nom d'utilisateur"
                            />
                        </div>

                        <div>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-[226px] px-3 py-2 bg-[#D9D9D9] text-[#828282] text-sm rounded-[14px] shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="votre.email@exemple.com"
                            />
                        </div>

                        <div>
                            <input
                                id="password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-[226px] px-3 py-2 bg-[#D9D9D9] text-[#828282] text-sm rounded-[14px] shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Entrer votre mot de passe"
                            />
                        </div>

                        <div>
                            <input
                                id="confirmPassword"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                required
                                className="mt-1 block w-[226px] px-3 py-2 bg-[#D9D9D9] text-[#828282] text-sm rounded-[14px] shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                                placeholder="Confirmer votre mot de passe"
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="text-red-600 text-sm mt-2 p-3 bg-red-50 rounded-md border border-red-200">
                            {error}
                        </div>
                    )}

                    {success && (
                        <div className="text-green-600 text-sm mt-2 p-3 bg-green-50 rounded-md border border-green-200">
                            {success}
                        </div>
                    )}

                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-[226px] flex justify-center mx-auto py-2 px-4 rounded-[14px] shadow-sm font-medium text-black bg-[#FFB151] disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {isLoading ? (
                            <span className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Inscription en cours...
                            </span>
                        ) : (
                            'S\'inscrire'
                        )}
                    </button>
                </form>
            </div>
        </div>
    );
};
