// Utilitaires pour la gestion des tokens et cookies
import axios from 'axios';

// Configuration d'Axios pour inclure automatiquement le token dans les headers
export const setupAxiosInterceptors = (token: string | null) => {
  if (token) {
    // Ajouter le token dans les headers par défaut
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    console.log('🔑 Token ajouté aux headers Axios');
  } else {
    // Supprimer le token des headers
    delete axios.defaults.headers.common['Authorization'];
    console.log('🔑 Token supprimé des headers Axios');
  }
};

// Fonction pour vérifier si un token JWT est expiré
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  
  try {
    // Décoder le payload du JWT (sans vérification de signature côté client)
    const payload = JSON.parse(atob(token.split('.')[1]));
    const currentTime = Date.now() / 1000;
    
    return payload.exp < currentTime;
  } catch (error) {
    console.error('❌ Erreur lors de la vérification du token:', error);
    return true;
  }
};

// Fonction pour obtenir les données utilisateur depuis le token
export const getUserFromToken = (token: string | null): any => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return {
      id: payload.id,
      email: payload.email,
      username: payload.username
    };
  } catch (error) {
    console.error('❌ Erreur lors de l\'extraction des données utilisateur:', error);
    return null;
  }
};

// Fonction pour nettoyer l'authentification (localStorage + cookies côté client)
export const clearAuthData = () => {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('auth');
    localStorage.removeItem('token');
    
    // Supprimer le cookie côté client (note: les cookies httpOnly ne peuvent pas être supprimés côté client)
    document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
    
    setupAxiosInterceptors(null);
    console.log('🧹 Données d\'authentification nettoyées');
  }
};

// Fonction pour sauvegarder les données d'authentification
export const saveAuthData = (user: any, token: string) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('auth', JSON.stringify(user));
    localStorage.setItem('token', token);
    setupAxiosInterceptors(token);
    console.log('💾 Données d\'authentification sauvegardées');
  }
};

// Fonction pour restaurer les données d'authentification au démarrage
export const restoreAuthData = (): { user: any; token: string | null } => {
  if (typeof window === 'undefined') {
    return { user: null, token: null };
  }
  
  const storedAuth = localStorage.getItem('auth');
  const storedToken = localStorage.getItem('token');
  
  if (!storedAuth || !storedToken) {
    return { user: null, token: null };
  }
  
  // Vérifier si le token est expiré
  if (isTokenExpired(storedToken)) {
    console.log('⏰ Token expiré, nettoyage des données');
    clearAuthData();
    return { user: null, token: null };
  }
  
  setupAxiosInterceptors(storedToken);
  console.log('🔄 Données d\'authentification restaurées');
  
  return {
    user: JSON.parse(storedAuth),
    token: storedToken
  };
};
