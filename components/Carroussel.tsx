"use client";

import { ObjectId } from 'mongoose';
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
    likes: number;
    views: number;
    coverImageUrl?: string;
    createdAt: string;
}

interface School {
    _id: string;
    name: string;
    address: string;
    city: string;
    website: string;
    createdAt: string;
}

type CarouselItem = Article | School;

// Props du composant
interface CarrousselProps {
    titre: string;
    type: 'Articles' | 'Schools';
    list: ObjectId[];
}

export default function Carroussel({ titre, type, list }: CarrousselProps) {
    const [items, setItems] = useState<CarouselItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [currentIndex, setCurrentIndex] = useState(0);
    const carouselRef = useRef<HTMLDivElement>(null);

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

    // Navigation du carrousel
    const goToSlide = (index: number) => {
        setCurrentIndex(index);
        if (carouselRef.current) {
            const slideWidth = carouselRef.current.offsetWidth;
            carouselRef.current.scrollTo({
                left: slideWidth * index,
                behavior: 'smooth'
            });
        }
    };

    const nextSlide = () => {
        const newIndex = (currentIndex + 1) % items.length;
        goToSlide(newIndex);
    };

    const prevSlide = () => {
        const newIndex = currentIndex === 0 ? items.length - 1 : currentIndex - 1;
        goToSlide(newIndex);
    };

    // Fonction pour tronquer le texte
    const truncateText = (text: string, maxLength: number) => {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength) + '...';
    };

    // Rendu d'un article
    const renderArticle = (article: Article) => (
        <div key={article._id} className="flex-shrink-0 w-full md:w-80 bg-white rounded-lg shadow-md overflow-hidden mx-2">
            <div className="relative h-48 bg-gray-200">
                {article.coverImageUrl ? (
                    <Image
                        src={article.coverImageUrl}
                        alt={article.title}
                        fill
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                        <svg className="w-16 h-16 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                    </div>
                )}
                <div className="absolute top-2 right-2 bg-orange-500 text-white px-2 py-1 rounded-full text-xs">
                    {article.category}
                </div>
            </div>
            
            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {truncateText(article.title, 50)}
                </h3>
                
                <p className="text-gray-600 text-sm mb-3">
                    {truncateText(article.content.replace(/<[^>]*>/g, ''), 100)}
                </p>
                
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                    <span>Par {article.author?.username || 'Anonyme'}</span>
                    <span>{new Date(article.createdAt).toLocaleDateString()}</span>
                </div>
                
                <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1 text-red-500" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                            </svg>
                            {article.likes}
                        </span>
                        <span className="flex items-center">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            {article.views}
                        </span>
                    </div>
                    
                    <Link
                        href={`/articles/${article._id}`}
                        className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1 rounded-full text-sm transition-colors"
                    >
                        Lire
                    </Link>
                </div>
                
                {article.tags && article.tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-1">
                        {article.tags.slice(0, 3).map((tag, index) => (
                            <span key={index} className="bg-gray-100 text-gray-600 px-2 py-1 rounded-full text-xs">
                                #{tag}
                            </span>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );

    // Rendu d'une école
    const renderSchool = (school: School) => (
        <div key={school._id} className="flex-shrink-0 w-full md:w-80 bg-white rounded-lg shadow-md overflow-hidden mx-2">
            <div className="relative h-48 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                <svg className="w-20 h-20 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-full text-xs">
                    École
                </div>
            </div>
            
            <div className="p-4">
                <h3 className="font-bold text-lg text-gray-800 mb-2">
                    {school.name}
                </h3>
                
                <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>{school.address}, {school.city}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9v-9m0-9v9" />
                        </svg>
                        <a 
                            href={school.website} 
                            target="_blank" 
                            rel="noopener noreferrer" 
                            className="text-blue-500 hover:text-blue-700 hover:underline"
                        >
                            Site web
                        </a>
                    </div>
                </div>
                
                <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-500">
                        Ajoutée le {new Date(school.createdAt).toLocaleDateString()}
                    </span>
                    
                    <Link
                        href={`/schools/${school._id}`}
                        className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded-full text-sm transition-colors"
                    >
                        Voir
                    </Link>
                </div>
            </div>
        </div>
    );

    if (loading) {
        return (
            <div className="w-full py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{titre}</h2>
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500"></div>
                </div>
            </div>
        );
    }

    if (error || items.length === 0) {
        return (
            <div className="w-full py-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">{titre}</h2>
                <div className="text-center py-12">
                    <div className="text-gray-400 mb-4">
                        <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                        </svg>
                    </div>
                    <p className="text-gray-500">
                        {error || `Aucun ${type.toLowerCase()} à afficher`}
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="w-full py-8">
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-800">{titre}</h2>
                <div className="flex items-center space-x-2">
                    {items.length > 1 && (
                        <>
                            <button
                                onClick={prevSlide}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                aria-label="Précédent"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button
                                onClick={nextSlide}
                                className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors"
                                aria-label="Suivant"
                            >
                                <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </>
                    )}
                </div>
            </div>
            
            <div className="relative">
                <div
                    ref={carouselRef}
                    className="flex overflow-x-auto scrollbar-hide space-x-4 pb-4"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {items.map((item) => 
                        type === 'Articles' 
                            ? renderArticle(item as Article)
                            : renderSchool(item as School)
                    )}
                </div>
                
                {items.length > 1 && (
                    <div className="flex justify-center mt-4 space-x-2">
                        {items.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => goToSlide(index)}
                                className={`w-2 h-2 rounded-full transition-colors ${
                                    index === currentIndex ? 'bg-orange-500' : 'bg-gray-300'
                                }`}
                                aria-label={`Aller au slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
