'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';

import GoBack from '@/components/GoBack';
import Carroussel from '@/components/Carroussel';

interface Article {
  _id: string;
  title: string;
  content: string;
  slug: string;
  category: string;
  coverImageUrl?: string | null; // URL de l'image de couverture, peut être null
  videoUrl?: string | null; // URL de la vidéo, peut être null
  tags: string[];
  author: {
    username: string;
    email: string;
  } | string;
  createdAt: string;
  updatedAt: string;
  likes: number;
  views: number;
}

export default function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const [article, setArticle] = useState<Article | null>(null);
  const [otherArticles, setOtherArticles] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const router = useRouter();
  
  // Unwrap params using React.use()
  const { slug } = React.use(params);

  useEffect(() => {
    if (slug) {
      fetchArticle(slug);
    }
  }, [slug]);

  const fetchArticle = async (slug: string) => {
    try {
      // Pour l'instant, nous utilisons l'API GET tous les articles et filtrons par slug
      // Dans une vraie application, vous auriez une API GET /api/articles/[slug]
      const response = await fetch('/api/articles');
      if (response.ok) {
        const articles = await response.json();
        const foundArticle = articles.find((a: Article) => a.slug === slug);
        if (foundArticle) {
          setArticle(foundArticle);
          const otherArticlesList = articles.filter((a: Article) => a.slug !== slug);
          const otherArticlesIds = otherArticlesList.map((a: Article) => a._id);
          setOtherArticles(otherArticlesIds.slice(0, 5)); // Limiter à 3 articles
        } else {
          setError('Article non trouvé');
        }
      } else {
        setError('Erreur lors du chargement de l\'article');
      }
    } catch (err) {
      setError('Erreur de connexion');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const renderMarkdownContent = (content: string) => {
    // Convertir le Markdown basique en HTML
    return content
      .split('\n\n')
      .map((paragraph, index) => {
        if (paragraph.startsWith('# ')) {
          return (
            <h1 key={index} className="text-3xl font-bold my-6 text-gray-900 dark:text-white">
              {paragraph.substring(2)}
            </h1>
          );
        } else if (paragraph.startsWith('## ')) {
          return (
            <h2 key={index} className="text-2xl font-semibold my-5 text-gray-900 dark:text-white">
              {paragraph.substring(3)}
            </h2>
          );
        } else if (paragraph.startsWith('### ')) {
          return (
            <h3 key={index} className="text-xl font-semibold my-4 text-gray-900 dark:text-white">
              {paragraph.substring(4)}
            </h3>
          );
        } else {
          // Traiter le formatage en ligne (gras, italique)
          let formattedParagraph = paragraph
            .replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>');
          
          return (
            <p 
              key={index} 
              className="text-gray-700 dark:text-gray-300 leading-relaxed mb-4"
              dangerouslySetInnerHTML={{ __html: formattedParagraph }}
            />
          );
        }
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#454141] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#FCB259] dark:border-[#3CBDD1] mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Chargement de l'article...</p>
        </div>
      </div>
    );
  }

  if (error || !article) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#454141] flex items-center justify-center">
        <GoBack />
        <div className="text-center">
          <div className="w-16 h-16 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Article non trouvé</h2>
          <p className="text-red-600 dark:text-red-400 font-medium mb-6">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-[#454141] py-4">
      <GoBack />
      <div className='w-full flex justify-end px-[20px] mb-2'>
        <Image
          src="/logo.webp"
          alt="Logo ANOMI"
          width={30}
          height={30}
          className="dark:hidden"
        />
        <Image
          src="/logo_dark.webp"
          alt="Logo ANOMI"
          width={30}
          height={30}
          className="hidden dark:block"
        />
      </div>
      <div className="max-w-4xl mx-auto px-2">

        {/* Article */}
        <article className="overflow-hidden">
          {/* Header */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            {/* Image de mise en avant */}
            {article.coverImageUrl && <img
              src={article.coverImageUrl || '/default-image.jpg'}
              alt={article.title}
              className="w-full h-64 object-cover rounded-lg mb-4"
            />}

            {/* Title */}
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2 leading-tight">
              {article.title}
            </h1>

            {/* Meta Info */}
            <div className="flex flex-wrap items-center justify-between text-sm text-gray-500 dark:text-gray-400 mb-6">
              <div className="flex items-center space-x-4">
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  {formatDate(article.createdAt)}
                </div>
                <div className="flex items-center">
                  <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  {typeof article.author === 'object' ? article.author.username : 'Auteur anonyme'}
                </div>
              </div>
            </div>

            {/* Tags */}
            {/* {article.tags && article.tags.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {article.tags.map((tag, index) => (
                  <span
                    key={index}
                    className="inline-block px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg text-sm font-medium"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )} */}
          </div>

          {/* Video (if available) */}
          {article.videoUrl && (
            <div className="p-4 bg-gray-50 dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
              <video
                controls
                className="w-full h-auto rounded-lg"
                src={article.videoUrl}
              >
                Votre navigateur ne supporte pas la vidéo.
              </video>
            </div>
          )}

          {/* Content */}
          <div className="p-2 md:p-8">
            <div className="prose prose-lg prose-gray dark:prose-invert max-w-none">
              {renderMarkdownContent(article.content)}
            </div>
          </div>

        </article>

        {/* Related Articles */}
        {otherArticles.length > 0 && (
          <div className="mt-12">
            <Carroussel
              titre='Autres articles'
              type='Articles'
              list={otherArticles}
            />
          </div>
        )}
      </div>
    </div>
  );
}
