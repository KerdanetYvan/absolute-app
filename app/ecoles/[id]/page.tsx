"use client";

import { notFound } from "next/navigation";
import { schoolsData } from "@/lib/schools-data";
import GoBack from "@/components/GoBack";
import Footer from "@/components/Footer";
import Image from "next/image";
import { use } from "react";

interface Ecole {
  id: string;
  nom: string;
  adresse: string;
  site: string;
  filieres: string[];
  logo?: string;
  img_ecoles?: string;
  resume?: string;
  description?: string;
  description_detaillee?: string;
  lat?: number;
  lon?: number;
}

export default function EcoleDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const ecole: Ecole | undefined = schoolsData.find(e => e.id === id);
  if (!ecole) return notFound();

  return (
    <div className="bg-[#fff] text-[#181B2A] dark:bg-[#454141] dark:text-white ecole-detail-container" style={{ minHeight: '100vh', fontFamily: 'inherit', width: '100vw', boxSizing: 'border-box', position: 'relative' }}>
      {/* GoBack bouton fixe */}
      <GoBack />
      {/* Image principale en haut */}
      {ecole.img_ecoles && (
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '24px 24px 0 24px' }}>
          <img src={ecole.img_ecoles} alt={ecole.nom} style={{ width: '100%', borderRadius: 20, objectFit: 'cover', marginBottom: 24 }} />
        </div>
      )}
      {/* Titre et résumé */}
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 24px' }}>
        <div className="font-bold text-[22px] uppercase tracking-wider mb-2 text-[#181B2A] dark:text-white">{ecole.nom}</div>
        <div className="text-[14px] mb-4 text-[#444] dark:text-white">{ecole.resume}</div>
      </div>
      {/* Bloc Infos */}
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 24px' }}>
        <div className="font-bold text-[16px] mt-5 mb-2 text-[#181B2A] dark:text-white">Infos</div>
        <div className="text-[14px] mb-0 leading-snug text-[#444] dark:text-white">{ecole.description_detaillee || ecole.description}</div>
        <div className="text-[14px] leading-snug mb-2 text-[#444] dark:text-white">{ecole.description}</div>
      </div>
      {/* Section logos populaires */}
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 24px 24px 24px', paddingBottom: 120 }}>
        <div className="font-bold text-[16px] mt-5 mb-2 text-[#181B2A] dark:text-white">
          Populaire sur {ecole.nom.split(' ')[0]}
        </div>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
          {schoolsData.map(e => (
            e.logo ? (
              <img key={e.id} src={e.logo} alt={e.nom} style={{ width: 54, height: 54, objectFit: 'contain', borderRadius: 10, background: '#f5f5f5', boxShadow: '0 2px 8px #0001' }} className="dark:bg-gray-800" />
            ) : null
          ))}
        </div>
      </div>
      <Footer />
      <style jsx global>{`
        @media (min-width: 1024px) {
          .ecole-detail-container {
            max-width: 100vw !important;
            width: 100vw !important;
            min-height: 100vh !important;
            border-radius: 0 !important;
            margin: 0 !important;
            left: 0 !important;
            top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
