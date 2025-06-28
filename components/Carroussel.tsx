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

    // Rendu d'un article
    const renderArticle = (article: Article) => (
        <div key={article._id} className="flex-shrink-0">
            <Link href={`/articles/${article._id}`} className="block">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    {article.coverImageUrl ? (
                        <Image
                            src={article.coverImageUrl}
                            alt={article.title}
                            width={160}
                            height={160}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                        />
                    ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 to-orange-200">
                            <svg className="w-8 h-8 md:w-12 md:h-12 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );

    // Rendu d'une école
    const renderSchool = (school: School) => (
        <div key={school._id} className="flex-shrink-0">
            <Link href={`/schools/${school._id}`} className="block">
                <div className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                    <svg className="w-8 h-8 md:w-12 md:h-12 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                </div>
            </Link>
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
        <div className="w-full py-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-6 px-4">{titre}</h2>
            
            <div className="overflow-x-auto scrollbar-hide">
                <div className="flex space-x-4 px-4 pb-2">
                    {items.map((item) => 
                        type === 'Articles' 
                            ? renderArticle(item as Article)
                            : renderSchool(item as School)
                    )}
                </div>
            </div>
        </div>
    );
}
