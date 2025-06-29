'use client';
import GoBack from '@/components/GoBack';
import NewArticle from '../../../../components/NewArticle'

export default function CreateArticlePage() {
  return (
    <div className="py-8 max-w-5xl mx-auto">
      <GoBack className="ml-4 mb-6" />
      <NewArticle onSuccess={() => {}} onError={() => {}} />
    </div>
  );
}