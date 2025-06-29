"use client";

import React from 'react';
import GoBack from '@/components/GoBack';

export default function TestPage() {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-8">
      {/* Le bouton GoBack sera en position fixe en haut à gauche */}
      <GoBack />
      
      <div className="max-w-4xl mx-auto pt-16">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
          Page de Test du Bouton GoBack
        </h1>
        
        <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">
            Instructions de test
          </h2>
          <ul className="list-disc list-inside text-gray-700 dark:text-gray-300 space-y-2">
            <li>Le bouton de retour est en position fixe en haut à gauche</li>
            <li>Cliquez dessus pour revenir à la page précédente</li>
            <li>Ouvrez la console du navigateur (F12) pour voir les logs de débogage</li>
            <li>Si vous êtes arrivé directement sur cette page, le bouton vous redirigera vers l'accueil</li>
          </ul>
          
          <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded">
            <p className="text-blue-800 dark:text-blue-200">
              <strong>Test :</strong> Naviguez vers cette page depuis une autre page, puis cliquez sur le bouton de retour pour voir s'il fonctionne.
            </p>
          </div>
        </div>
        
        <div className="mt-8 bg-yellow-50 dark:bg-yellow-900/20 p-6 rounded-lg border border-yellow-200 dark:border-yellow-700">
          <h3 className="text-lg font-semibold text-yellow-800 dark:text-yellow-200 mb-2">
            🔍 Débogage
          </h3>
          <p className="text-yellow-700 dark:text-yellow-300">
            Si le bouton ne fonctionne pas :
          </p>
          <ol className="list-decimal list-inside text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
            <li>Vérifiez la console du navigateur pour les messages d'erreur</li>
            <li>Assurez-vous que Next.js est en cours d'exécution</li>
            <li>Vérifiez que le composant GoBack est bien importé</li>
            <li>Testez en naviguant depuis la page d'accueil vers cette page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
