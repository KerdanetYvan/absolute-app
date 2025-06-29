"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { GrSearch } from 'react-icons/gr';

import Footer from '@/components/Footer';
import { schoolsData } from '@/lib/schools-data';

export default function page() {
  const [searchFilter, setSearchFilter] = useState({
    reportage: true,
    ecole: true,
    article: true,
  });
  const [reportageArticles, setReportageArticles] = useState<any[]>([]);
  const [newsArticles, setNewsArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchArticles = async () => {
      try {
        setLoading(true);
        const articlesResponse = await fetch('/api/articles');
        const articles = await articlesResponse.json();
        
        // Filtrer les articles de type 'reportage'
        const reportages = articles.filter((article: any) => 
          article.category === 'reportage' || article.type === 'reportage'
        );
        
        // Filtrer les autres articles (actualités/news)
        const news = articles.filter((article: any) => 
          article.category !== 'reportage' && article.type !== 'reportage'
        );
        
        console.log('📰 Articles reportage trouvés:', reportages.length);
        console.log('📰 Articles actualités trouvés:', news.length);
        
        setReportageArticles(reportages);
        setNewsArticles(news);
      } catch (error) {
        console.error('Erreur lors de la récupération des articles:', error);
        setReportageArticles([]);
        setNewsArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchArticles();
  }, []);

  const ToggleEvent = (event: string) => {
    if(searchFilter.reportage && searchFilter.ecole && searchFilter.article) {
      setSearchFilter({
        reportage: false,
        ecole: false,
        article: false,
      });
    }

    setSearchFilter((prev) => ({
      ...prev,
      [event]: !prev[event as keyof typeof prev],
    }));
  }

  return (
    <div className='min-h-screen py-8 w-full flex flex-col items-center bg-white dark:bg-[#454141] pb-20'>
      <h1 className='text-2xl font-bold text-black dark:text-white pb-[31px]'>ANOMI</h1>
      <div className=''>
        <div className='h-12 bg-[#FEB157] dark:bg-[#3CBDD1] flex items-center justify-center gap-2 w-full max-w-md rounded-full px-4 mb-4'>
          <GrSearch className='text-white flex-shrink-0' />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent text-white placeholder-white/70 flex-1 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
          />
        </div>
        <Link href="/ecoles-map" className='block py-2 px-4 rounded-full bg-[#FEB157] dark:bg-[#3CBDD1] font-bold text-black dark:text-white mb-4'>
          Trouvez les écoles proches de chez vous
        </Link>
        <div className='w-full flex justify-around gap-2'>
          <button
            onClick={() => ToggleEvent('reportage')}
            className={`py-1 px-3 rounded-md border border-[#FEB157] dark:border-[#3CBDD1] text-black dark:text-white` + (searchFilter.reportage ? ' bg-[#FEB157] dark:bg-[#3CBDD1]' : '')}
          >
            Reportage
          </button>
          <button
            onClick={() => ToggleEvent('ecole')}
            className={`py-1 px-3 rounded-md border border-[#FEB157] dark:border-[#3CBDD1] text-black dark:text-white` + (searchFilter.ecole ? ' bg-[#FEB157] dark:bg-[#3CBDD1]' : '')}
          >
            École
          </button>
          <button
            onClick={() => ToggleEvent('article')}
            className={`py-1 px-3 rounded-md border border-[#FEB157] dark:border-[#3CBDD1] text-black dark:text-white` + (searchFilter.article ? ' bg-[#FEB157] dark:bg-[#3CBDD1]' : '')}
          >
            News
          </button>
        </div>
      </div>
      {searchFilter.reportage && (
        <div className="w-full py-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 px-4">Reportages d'animation</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 dark:border-sky-500"></div>
            </div>
          ) : reportageArticles.length > 0 ? (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 px-4 pb-2">
                {reportageArticles.map((article) => (
                  <div key={article._id} className="flex-shrink-0">
                    <Link href={`/article/${article.slug}`} className="block">
                      <div className="w-[310px] h-[172px] bg-gray-200 rounded-2xl overflow-hidden shadow-md hover:shadow-lg transition-shadow cursor-pointer">
                        {article.coverImageUrl ? (
                          <Image
                            src={article.coverImageUrl}
                            alt={article.title}
                            width={310}
                            height={172}
                            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-orange-100 dark:from-sky-100 to-orange-200 dark:to-sky-200">
                            <div className="text-center p-4">
                              <svg className="w-8 h-8 mx-auto mb-2 text-orange-400 dark:text-sky-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <h3 className="text-sm font-medium text-gray-800 dark:text-gray-200 line-clamp-2">
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
            <div className="text-center py-4">
              <div className="text-gray-400 dark:text-gray-200 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 009.586 13H7" />
                </svg>
              </div>
              <p className="text-gray-500 dark:text-gray-200">
                Aucun reportage à afficher
              </p>
            </div>
          )}
        </div>
      )}
      
      {searchFilter.ecole && (
        <div className="w-full py-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 px-4">Écoles d'animation</h2>
          
          <div className="overflow-x-auto scrollbar-hide">
            <div className="flex space-x-4 px-4 pb-2">
              {schoolsData.slice(0, 10).map((school) => (
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
              ))}
            </div>
          </div>
        </div>
      )}
        
      {searchFilter.article && (
        <div className="w-full py-6">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-6 px-4">Actualités</h2>
          
          {loading ? (
            <div className="flex justify-center items-center h-32">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500 dark:border-sky-500"></div>
            </div>
          ) : newsArticles.length > 0 ? (
            <div className="overflow-x-auto scrollbar-hide">
              <div className="flex space-x-4 px-4 pb-2">
                {newsArticles.map((article) => (
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
            <div className="text-center py-4">
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
      )}

      <Footer />
    </div>
  )
}