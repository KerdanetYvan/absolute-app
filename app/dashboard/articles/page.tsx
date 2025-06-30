'use client';

import { useEffect, useState } from 'react';
import { NavBarDashboard } from '../../../components/NavBarDashboard';
import { useRouter } from 'next/navigation';

async function fetchArticles() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/articles`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Erreur lors du chargement des articles');
  return res.json();
}

async function fetchUsers() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/users`, {
    cache: 'no-store',
  });
  if (!res.ok) throw new Error('Erreur lors du chargement des utilisateurs');
  return res.json();
}

async function deleteArticle(articleId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/articles/${articleId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return res.json();
}

async function createArticle(article: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/articles`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article),
  });
  if (!res.ok) throw new Error('Erreur lors de la création');
  return res.json();
}

async function patchArticle(articleId: string, article: any) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/articles/${articleId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(article),
  });
  if (!res.ok) throw new Error('Erreur lors de la modification');
  return res.json();
}

export default function DashboardArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Pour la modale d'ajout
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: '',
    content: '',
    category: '',
    coverImageUrl: '',
    videoUrl: '',
    author: '',
  });
  const [submitting, setSubmitting] = useState(false);

  // Pour la modale d'édition
  const [showEditModal, setShowEditModal] = useState(false);
  const [editForm, setEditForm] = useState({
    _id: '',
    title: '',
    content: '',
    category: '',
    coverImageUrl: '',
    videoUrl: '',
    author: '',
  });
  const [editing, setEditing] = useState(false);

  // Liste des utilisateurs pour le select auteur
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    fetchArticles()
      .then(data => setArticles(Array.isArray(data) ? data : data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));

    fetchUsers()
      .then(data => setUsers(Array.isArray(data) ? data : data.users || []))
      .catch(() => setUsers([]));
  }, []);

  const handleDeleteArticle = async (articleId: string) => {
    if (!window.confirm("Supprimer cet article ?")) return;
    try {
      await deleteArticle(articleId);
      setArticles(articles => articles.filter(a => a._id !== articleId));
    } catch (e) {
      alert("Erreur lors de la suppression de l'article.");
    }
  };

  // Gestion modale ajout
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => {
    setShowModal(false);
    setForm({ title: '', content: '', category: '', coverImageUrl: '', videoUrl: '', author: '' });
  };

  // Gestion modale édition
  const handleOpenEditModal = (article: any) => {
    setEditForm({
      _id: article._id,
      title: article.title || '',
      content: article.content || '',
      category: article.category || '',
      coverImageUrl: article.coverImageUrl || '',
      videoUrl: article.videoUrl || '',
      author: typeof article.author === 'object' && article.author !== null ? article.author._id : (article.author || ''),
    });
    setShowEditModal(true);
  };
  const handleCloseEditModal = () => {
    setShowEditModal(false);
    setEditForm({ _id: '', title: '', content: '', category: '', coverImageUrl: '', videoUrl: '', author: '' });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const newArticle = await createArticle(form);
      setArticles(articles => [newArticle, ...articles]);
      handleCloseModal();
    } catch {
      alert("Erreur lors de la création de l'article.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setEditing(true);
    try {
      const updated = await patchArticle(editForm._id, {
        title: editForm.title,
        content: editForm.content,
        category: editForm.category,
        coverImageUrl: editForm.coverImageUrl,
        videoUrl: editForm.videoUrl,
        author: editForm.author,
      });
      setArticles(articles =>
        articles.map(a => (a._id === updated._id ? updated : a))
      );
      handleCloseEditModal();
    } catch {
      alert("Erreur lors de la modification de l'article.");
    } finally {
      setEditing(false);
    }
  };

  return (
    <div className="pl-[220px] flex min-h-screen bg-white dark:bg-[#454141]">
      <NavBarDashboard />
      <main className="flex-1 p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800 dark:text-gray-200">Gestion des articles</h1>
        <button
          onClick={() => router.push('/dashboard/articles/create')}
          className="mb-6 px-6 py-3 rounded-lg font-semibold text-base shadow transition text-black dark:text-white bg-[#FFB151] dark:bg-[#3CBDD1] flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-[#FFB151]/60 dark:focus:ring-[#3CBDD1]/60 hover:scale-105 hover:shadow-lg"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter un article
        </button>

        {/* Modal Edition */}
        {showEditModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
            <div className="bg-white dark:bg-[#454141] border-2 border-orange-800 dark:border-gray-800 rounded-xl shadow-xl p-8 w-full max-w-md">
              <h2 className="text-xl font-bold mb-6 text-gray-800 dark:text-gray-200">Modifier l'article</h2>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Titre</label>
                  <input
                    name="title"
                    value={editForm.title}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3 py-2 dark:text-[#c9e9ee] border border-gray-200 dark:border-[#3CBDD1] rounded "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Contenu</label>
                  <textarea
                    name="content"
                    value={editForm.content}
                    onChange={handleEditChange}
                    required
                    rows={4}
                    className="w-full px-3 py-2 dark:text-[#c9e9ee] border border-gray-200 dark:border-[#3CBDD1] rounded "
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Catégorie</label>
                  <input
                    name="category"
                    value={editForm.category}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 dark:text-[#c9e9ee] border border-gray-200 dark:border-[#3CBDD1] rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Auteur</label>
                  <select
                    name="author"
                    value={editForm.author}
                    onChange={handleEditChange}
                    required
                    className="w-full px-3 py-2 dark:text-[#c9e9ee] border border-gray-200 dark:border-[#3CBDD1] rounded"
                  >
                    <option value="">Sélectionner un auteur</option>
                    {users.map((user) => (
                      <option key={user._id} value={user._id}>
                        {user.username || user.name || user.email}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image de couverture (URL)</label>
                  <input
                    name="coverImageUrl"
                    value={editForm.coverImageUrl}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 dark:text-[#c9e9ee] border border-gray-200 dark:border-[#3CBDD1] rounded"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Vidéo (URL)</label>
                  <input
                    name="videoUrl"
                    value={editForm.videoUrl}
                    onChange={handleEditChange}
                    className="w-full px-3 py-2 dark:text-[#c9e9ee] border border-gray-200 dark:border-[#3CBDD1] rounded"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={handleCloseEditModal} className="px-4 py-2 rounded border border-gray-200 text-gray-700 dark:text-gray-300 dark:hover:text-gray-700 hover:bg-gray-50">
                    Annuler
                  </button>
                  <button type="submit" disabled={editing} className="px-5 py-2 rounded bg-[#3CBDD1] text-white font-semibold hover:bg-[#4f838b] transition">
                    {editing ? 'Modification...' : 'Modifier'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Nouveau style de tableau (Flowbite/Tailwind) */}
        <div className="relative overflow-x-auto shadow-md sm:rounded-lg border border-gray-200 mt-6">
          <table className="w-full text-sm text-left rtl:text-right text-gray-800 dark:text-gray-200">
            <thead className="text-xs text-gray-800 dark:text-gray-200 uppercase bg-[#FFB151] dark:bg-[#3CBDD1]">
              <tr>
                <th className="px-6 py-3" style={{ fontSize: '17px' }}>Titre de l'article</th>
                <th className="px-6 py-3 text-center" style={{ fontSize: '17px' }}>Image de couverture</th>
                <th className="px-6 py-3 text-center" style={{ fontSize: '17px' }}>Vues</th>
                <th className="px-6 py-3 text-center" style={{ fontSize: '17px' }}>Likes</th>
                <th className="px-6 py-3 text-center" style={{ fontSize: '17px' }}>Catégorie</th>
                <th className="px-6 py-3 text-center" style={{ fontSize: '17px' }}>Auteur</th>
                <th className="px-6 py-3 text-center" style={{ fontSize: '17px' }}>Vidéo</th>
                <th className="px-6 py-3 text-center" style={{ fontSize: '17px' }}><span className="sr-only">Actions</span></th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500 bg-white">Chargement...</td>
                </tr>
              ) : articles.length > 0 ? (
                articles.map((article: any) => (
                  <tr key={article._id} className="bg-white dark:bg-[#454141] border-b dark:bg-gray-800 dark:border-gray-200 border-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition">
                    <th scope="row" className="px-6 py-4 font-medium text-black whitespace-nowrap dark:text-white">{article.title}</th>
                    <td className="px-6 py-4 text-center">
                      {article.coverImageUrl ? (
                        <img src={article.coverImageUrl} alt="Couverture" className="w-16 h-10 object-cover rounded mx-auto" />
                      ) : (
                        <span className="text-gray-400">Aucune</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">{article.views ?? 0}</td>
                    <td className="px-6 py-4 text-center">{article.likes ?? 0}</td>
                    <td className="px-6 py-4 text-center">{article.category ?? '-'}</td>
                    <td className="px-6 py-4 text-center">
                      {typeof article.author === 'object' && article.author !== null
                        ? (article.author.username || article.author.name || article.author.email || article.author._id)
                        : (article.author ?? '-')}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {article.videoUrl ? (
                        <a href={article.videoUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-500 hover:underline">Voir</a>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleOpenEditModal(article)}
                        className="font-medium text-blue-600 dark:text-blue-500 hover:underline mr-2"
                        aria-label="Modifier l'article"
                        title="Modifier l'article"
                      >
                        Modifier
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article._id)}
                        className="font-medium text-red-600 dark:text-red-500 hover:underline"
                        aria-label="Supprimer l'article"
                        title="Supprimer l'article"
                      >
                        Supprimer
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-500 dark:text-gray-300 bg-white dark:bg-[#454141]">
                    Aucun article trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}