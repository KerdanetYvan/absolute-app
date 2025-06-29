import React from 'react';
import { GrHomeRounded, GrSearch, GrUser } from 'react-icons/gr';
import Link from 'next/link';

export default function Footer() {
  return (
    <footer className='w-full fixed bottom-0 left-0 h-[92px] overflow-hidden snap-none z-10 flex items-end justify-center'>
      <div className='dark:hidden flex items-end justify-center '>
        <svg width="244" height="74" viewBox="0 0 244 74" fill="none" xmlns="http://www.w3.org/2000/svg" className='z-0'>
          <path fillRule="evenodd" clipRule="evenodd" d="M243.94 77C222.244 31.4673 175.797 0 122 0C68.2028 0 21.7553 31.4673 0.0593262 77L243.94 77Z" fill="#FCB259"/>
        </svg>
      </div>

      <div className='hidden dark:inline flex items-end justify-center '>
        <svg width="244" height="70" viewBox="0 0 244 70" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path fillRule="evenodd" clipRule="evenodd" d="M243.94 77C222.244 31.4673 175.797 0 122 0C68.2028 0 21.7553 31.4673 0.0593262 77L243.94 77Z" fill="#3CBDD1"/>
        </svg>
      </div>


      <div className='absolute top-0 left-0 flex items-center justify-around w-full bg-[#FCB259]/20 dark:bg-[#3CBDD1]/20 backdrop-blur-sm h-[92px] rounded-t-[35px] px-[60px] pb-[10px]'>
          <Link href='/'><GrHomeRounded className='w-[20px] h-[20px]' /></Link>
          <GrSearch className='w-[20px] h-[20px]' />
          <Link href='/profile'><GrUser className='w-[20px] h-[20px]' /></Link>
      </div>
    </footer>
  )
}
