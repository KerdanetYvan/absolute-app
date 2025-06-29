"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { GrSearch } from 'react-icons/gr';

import Footer from '@/components/Footer';
import Carroussel from '@/components/Carroussel';

export default function page() {
  const [searchFilter, setSearchFilter] = useState({
    reportage: true,
    ecole: true,
    article: true,
  });
  const [reportagesArticles, setReportagesArticles] = useState<string[]>([]);
  const [newsArticles, setNewsArticles] = useState<string[]>([]);
  const [ecoles, setEcoles] = useState<string[]>([]);

  useEffect(() => {
    // Récupérer les données depuis l'API
    const fetchData = async () => {
      try {
        // Récupérer tous les articles
        const articlesResponse = await fetch('/api/articles');
        const articles = await articlesResponse.json();
        
        // Filtrer les articles par type
        const reportages = articles
          .filter((article: any) => article.type === 'reportage')
          .map((article: any) => article._id);
        
        const news = articles
          .filter((article: any) => article.type !== 'reportage')
          .map((article: any) => article._id);
        
        setReportagesArticles(reportages);
        setNewsArticles(news);
        
        // Récupérer toutes les écoles
        console.log('🏫 Récupération des écoles...');
        const ecolesResponse = await fetch('/api/schools');
        console.log('🏫 Statut réponse écoles:', ecolesResponse.status);
        
        if (!ecolesResponse.ok) {
          const errorData = await ecolesResponse.text();
          console.error('❌ Erreur API écoles:', errorData);
          throw new Error(`Erreur récupération écoles: ${ecolesResponse.status}`);
        }
        
        const ecolesData = await ecolesResponse.json();
        console.log('🏫 Écoles récupérées:', ecolesData?.length || 0, 'écoles');
        console.log('🏫 Première école exemple:', ecolesData[0]);
        
        const ecolesIds = ecolesData.map((ecole: any) => ecole.id); // Utiliser 'id' au lieu de '_id'
        console.log('🏫 IDs des écoles:', ecolesIds.slice(0, 5)); // Afficher les 5 premiers IDs
        
        setEcoles(ecolesIds);
      } catch (error) {
        console.error('Erreur lors de la récupération des données:', error);
        // Valeurs par défaut en cas d'erreur
        setReportagesArticles([]);
        setNewsArticles([]);
        setEcoles([]);
      }
    };

    fetchData();
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
        <Carroussel
          titre="Reportages d'animation"
          type='Articles'
          taille='large'
          list={reportagesArticles}
        />
      )}
      
      {searchFilter.ecole && (
        <Carroussel
        titre="Écoles d'animation"
        type='Schools'
        taille='small'
        list={ecoles}
        />
      )}
        
      {searchFilter.article && (
        <Carroussel
          titre="Actualités"
          type='Articles'
          taille='medium'
          list={newsArticles}
        />
      )}

      <Footer />
    </div>
  )
}