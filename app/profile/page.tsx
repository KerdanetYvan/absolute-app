"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import Footer from '@/components/Footer';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import GoBack from '@/components/GoBack';
import { schoolsData } from '@/lib/schools-data';

export default function ProfilePage() {
    const { auth, isAuthenticated, isLoading: authLoading, logout } = useAuth();
    const [articles, setArticles] = useState<any[]>([]);
    const [articlesLoading, setArticlesLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        // Redirection si non authentifié (simple)
        if (!authLoading && !isAuthenticated) {
            router.push('/auth/login');
            return;
        }

        // Charger les articles seulement si authentifié
        if (!authLoading && isAuthenticated) {
            const fetchArticles = async () => {
                try {
                    const response = await fetch('/api/articles');
                    if (response.ok) {
                        const data = await response.json();
                        // Prendre les 5 derniers articles
                        const sortedArticles = data
                            .sort((a: any, b: any) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
                            .slice(0, 5);
                        setArticles(sortedArticles);
                    }
                } catch (error) {
                    console.warn('Erreur articles:', error);
                    // Pas d'erreur critique - continuer avec un tableau vide
                } finally {
                    setArticlesLoading(false);
                }
            };

            // Petite pause pour éviter les appels simultanés
            setTimeout(fetchArticles, 500);
        }
    }, [isAuthenticated, authLoading, router]);

    if (authLoading) {
        return (
            <div className="min-h-screen dark:bg-[#454141] flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 dark:border-sky-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600 dark:text-gray-400">Chargement...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated || !auth) {
        return (
            <div className="min-h-screen dark:bg-[#454141] flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400">Redirection en cours...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen dark:bg-[#454141] pb-20">
            
            <div className='pt-8 flex flex-col items-center justify-center gap-[22px]'>
                <div className='relative w-full flex flex-col items-center justify-center pt-[20px]'>
                    {auth.bannerPicture ? (
                        <img 
                            src={auth.bannerPicture} 
                            alt="Bannière de profil" 
                            className="absolute top-0 w-full h-[116px] object-cover z-0"
                        />
                    ) : (
                        <div className="absolute top-0 w-full h-[116px] bg-gradient-to-br from-orange-400/50 dark:from-sky-600/50 to-orange-600/50 dark:to-sky-400/50 flex items-center justify-center z-0">

                        </div>
                    )}
                    {auth.profilePicture ? (
                        <img 
                        src={auth.profilePicture} 
                        alt="Photo de profil" 
                        className="w-[138px] h-[138px] object-cover rounded-2xl z-10"
                        />
                    ) : (
                        <div className="w-[138px] h-[138px] bg-gradient-to-br from-orange-400 dark:from-sky-400 to-orange-600 dark:to-sky-600 rounded-2xl flex items-center justify-center z-10">
                            <span className="text-2xl font-bold text-white">
                                {auth.username.charAt(0).toUpperCase()}
                            </span>
                        </div>
                    )}
                </div>
                <div id='username' className='font-bold text-2xl dark:text-white'>
                    {auth.username}
                    {auth.isAdmin && (
                        <span className="text-sm text-gray-500 ml-2">(Admin)</span>
                    )}
                    {!auth.isEmailVerified && (
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
                
                {auth.favSchools && auth.favSchools.length > 0 ? (
                    <div className="overflow-x-auto scrollbar-hide">
                        <div className="flex space-x-4 px-4 pb-2">
                            {auth.favSchools.map((schoolId: string) => {
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
                            Aucun article à afficher pour le moment
                        </p>
                        <Link href="/" className="inline-block mt-4 bg-orange-500 dark:bg-sky-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 dark:hover:bg-sky-600 transition-colors">
                            Voir tous les articles
                        </Link>
                    </div>
                )}
            </div>
            
            <GoBack />
            <Footer />
        </div>
    );
}
