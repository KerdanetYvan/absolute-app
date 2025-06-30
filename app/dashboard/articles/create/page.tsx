'use client';
import GoBack from '@/components/GoBack';
import NewArticle from '../../../../components/NewArticle'

export default function CreateArticlePage() {
  return (
    <div className="py-8 w-full dark:bg-[#454141]">
      <GoBack />
      <NewArticle onSuccess={() => {}} onError={() => {}} />
    </div>
  );
}