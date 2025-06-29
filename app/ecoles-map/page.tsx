"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
import GoBack from "@/components/GoBack";
import Footer from "@/components/Footer";

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

const googleIcon = new L.Icon({
    iconUrl: "/img/icon/location.svg", // chemin mis à jour
    iconSize: [40, 48],            // taille adaptée pour un SVG moderne
    iconAnchor: [20, 48],          // ancre en bas du pin
    popupAnchor: [0, -48],
    shadowUrl: iconShadow,
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
    // Couleur personnalisée pour le point de location
    className: 'custom-marker',
});

interface Ecole {
    id: string;
    nom: string;
    adresse: string;
    site: string;
    filieres: string[];
    logo?: string;
    resume?: string;
    description?: string;
    description_detaillee?: string;
}

interface EcoleWithCoords extends Ecole {
    lat: number;
    lon: number;
}

export default function EcolesMapPage() {
    const [ecoles, setEcoles] = useState<EcoleWithCoords[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selected, setSelected] = useState<EcoleWithCoords | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    const infoRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        async function fetchEcoles() {
            try {
                const res = await fetch("/api/schools");
                if (!res.ok) throw new Error("Erreur lors de la récupération des écoles");
                const data: EcoleWithCoords[] = await res.json();
                setEcoles(data);
            } catch (e: any) {
                setError(e.message || "Erreur inconnue");
            } finally {
                setLoading(false);
            }
        }
        fetchEcoles();
    }, []);

    // Animation : ouvre le bandeau quand une école est sélectionnée
    function handleSelect(ecole: EcoleWithCoords) {
        setSelected(ecole);
        setIsOpen(true);
    }
    // Ferme le bandeau
    function handleClose() {
        setSelected(null);
        setIsOpen(false);
    }

    if (loading) return <div>Chargement de la carte...</div>;
    if (error) return <div style={{ color: 'red' }}>Erreur : {error}</div>;

    return (
        <div style={{
            minHeight: "100vh",
            width: "100vw",
            position: 'relative',
            background: '#181B2A',
            display: 'flex',
            flexDirection: 'column',
        }}>
            {/* GoBack bouton fixe, hors du conteneur overflow hidden */}
            <div style={{ position: 'fixed', top: 18, left: 18, zIndex: 2000 }}>
                <GoBack />
            </div>
            <div style={{ flex: 1, minHeight: 0, width: '100vw', maxWidth: '100vw', display: 'flex', flexDirection: 'column', overflow: 'hidden', zIndex: 0 }}>
                {/* @ts-ignore */}
                <MapContainer center={[48.8566, 2.3522]} zoom={12} style={{ flex: 1, width: "100%" }} zoomControl={false}>
                    {/* @ts-ignore */}
                    <TileLayer
                        url={'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'}
                        // @ts-ignore
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                    {ecoles.map((ecole) => (
                        // @ts-ignore
                        <Marker key={ecole.id} position={[ecole.lat, ecole.lon]} icon={googleIcon} eventHandlers={{ click: () => handleSelect(ecole) }} />
                    ))}
                </MapContainer>
                {/* Bandeau info animé */}
                <div
                    ref={infoRef}
                    style={{
                        background: undefined, // géré par les classes
                        color: undefined, // géré par les classes
                        borderTopLeftRadius: 24,
                        borderTopRightRadius: 24,
                        boxShadow: '0 -2px 16px #0002',
                        minHeight: isOpen ? 160 : 48,
                        padding: isOpen ? 'clamp(12px,4vw,28px)' : 0,
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        gap: isOpen ? 16 : 0,
                        zIndex: 2100,
                        width: '100%',
                        maxWidth: 'clamp(98vw, 420px, 100vw)',
                        margin: '0 auto',
                        position: 'fixed',
                        left: 0,
                        bottom: 80,
                        transition: 'min-height 0.35s cubic-bezier(.4,1.4,.6,1), padding 0.35s cubic-bezier(.4,1.4,.6,1)',
                        overflow: 'hidden',
                        paddingBottom: 12,
                    }}
                    className="bg-white text-[#181B2A] dark:bg-[#454141] dark:text-white"
                >
                    {!isOpen ? (
                        <div style={{ width: '100%', textAlign: 'center', color: '#888', fontSize: 13, padding: 10, cursor: 'pointer', userSelect: 'none' }} className="dark:text-white" onClick={() => setIsOpen(true)}>
                            Choisissez une école
                        </div>
                    ) : selected ? (
                        <>
                            <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 16, flexWrap: 'wrap' }}>
                                {selected.logo && <img src={selected.logo} alt={selected.nom} style={{ width: 'clamp(40px,12vw,56px)', height: 'clamp(40px,12vw,56px)', objectFit: 'contain', borderRadius: 12, background: '#f5f5f5', boxShadow: '0 2px 8px #0001', marginBottom: 0 }} />}
                                <div style={{ flex: 1, minWidth: 0 }}>
                                    <div style={{ fontWeight: 700, fontSize: 'clamp(15px,4vw,17px)', textTransform: 'uppercase', letterSpacing: 1, wordBreak: 'break-word' }} className="dark:text-white">{selected.nom}</div>
                                    <div className="resume-text" style={{ fontSize: 'clamp(12px,3vw,13.5px)', marginTop: 4 }}>{selected.resume}</div>
                                </div>
                            </div>
                            {/* Affiche uniquement le résumé, pas la description détaillée */}
                            <a href={`/ecoles/${selected.id}`}
                               style={{
                                   display: 'block',
                                   width: '100%',
                                   fontWeight: 700,
                                   textDecoration: 'none',
                                   fontSize: 'clamp(14px,4vw,16px)',
                                   borderRadius: 10,
                                   padding: 'clamp(8px,3vw,12px) 0',
                                   textAlign: 'center',
                                   marginTop: 16,
                                   boxShadow: '0 2px 8px #ffb13b22',
                                   textTransform: 'lowercase',
                                   letterSpacing: 0.5,
                                   background: '#FFB151',
                                   color: '#181B2A',
                               }}
                               className="dark:bg-[#3CBDD1] dark:text-white"
                            >en savoir plus</a>
                            <button onClick={handleClose} style={{
                                position: 'absolute',
                                top: 10,
                                right: 16,
                                background: 'none',
                                border: 'none',
                                fontSize: 22,
                                color: '#fff',
                                cursor: 'pointer',
                                fontWeight: 700
                            }} className="dark:text-white text-[#888]" aria-label="Fermer">×</button>
                        </>
                    ) : null}
                </div>
            </div>
            {/* Footer fixé devant la carte */}
            <div style={{ position: 'fixed', left: 0, bottom: 0, width: '100vw', zIndex: 2000 }}>
                <Footer />
            </div>
            <style jsx global>{`
                .resume-text { color: #444; }
                @media (prefers-color-scheme: dark) {
                  .resume-text { color: #fff !important; }
                }
                @media (max-width: 600px) {
                    .leaflet-control-attribution {
                        font-size: 10px !important;
                    }
                }
            `}</style>
        </div>
    );
}
