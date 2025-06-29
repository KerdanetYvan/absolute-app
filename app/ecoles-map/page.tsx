"use client";
import { useEffect, useState, useRef } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

// Configuration des icônes Leaflet pour Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

const MapContainer = dynamic(() => import("react-leaflet").then(mod => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import("react-leaflet").then(mod => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import("react-leaflet").then(mod => mod.Marker), { ssr: false });
const Popup = dynamic(() => import("react-leaflet").then(mod => mod.Popup), { ssr: false });

const googleIcon = new L.Icon({
    iconUrl: "/img/icon/location.svg", // chemin mis à jour
    iconSize: [40, 48],            // taille adaptée pour un SVG moderne
    iconAnchor: [20, 48],          // ancre en bas du pin
    popupAnchor: [0, -48],
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
    shadowSize: [41, 41],
    shadowAnchor: [13, 41],
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
        <div style={{ height: "100dvh", width: "100vw", position: 'relative', background: '#181B2A', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
            <div style={{ flex: 1, minHeight: 0 }}>
                <MapContainer center={[48.8566, 2.3522]} zoom={12} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {ecoles.map((ecole) => (
                        <Marker key={ecole.id} position={[ecole.lat, ecole.lon]} icon={googleIcon} eventHandlers={{ click: () => handleSelect(ecole) }} />
                    ))}
                </MapContainer>
            </div>
            {/* Bandeau info animé */}
            <div
                ref={infoRef}
                style={{
                    background: 'white',
                    borderTopLeftRadius: 24,
                    borderTopRightRadius: 24,
                    boxShadow: '0 -2px 16px #0002',
                    minHeight: isOpen ? 160 : 48,
                    padding: isOpen ? 20 : 0,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: isOpen ? 16 : 0,
                    zIndex: 1000,
                    width: '100%',
                    maxWidth: 420,
                    margin: '0 auto',
                    marginTop: -24,
                    position: 'relative',
                    bottom: 0,
                    transition: 'min-height 0.35s cubic-bezier(.4,1.4,.6,1), padding 0.35s cubic-bezier(.4,1.4,.6,1)',
                    overflow: 'hidden',
                }}
            >
                {!isOpen ? (
                    <div style={{ width: '100%', textAlign: 'center', color: '#888', fontSize: 13, padding: 10, cursor: 'pointer', userSelect: 'none' }} onClick={() => setIsOpen(true)}>
                        Choisissez une école
                    </div>
                ) : selected ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 16 }}>
                            {selected.logo && <img src={selected.logo} alt={selected.nom} style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 12, background: '#f5f5f5', boxShadow: '0 2px 8px #0001', marginBottom: 0 }} />}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 17, textTransform: 'uppercase', letterSpacing: 1 }}>{selected.nom}</div>
                                <div style={{ fontSize: 13.5, color: '#444', marginTop: 4 }}>{selected.resume}</div>
                            </div>
                        </div>
                        {/* Affiche uniquement le résumé, pas la description détaillée */}
                        
                        <a href={`/ecoles/${selected.id}`} style={{
                            display: 'block',
                            width: '100%',
                            background: '#FFB13B',
                            color: '#181B2A',
                            fontWeight: 700,
                            textDecoration: 'none',
                            fontSize: 16,
                            borderRadius: 10,
                            padding: '12px 0',
                            textAlign: 'center',
                            marginTop: 16,
                            boxShadow: '0 2px 8px #ffb13b22',
                            textTransform: 'lowercase',
                            letterSpacing: 0.5
                        }}>En savoir plus</a>
                        <button onClick={handleClose} style={{
                            position: 'absolute',
                            top: 10,
                            right: 16,
                            background: 'none',
                            border: 'none',
                            fontSize: 22,
                            color: '#888',
                            cursor: 'pointer',
                            fontWeight: 700
                        }} aria-label="Fermer">×</button>
                    </>
                ) : null}
            </div>
        </div>
    );
}
