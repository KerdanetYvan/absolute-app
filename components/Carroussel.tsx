"use client";

import React, { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';

// Types pour les données
interface Article {
    _id: string;
    title: string;
    content: string;
    author: {
        _id: string;
        username: string;
    };
    category: string;
    tags: string[];
    slug: string;
    likes: number;
    views: number;
    coverImageUrl?: string;
    createdAt: string;
}

interface School {
    _id?: string;
    id?: string;
    name?: string;
    nom?: string; // Champ français pour le nom
    address?: string;
    adresse?: string; // Champ français pour l'adresse
    city?: string;
    website?: string;
    site?: string; // Champ français pour le site web
    logo?: string; // Chemin vers le logo
    createdAt?: string;
}

type CarouselItem = Article | School;

// Props du composant
interface CarrousselProps {
    titre: string;
    type: 'Articles' | 'Schools';
    taille?: 'small' | 'medium' | 'large';
    list: string[];
}

export default function Carroussel({ titre, type, taille, list }: CarrousselProps) {
    const [items, setItems] = useState<CarouselItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [imageErrors, setImageErrors] = useState<Set<string>>(new Set());

    // Charger les données depuis l'API
    useEffect(() => {
        const fetchItems = async () => {
            try {
                setLoading(true);
                
                if (type === 'Articles') {
                    // Charger les articles
                    const articlePromises = list.map(async (id) => {
                        const response = await fetch(`/api/articles/${id}`);
                        if (response.ok) {
                            return await response.json();
                        }
                        return null;
                    });
                    
                    const articles = await Promise.all(articlePromises);
                    setItems(articles.filter(item => item !== null));
                    
                } else if (type === 'Schools') {
                    // Charger les écoles
                    const schoolPromises = list.map(async (id) => {
                        const response = await fetch(`/api/schools/${id}`);
                        if (response.ok) {
                            return await response.json();
                        }
                        return null;
                    });
                    
                    const schools = await Promise.all(schoolPromises);
                    setItems(schools.filter(item => item !== null));
                }
            } catch (err) {
                setError('Erreur lors du chargement des données');
                console.error('Erreur carrousel:', err);
            } finally {
                setLoading(false);
            }
        };

        if (list && list.length > 0) {
            fetchItems();
        } else {
            setLoading(false);
        }
    }, [list, type]);

    // Fonction pour tronquer le texte (pas utilisée dans la nouvelle version)
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    const getItemSizeClasses = () => {
        switch (taille) {
            case 'small':
                return 'w-[89px] h-[87px]';
            case 'medium':
                return 'w-[217px] h-[121px]';
            case 'large':
                return 'w-[310px] h-[172px]';
            default:
                return 'w-32 h-32'; // Taille par défaut
        }
    }

    // Rendu d'un article
    const renderArticle = (article: Article, key: string) => (
        <div key={key} className="flex-shrink-0">
            <Link href={`/article/${article.slug}`} className="block">
                <div className={`${getItemSizeClasses()} bg-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer`}>
                    {article.coverImageUrl ? (
                        <Image
                            src={article.coverImageUrl}
                            alt={article.title}
                            width={160}
                            height={160}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 dark:from-sky-100 to-orange-200 dark:to-sky-200">
                            <svg className="w-8 h-8 md:w-12 md:h-12 text-orange-400 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );

    // Rendu d'une école 
    const renderSchool = (school: School, key: string) => {
        const schoolName = school.name || school.nom || 'École';
        const logoPath = school.logo;
        const hasImageError = logoPath && imageErrors.has(logoPath);
        
        const handleImageError = () => {
            if (logoPath) {
                setImageErrors(prev => new Set(prev).add(logoPath));
            }
        };
        
        return (
            <div key={key} className="flex-shrink-0">
                <Link href={`/schools/${school.id || school._id}`} className="block">
                    <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-orange-100 dark:from-sky-100 to-orange-200 dark:to-sky-200 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer overflow-hidden">
                        {logoPath && !hasImageError ? (
                            <Image
                                src={logoPath}
                                alt={`Logo ${schoolName}`}
                                width={160}
                                height={160}
                                className="w-full h-full object-contain hover:scale-105 transition-transform duration-300"
                                onError={handleImageError}
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
    };

    if (loading) {
        return (
            <div className="w-full py-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 text-center">{titre}</h2>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 dark:border-sky-500"></div>
                </div>
            </div>
        );
    }

    if (error || items.length === 0) {
        return (
            <div className="w-full py-2">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 px-4">{titre}</h2>
                <div className="text-center py-4">
                    <div className="text-gray-400 dark:text-gray-200 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                        </svg>
                    </div>
                    <p className="text-gray-500 dark:text-gray-200">
                        {error || `Aucun ${type.toLowerCase()} à afficher`}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full py-6">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 px-4">{titre}</h2>
            
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 px-4 pb-2">
                    {items.map((item) => {
                        const key = type === 'Articles' 
                            ? (item as Article)._id 
                            : (item as School).id || (item as School)._id || 'unknown';
                        
                        return type === 'Articles' 
                            ? renderArticle(item as Article, key || 'unknown')
                            : renderSchool(item as School, key);
                    })}
                </div>
            </div>
        </div>
    );
}
