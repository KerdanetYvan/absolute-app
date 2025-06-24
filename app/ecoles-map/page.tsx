"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import iconShadow from "leaflet/dist/images/marker-shadow.png";

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
                        <Marker key={ecole.id} position={[ecole.lat, ecole.lon]} icon={googleIcon} eventHandlers={{ click: () => setSelected(ecole) }} />
                    ))}
                </MapContainer>
            </div>
            {/* Carte info mobile style */}
            <div style={{
                background: 'white',
                borderTopLeftRadius: 24,
                borderTopRightRadius: 24,
                boxShadow: '0 -2px 16px #0002',
                minHeight: 160,
                padding: 20,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: 16,
                zIndex: 1000,
                width: '100%',
                maxWidth: 420,
                margin: '0 auto',
                marginTop: -24,
                position: 'relative',
                bottom: 0
            }}>
                {selected ? (
                    <>
                        <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 16 }}>
                            {selected.logo && <img src={selected.logo} alt={selected.nom} style={{ width: 56, height: 56, objectFit: 'contain', borderRadius: 12, background: '#f5f5f5', boxShadow: '0 2px 8px #0001', marginBottom: 0 }} />}
                            <div style={{ flex: 1 }}>
                                <div style={{ fontWeight: 700, fontSize: 17, textTransform: 'uppercase', letterSpacing: 1 }}>{selected.nom}</div>
                                <div style={{ fontSize: 13.5, color: '#444', marginTop: 4 }}>{selected.resume}</div>
                            </div>
                        </div>
                        <div style={{ fontSize: 13.5, color: '#444', margin: '10px 0 0 0', textAlign: 'center', lineHeight: 1.4 }}>{selected.description_detaillee || selected.description || selected.adresse}</div>
                        <a href={selected.site} target="_blank" rel="noopener noreferrer" style={{
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
                    </>
                ) : (
                    <div style={{ width: '100%', textAlign: 'center', color: '#888', fontSize: 16, padding: 12 }}>
                        Sélectionnez une école sur la carte
                    </div>
                )}
            </div>
        </div>
    );
}
