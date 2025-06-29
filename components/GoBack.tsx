"use client";

import React from 'react';
import { useRouter } from 'next/navigation';

import { GrFormPreviousLink } from "react-icons/gr";


export default function GoBack() {
  const router = useRouter();

  const handleGoBack = () => {
    // Essayer d'abord router.back(), puis en fallback rediriger vers la page d'accueil
    try {
      // On utilise directement router.back() qui gère automatiquement les cas où il n'y a pas d'historique
      router.back();
    } catch (error) {
      // En cas d'erreur, rediriger vers la page d'accueil
      router.push('/');
    }
  };

  return (
    <button
      onClick={handleGoBack}
      className='fixed top-[15px] left-[25px] rounded-full bg-[#FCB259] dark:bg-[#3CBDD1] flex items-center justify-center text-white hover:bg-[#f9c66b] dark:hover:bg-[#4cd6d8] transition-colors duration-300'
      type="button"
      title="Revenir à la page précédente"
    >
      <GrFormPreviousLink className='w-[37px] h-[37px]' />
    </button>
  );
}
