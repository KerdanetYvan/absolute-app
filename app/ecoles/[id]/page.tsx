import { notFound } from "next/navigation";
import schools from "@/data/schools.json";
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
  const ecole: Ecole | undefined = (schools as Ecole[]).find(e => e.id === id);
  if (!ecole) return notFound();

  return (
    <div style={{ background: '#fff', minHeight: '100dvh', padding: 0, fontFamily: 'inherit', position: 'relative' }}>
      {/* Bouton retour */}
      <a href="/ecoles-map" style={{
        position: 'absolute',
        top: 18,
        left: 18,
        zIndex: 10,
        width: 44,
        height: 44,
        borderRadius: '50%',
        background: '#FFB13B',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 8px #ffb13b33',
        textDecoration: 'none',
        transition: 'background 0.2s',
      }} aria-label="Retour à la carte">
        <img src="/img/icon/arrow-left.svg" alt="Retour" style={{ width: 26, height: 26, display: 'block' }} />
      </a>
      {/* Image principale en haut */}
      {ecole.img_ecoles && (
        <div style={{ maxWidth: 420, margin: '0 auto', padding: '24px 24px 0 24px' }}>
          <img src={ecole.img_ecoles} alt={ecole.nom} style={{ width: '100%', borderRadius: 20, objectFit: 'cover', marginBottom: 24 }} />
        </div>
      )}
      {/* Titre et résumé */}
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ fontWeight: 700, fontSize: 22, textTransform: 'uppercase', letterSpacing: 1, color: '#181B2A', marginBottom: 8 }}>{ecole.nom}</div>
        <div style={{ fontSize: 14, color: '#444', marginBottom: 16 }}>{ecole.resume}</div>
        
      </div>
      {/* Bloc Infos */}
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 24px' }}>
        <div style={{ fontWeight: 700, fontSize: 16, margin: '18px 0 8px 0', color: '#181B2A' }}>Infos</div>
        <div style={{ fontSize: 14, color: '#444', marginBottom: 0, lineHeight: 1.5 }}>{ecole.description_detaillee || ecole.description}</div>
        <div style={{ fontSize: 14, color: '#444', lineHeight: 1.5, marginBottom: 8 }}>{ecole.description}</div>
      </div>
      {/* Section logos populaires */}
      <div style={{ maxWidth: 420, margin: '0 auto', padding: '0 24px 24px 24px' }}>
        <div style={{ fontWeight: 700, fontSize: 16, margin: '18px 0 10px 0', color: '#181B2A' }}>
          Populaire sur {ecole.nom.split(' ')[0]}
        </div>
        <div style={{ display: 'flex', gap: 16, overflowX: 'auto', paddingBottom: 8 }}>
          {(schools as Ecole[]).map(e => (
            e.logo ? (
              <img key={e.id} src={e.logo} alt={e.nom} style={{ width: 54, height: 54, objectFit: 'contain', borderRadius: 10, background: '#f5f5f5', boxShadow: '0 2px 8px #0001' }} />
            ) : null
          ))}
        </div>
      </div>
    </div>
  );
}
