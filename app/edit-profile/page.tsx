"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';

interface UserProfile {
    _id: string;
    username: string;
    email: string;
    profilePicture?: string | null;
    bannerPicture?: string | null;
    latitude?: number | null;
    longitude?: number | null;
    isEmailVerified: boolean;
    createdAt: string;
    updatedAt: string;
}

interface FormData {
    username: string;
    email: string;
    profilePicture: string;
    bannerPicture: string;
    latitude: string;
    longitude: string;
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}

export default function EditProfilePage() {
    const { auth, isAuthenticated, isLoading: authLoading } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);
    const [hasRedirected, setHasRedirected] = useState(false);
    const router = useRouter();

    const [formData, setFormData] = useState<FormData>({
        username: '',
        email: '',
        profilePicture: '',
        bannerPicture: '',
        latitude: '',
        longitude: '',
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    useEffect(() => {
        // Redirection si non authentifié
        if (!authLoading && !isAuthenticated && !hasRedirected) {
            setHasRedirected(true);
            router.push('/auth/login');
            return;
        }
        
        // Fetch du profil utilisateur si authentifié
        if (!authLoading && isAuthenticated && auth?._id && !userProfile) {
            fetchUserProfile(auth._id);
        }
    }, [auth?._id, isAuthenticated, authLoading, userProfile, hasRedirected]);

    // Debug: Afficher les valeurs du formulaire quand elles changent
    useEffect(() => {
        console.log('📝 FormData mis à jour:', formData);
        console.log('📝 Détail des valeurs:');
        console.log('  - username:', `"${formData.username}"`);
        console.log('  - email:', `"${formData.email}"`);
        console.log('  - profilePicture:', `"${formData.profilePicture}"`);
        console.log('  - latitude:', `"${formData.latitude}"`);
        console.log('  - longitude:', `"${formData.longitude}"`);
    }, [formData]);

    const fetchUserProfile = async (userId: string) => {
        try {
            setLoading(true);
            setError(null);
            console.log('🔄 Récupération du profil utilisateur:', userId);
            
            const response = await fetch(`/api/users/${userId}`, {
                headers: {
                    'Content-Type': 'application/json',
                }
            });
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Erreur ${response.status}: ${response.statusText}`);
            }
            
            const userData = await response.json();
            console.log('✅ Profil utilisateur récupéré:', userData);
            
            setUserProfile(userData);
            
            // Pré-remplir le formulaire
            console.log('📋 Avant setFormData, userData:', userData);
            const newFormData = {
                username: userData.username || '',
                email: userData.email || '',
                profilePicture: userData.profilePicture || '',
                bannerPicture: userData.bannerPicture || '',
                latitude: userData.latitude?.toString() || '',
                longitude: userData.longitude?.toString() || '',
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            };
            
            console.log('📋 Nouveau formData à définir:', newFormData);
            setFormData(newFormData);

            console.log('📋 Formulaire pré-rempli:', {
                username: userData.username,
                email: userData.email,
                profilePicture: userData.profilePicture,
                bannerPicture: userData.bannerPicture,
                latitude: userData.latitude,
                longitude: userData.longitude
            });
            
        } catch (err: any) {
            console.error('❌ Erreur lors de la récupération du profil:', err);
            setError(err.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        
        // Effacer les messages d'erreur/succès lors de la saisie
        if (error) setError(null);
        if (success) setSuccess(null);
    };

    const validateForm = (): boolean => {
        // Validation de l'email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email)) {
            setError('Veuillez saisir une adresse email valide');
            return false;
        }

        // Validation du nom d'utilisateur
        if (formData.username.length < 3) {
            setError('Le nom d\'utilisateur doit contenir au moins 3 caractères');
            return false;
        }

        // Validation des mots de passe si changement demandé
        if (formData.newPassword) {
            if (!formData.currentPassword) {
                setError('Veuillez saisir votre mot de passe actuel');
                return false;
            }
            if (formData.newPassword.length < 6) {
                setError('Le nouveau mot de passe doit contenir au moins 6 caractères');
                return false;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setError('Les mots de passe ne correspondent pas');
                return false;
            }
        }

        // Validation des URLs d'images
        const urlRegex = /^https?:\/\/.*\.(jpg|jpeg|png|gif)$/i;
        if (formData.profilePicture && !urlRegex.test(formData.profilePicture)) {
            setError('L\'URL de la photo de profil doit être une image valide (jpg, jpeg, png, gif)');
            return false;
        }
        if (formData.bannerPicture && !urlRegex.test(formData.bannerPicture)) {
            setError('L\'URL de la bannière doit être une image valide (jpg, jpeg, png, gif)');
            return false;
        }

        // Validation des coordonnées
        if (formData.latitude && (isNaN(Number(formData.latitude)) || Number(formData.latitude) < -90 || Number(formData.latitude) > 90)) {
            setError('La latitude doit être un nombre entre -90 et 90');
            return false;
        }
        if (formData.longitude && (isNaN(Number(formData.longitude)) || Number(formData.longitude) < -180 || Number(formData.longitude) > 180)) {
            setError('La longitude doit être un nombre entre -180 et 180');
            return false;
        }

        return true;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }

        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const updateData: any = {
                username: formData.username,
                email: formData.email,
            };

            // Ajouter les champs optionnels seulement s'ils sont renseignés
            if (formData.profilePicture) updateData.profilePicture = formData.profilePicture;
            if (formData.bannerPicture) updateData.bannerPicture = formData.bannerPicture;
            if (formData.latitude) updateData.latitude = Number(formData.latitude);
            if (formData.longitude) updateData.longitude = Number(formData.longitude);
            if (formData.newPassword) {
                updateData.currentPassword = formData.currentPassword;
                updateData.password = formData.newPassword;
            }

            const response = await fetch(`/api/users/${userProfile?._id}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updateData),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Erreur lors de la mise à jour');
            }

            setSuccess('Profil mis à jour avec succès !');
            
            // Réinitialiser les champs de mot de passe
            setFormData(prev => ({
                ...prev,
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            }));

            // Rafraîchir les données du profil
            if (userProfile?._id) {
                fetchUserProfile(userProfile._id);
            }

        } catch (err: any) {
            console.error('❌ Erreur lors de la mise à jour:', err);
            setError(err.message || 'Erreur inconnue');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#454141] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 dark:border-[#3CBDD1] mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
                </div>
            </div>
        );
    }

    if (error && !userProfile) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-[#454141] flex items-center justify-center">
                <div className="max-w-md w-full bg-white dark:bg-gray-800 rounded-lg shadow-md p-8">
                    <div className="text-center">
                        <div className="text-red-500 dark:text-red-400 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Erreur</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-orange-500 dark:bg-[#3CBDD1] hover:bg-orange-600 dark:hover:bg-[#3CBDD1]/80 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-[#454141] pb-20">
            <div className="w-full flex flex-col items-center justify-center max-w-4xl mx-auto py-8 px-4">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-8">
                    Modifier le profil
                </h1>

                {/* Formulaire */}
                {userProfile ? (
                    <form onSubmit={handleSubmit} className="space-y-6 w-full">
                        {/* Messages */}
                        {error && (
                            <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-600 dark:text-red-400 px-4 py-3 rounded-md">
                                {error}
                            </div>
                        )}
                        
                        {success && (
                            <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-800 text-green-600 dark:text-green-400 px-4 py-3 rounded-md">
                                {success}
                            </div>
                        )}

                        {/* Images */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Images</h3>
                            
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="profilePicture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Photo de profil (URL)
                                    </label>
                                    <input
                                        type="url"
                                        id="profilePicture"
                                        name="profilePicture"
                                        value={formData.profilePicture}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-[#FFB151] dark:border-[#3CBDD1] text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB151] dark:focus:ring-[#3CBDD1]"
                                        placeholder="https://exemple.com/photo.jpg"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Formats acceptés : jpg, jpeg, png, gif</p>
                                </div>
                                
                                <div>
                                    <label htmlFor="bannerPicture" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Image de bannière (URL)
                                    </label>
                                    <input
                                        type="url"
                                        id="bannerPicture"
                                        name="bannerPicture"
                                        value={formData.bannerPicture}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-[#FFB151] dark:border-[#3CBDD1] text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB151] dark:focus:ring-[#3CBDD1]"
                                        placeholder="https://exemple.com/banniere.jpg"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Formats acceptés : jpg, jpeg, png, gif</p>
                                </div>
                            </div>
                        </div>

                        {/* Localisation */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Localisation</h3>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Latitude
                                    </label>
                                    <input
                                        type="number"
                                        id="latitude"
                                        name="latitude"
                                        step="any"
                                        min="-90"
                                        max="90"
                                        value={formData.latitude}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-[#FFB151] dark:border-[#3CBDD1] text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB151] dark:focus:ring-[#3CBDD1]"
                                        placeholder="48.8566"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Entre -90 et 90</p>
                                </div>
                                
                                <div>
                                    <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Longitude
                                    </label>
                                    <input
                                        type="number"
                                        id="longitude"
                                        name="longitude"
                                        step="any"
                                        min="-180"
                                        max="180"
                                        value={formData.longitude}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-[#FFB151] dark:border-[#3CBDD1] text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB151] dark:focus:ring-[#3CBDD1]"
                                        placeholder="2.3522"
                                    />
                                    <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Entre -180 et 180</p>
                                </div>
                            </div>
                        </div>

                        {/* Changement de mot de passe */}
                        <div className="p-6">
                            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Changer le mot de passe</h3>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">Laissez ces champs vides si vous ne souhaitez pas changer votre mot de passe.</p>
                            
                            <div className="space-y-6">
                                <div>
                                    <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                        Mot de passe actuel
                                    </label>
                                    <input
                                        type="password"
                                        id="currentPassword"
                                        name="currentPassword"
                                        value={formData.currentPassword}
                                        onChange={handleInputChange}
                                        className="w-full px-3 py-2 border border-[#FFB151] dark:border-[#3CBDD1] text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB151] dark:focus:ring-[#3CBDD1]"
                                    />
                                </div>
                                
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Nouveau mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            id="newPassword"
                                            name="newPassword"
                                            value={formData.newPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-[#FFB151] dark:border-[#3CBDD1] text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB151] dark:focus:ring-[#3CBDD1]"
                                        />
                                    </div>
                                    
                                    <div>
                                        <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                            Confirmer le nouveau mot de passe
                                        </label>
                                        <input
                                            type="password"
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            value={formData.confirmPassword}
                                            onChange={handleInputChange}
                                            className="w-full px-3 py-2 border border-[#FFB151] dark:border-[#3CBDD1] text-gray-900 dark:text-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-[#FFB151] dark:focus:ring-[#3CBDD1]"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Boutons d'action */}
                        <div className="p-6">
                            <div className="flex justify-end space-x-4">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="px-6 py-2 bg-orange-500 dark:bg-[#3CBDD1] text-white rounded-md hover:bg-orange-600 dark:hover:bg-[#3CBDD1]/80 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
                                >
                                    {saving ? (
                                        <>
                                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                            </svg>
                                            Enregistrement...
                                        </>
                                    ) : (
                                        'Enregistrer les modifications'
                                    )}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : (
                    <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-8 text-center w-full">
                        <div className="animate-pulse">
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/4 mx-auto mb-4"></div>
                            <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mx-auto"></div>
                        </div>
                        <p className="text-gray-600 dark:text-gray-400 mt-4">Chargement du formulaire...</p>
                    </div>
                )}
            </div>
            
            <Footer />
        </div>
    );
}
