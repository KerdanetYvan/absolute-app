"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/Footer';
import { useRouter, redirect } from 'next/navigation';

interface UserProfile {
    _id: string;
    bannerPicture: string;
    profilePicture: string;
    username: string;
    email: string;
    isEmailVerified: boolean;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function ProfilePage() {
    const { auth, isAuthenticated, isLoading: authLoading } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasRedirected, setHasRedirected] = useState(false);
    const router = useRouter();

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
            
            console.log('📨 Réponse API:', response.status, response.statusText);
            
            if (!response.ok) {
                const errorData = await response.json().catch(() => null);
                throw new Error(errorData?.error || `Erreur ${response.status}: ${response.statusText}`);
            }
            
            const userData = await response.json();
            console.log('✅ Profil utilisateur récupéré:', userData);
            setUserProfile(userData);
            
        } catch (err: any) {
            console.error('❌ Erreur lors de la récupération du profil:', err);
            setError(err.message || 'Erreur inconnue');
        } finally {
            setLoading(false);
        }
    };

    if (authLoading || loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="max-w-md w-full bg-white rounded-lg shadow-md p-8">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">Erreur</h3>
                        <p className="text-gray-600 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
                        >
                            Réessayer
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (!userProfile) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600">Aucun profil trouvé</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 mb-12">
            <div className='pt-8 flex flex-col items-center justify-center gap-[22px]'>
                <div className='relative w-full flex flex-col items-center justify-center pt-[20px]'>
                    {userProfile.bannerPicture ? (
                        <img 
                            src={userProfile.bannerPicture} 
                            alt="Bannière de profil" 
                            className="absolute top-0 w-full h-[116px] object-cover z-0"
                        />
                    ) : (
                        <div className="absolute top-0 w-full h-[116px] bg-gradient-to-br from-orange-400/50 to-orange-600/50 flex items-center justify-center z-0">

                        </div>
                    )}
                    {userProfile.profilePicture ? (
                        <img 
                        src={userProfile.profilePicture} 
                        alt="Photo de profil" 
                        className="w-[138px] h-[138px] object-cover rounded-2xl z-10"
                        />
                    ) : (
                        <div className="w-[138px] h-[138px] bg-gradient-to-br from-orange-400 to-orange-600 rounded-2xl flex items-center justify-center z-10">
                            <span className="text-2xl font-bold text-white">
                                {userProfile.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                <div id='username' className='font-bold text-2xl'>
                    {userProfile.username}
                    {userProfile.isAdmin && (
                        <span className="text-sm text-gray-500 ml-2">(Admin)</span>
                    )}
                    {!userProfile.isEmailVerified && (
                        <span className="text-sm text-yellow-500 ml-2">(Email non vérifié)</span>
                    )}
                </div>
                <button onClick={() => redirect('/edit-profile')}>Éditer le profil</button>
            </div>

            <div className="max-w-4xl mx-auto py-8 px-4">
                {/* Header */}
                <div className="bg-white rounded-lg shadow-md p-8 mb-6">
                    <div className="flex items-center space-x-6">
                        {/* Avatar */}
                        <div className="flex-shrink-0">
                            <div className="w-24 h-24 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center">
                                <span className="text-3xl font-bold text-white">
                                    {userProfile.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        </div>
                        
                        {/* Informations utilisateur */}
                        <div className="flex-1">
                            <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                {userProfile.username}
                            </h1>
                            <p className="text-gray-600 mb-2">
                                {userProfile.email}
                            </p>
                            <div className="flex items-center space-x-4">
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                                    userProfile.isEmailVerified 
                                        ? 'bg-green-100 text-green-800' 
                                        : 'bg-yellow-100 text-yellow-800'
                                }`}>
                                    {userProfile.isEmailVerified ? (
                                        <>
                                            <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                            </svg>
                                            Email vérifié
                                        </>
                                    ) : (
                                        <>
                                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                                            </svg>
                                            Email non vérifié
                                        </>
                                    )}
                                </span>
                                <span className="text-sm text-gray-500">
                                    Membre depuis {new Date(userProfile.createdAt).toLocaleDateString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Statistiques */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-orange-500 mb-2">0</div>
                        <div className="text-gray-600">Articles publiés</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-blue-500 mb-2">0</div>
                        <div className="text-gray-600">Commentaires</div>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <div className="text-3xl font-bold text-green-500 mb-2">0</div>
                        <div className="text-gray-600">Likes reçus</div>
                    </div>
                </div>

                {/* Actions */}
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-xl font-semibold text-gray-900 mb-4">Actions du compte</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                            </svg>
                            Modifier le profil
                        </button>
                        
                        <button className="flex items-center justify-center px-4 py-3 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors">
                            <svg className="w-5 h-5 mr-2 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
                            </svg>
                            Changer le mot de passe
                        </button>
                        
                        {!userProfile.isEmailVerified && (
                            <button className="flex items-center justify-center px-4 py-3 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors">
                                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                </svg>
                                Vérifier l'email
                            </button>
                        )}
                        
                        <button className="flex items-center justify-center px-4 py-3 border border-red-300 text-red-600 rounded-md hover:bg-red-50 transition-colors">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Supprimer le compte
                        </button>
                    </div>
                </div>
            </div>
            
            <Footer />
        </div>
    );
}
