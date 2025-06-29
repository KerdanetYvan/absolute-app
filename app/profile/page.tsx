"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import Carroussel from '@/components/Carroussel';
import GoBack from '@/components/GoBack';

interface UserProfile {
    _id: string;
    bannerPicture: string;
    profilePicture: string;
    username: string;
    email: string;
    favSchools: string[];
    isEmailVerified: boolean;
    isAdmin: boolean;
    createdAt: string;
    updatedAt: string;
}

export default function ProfilePage() {
    const { auth, isAuthenticated, isLoading: authLoading, logout } = useAuth();
    const [userProfile, setUserProfile] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [hasRedirected, setHasRedirected] = useState(false);
    const [allArticles, setAllArticles] = useState<any[]>([]);
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

        const fetchArticles = async () => {
            try {
                setLoading(true);
                console.log('🔄 Tentative de récupération des articles...');
                
                const response = await fetch(`/api/articles`);
                console.log('📊 Statut réponse:', response.status);
                
                if (!response.ok) {
                    const errorText = await response.text();
                    console.error('❌ Erreur API:', errorText);
                    throw new Error(`Erreur ${response.status}: ${errorText}`);
                }
                
                const data = await response.json();
                console.log('✅ Articles récupérés:', data);
                setAllArticles(data);
                
            } catch (error: any) {
                console.error('❌ Erreur lors de la récupération:', error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };
        fetchArticles();
    }, [auth?._id, isAuthenticated, authLoading, userProfile, hasRedirected]);

    const listIdArticles = allArticles.map((article: any) => article._id);

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
            <div className="min-h-screen dark:bg-[#454141] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 dark:border-sky-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement du profil...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen dark:bg-[#454141] flex items-center justify-center">
                <div className="max-w-md w-full p-8">
                    <div className="text-center">
                        <div className="text-red-500 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.728-.833-2.498 0L4.316 15.5c-.77.833.192 2.5 1.732 2.5z" />
                            </svg>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">Erreur</h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-4">{error}</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="bg-orange-500 dark:bg-sky-500 dark:hover:bg-sky-400 hover:bg-orange-600 text-white px-4 py-2 rounded-md transition-colors"
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
            <div className="min-h-screen dark:bg-[#454141] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Aucun profil trouvé</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:bg-[#454141] pb-20">
            
            <div className='pt-8 flex flex-col items-center justify-center gap-[22px]'>
                <div className='relative w-full flex flex-col items-center justify-center pt-[20px]'>
                    {userProfile.bannerPicture ? (
                        <img 
                            src={userProfile.bannerPicture} 
                            alt="Bannière de profil" 
                            className="absolute top-0 w-full h-[116px] object-cover z-0"
                        />
                    ) : (
                        <div className="absolute top-0 w-full h-[116px] bg-gradient-to-br from-orange-400/50 dark:from-sky-600/50 to-orange-600/50 dark:to-sky-400/50 flex items-center justify-center z-0">

                        </div>
                    )}
                    {userProfile.profilePicture ? (
                        <img 
                        src={userProfile.profilePicture} 
                        alt="Photo de profil" 
                        className="w-[138px] h-[138px] object-cover rounded-2xl z-10"
                        />
                    ) : (
                        <div className="w-[138px] h-[138px] bg-gradient-to-br from-orange-400 dark:from-sky-400 to-orange-600 dark:to-sky-600 rounded-2xl flex items-center justify-center z-10">
                            <span className="text-2xl font-bold text-white">
                                {userProfile.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                <div id='username' className='font-bold text-2xl dark:text-white'>
                    {userProfile.username}
                    {userProfile.isAdmin && (
                        <span className="text-sm text-gray-500 ml-2">(Admin)</span>
                    )}
                    {!userProfile.isEmailVerified && (
                        <span className="text-sm text-yellow-500 ml-2">(Email non vérifié)</span>
                    )}
                </div>
                <div className="flex flex-col gap-3 w-full items-center">
                    <button onClick={() => router.push('/edit-profile')} className='h-[30px] w-[184px] rounded-[10px] bg-[#FEB157] dark:bg-[#3CBDD1] font-bold'>
                        Éditer le profil
                    </button>
                    <button 
                        onClick={logout} 
                        className='h-[30px] w-[184px] rounded-[10px] bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 text-white font-bold transition-colors'
                    >
                        Se déconnecter
                    </button>
                </div>
            </div>

            <Carroussel
                titre="Écoles d'animation suivies"
                type='Schools'
                list={userProfile.favSchools}
            />

            <Carroussel
                titre='Les derniers articles'
                type='Articles'
                list={listIdArticles}
            />
            <GoBack />
            <Footer />
        </div>
    );
}
