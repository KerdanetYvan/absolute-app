"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GoBack from '@/components/GoBack';
import { schoolsData } from '@/lib/schools-data';

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
    const [articles, setArticles] = useState<any[]>([]);
    const [articlesLoading, setArticlesLoading] = useState(false);
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

        // Fetch des articles
        if (!authLoading && isAuthenticated) {
            fetchArticles();
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

    const fetchArticles = async () => {
        try {
            setArticlesLoading(true);
            console.log('📰 Récupération des articles...');
            
            const response = await fetch('/api/articles');
            
            if (!response.ok) {
                console.warn('⚠️ Erreur API articles:', response.status);
                return; // Échouer silencieusement
            }
            
            const articlesData = await response.json();
            console.log('✅ Articles récupérés:', articlesData?.length || 0);
            
            // Prendre les 5 derniers articles (triés par date de création)
            const sortedArticles = articlesData
                .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                .slice(0, 5);
            
            setArticles(sortedArticles);
            
        } catch (err: any) {
            console.warn('⚠️ Erreur lors de la récupération des articles:', err);
            // Échouer silencieusement - pas d'erreur critique
        } finally {
            setArticlesLoading(false);
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

            {/* Écoles favorites */}
            <div className="w-full py-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 px-4">Écoles d'animation suivies</h2>
                
                {userProfile.favSchools && userProfile.favSchools.length > 0 ? (
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex space-x-4 px-4 pb-2">
                            {userProfile.favSchools.map((schoolId) => {
                                const school = schoolsData.find(s => s.id === schoolId);
                                if (!school) return null;
                                
                                return (
                                    <div key={school.id} className="flex-shrink-0">
                                        <Link href={`/ecoles/${school.id}`} className="block">
                                            <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-orange-100 dark:from-sky-100 to-orange-200 dark:to-sky-200 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                                                {school.logo ? (
                                                    <Image
                                                        src={school.logo}
                                                        alt={`Logo ${school.nom}`}
                                                        width={160}
                                                        height={160}
                                                        className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                                    />
                                                ) : (
                                                    <svg className="w-8 h-8 md:w-12 md:h-12 text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                                                    </svg>
                                                )}
                                            </div>
                                        </Link>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-400 dark:text-gray-200 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-200">
                            Aucune école suivie pour le moment
                        </p>
                        <Link href="/ecoles-map" className="inline-block mt-4 bg-orange-500 dark:bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 dark:hover:bg-sky-600 transition-colors">
                            Découvrir les écoles
                        </Link>
                    </div>
                )}
            </div>

            {/* Section des derniers articles */}
            <div className="w-full py-6">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 px-4">Les derniers articles</h2>
                
                {articlesLoading ? (
                    <div className="flex justify-center items-center h-32">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 dark:border-sky-500"></div>
                    </div>
                ) : articles.length > 0 ? (
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex space-x-4 px-4 pb-2">
                            {articles.map((article) => (
                                <div key={article._id} className="flex-shrink-0">
                                    <Link href={`/article/${article.slug}`} className="block">
                                        <div className="w-[217px] h-[121px] bg-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                                            {article.coverImageUrl ? (
                                                <Image
                                                    src={article.coverImageUrl}
                                                    alt={article.title}
                                                    width={217}
                                                    height={121}
                                                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                                                />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 dark:from-sky-100 to-orange-200 dark:to-sky-200">
                                                    <div className="text-center p-3">
                                                        <svg className="w-6 h-6 mx-auto mb-1 text-orange-400 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                                        </svg>
                                                        <h3 className="text-xs font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
                                                            {article.title}
                                                        </h3>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </Link>
                                </div>
                            ))}
                        </div>
                    </div>
                ) : (
                    <div className="text-center py-8">
                        <div className="text-gray-400 dark:text-gray-200 mb-4">
                            <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                            </svg>
                        </div>
                        <p className="text-gray-500 dark:text-gray-200">
                            Aucun article à afficher
                        </p>
                    </div>
                )}
            </div>
            
            <GoBack />
            <Footer />
        </div>
    );
}
