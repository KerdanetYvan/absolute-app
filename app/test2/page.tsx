import React from 'react'
import { GrSearch } from 'react-icons/gr'

import Footer from '@/components/Footer'

export default function page() {
  return (
    <div className='min-h-screen py-8 w-full flex flex-col items-center bg-white dark:bg-gray-800'>
      <h1 className='text-2xl font-bold text-black dark:text-white pb-[31px]'>ANOMI</h1>
      <div className=''>
        <div className='h-12 bg-orange-400 dark:bg-cyan-600 flex items-center justify-center gap-2 w-full max-w-md rounded-full px-4'>
          <GrSearch className='text-white flex-shrink-0' />
          <input
            type="text"
            placeholder="Rechercher..."
            className="bg-transparent text-white placeholder-white/70 flex-1 px-2 py-2 focus:outline-none focus:ring-2 focus:ring-white/30 rounded"
          />
        </div>
      </div>
      <Footer />
    </div>
  )
}