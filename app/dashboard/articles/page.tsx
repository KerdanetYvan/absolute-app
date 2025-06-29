'use client';

import { useEffect, useState } from 'react';
import { NavBarDashboard } from '../../../components/NavBarDashboard';

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
    <div style={{ display: 'flex' }}>
      <NavBarDashboard />
      <main style={{ flex: 1, padding: '2rem' }}>
        <h1>Liste des articles</h1>
        <button
          onClick={handleOpenModal}
          style={{
            marginBottom: '1rem',
            padding: '8px 16px',
            background: '#1976d2',
            color: '#fff',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          + Ajouter un article
        </button>

        {/* Modal Ajout */}
        {showModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div style={{
              background: '#fff', padding: 32, borderRadius: 8, minWidth: 350, maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.2)'
            }}>
              <h2>Nouvel article</h2>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <label>Titre<br />
                    <input
                      name="title"
                      value={form.title}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Contenu<br />
                    <textarea
                      name="content"
                      value={form.content}
                      onChange={handleChange}
                      required
                      rows={4}
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Catégorie<br />
                    <input
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Auteur<br />
                    <select
                      name="author"
                      value={form.author}
                      onChange={handleChange}
                      required
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    >
                      <option value="">Sélectionner un auteur</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.username || user.name || user.email}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Image de couverture (URL)<br />
                    <input
                      name="coverImageUrl"
                      value={form.coverImageUrl}
                      onChange={handleChange}
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Vidéo (URL)<br />
                    <input
                      name="videoUrl"
                      value={form.videoUrl}
                      onChange={handleChange}
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                  </label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button type="button" onClick={handleCloseModal} style={{ padding: '8px 12px' }}>
                    Annuler
                  </button>
                  <button type="submit" disabled={submitting} style={{
                    background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 600
                  }}>
                    {submitting ? 'Ajout...' : 'Ajouter'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Modal Edition */}
        {showEditModal && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
            background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
          }}>
            <div style={{
              background: '#fff', padding: 32, borderRadius: 8, minWidth: 350, maxWidth: 400, boxShadow: '0 2px 16px rgba(0,0,0,0.2)'
            }}>
              <h2>Modifier l'article</h2>
              <form onSubmit={handleEditSubmit}>
                <div style={{ marginBottom: 12 }}>
                  <label>Titre<br />
                    <input
                      name="title"
                      value={editForm.title}
                      onChange={handleEditChange}
                      required
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Contenu<br />
                    <textarea
                      name="content"
                      value={editForm.content}
                      onChange={handleEditChange}
                      required
                      rows={4}
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Catégorie<br />
                    <input
                      name="category"
                      value={editForm.category}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Auteur<br />
                    <select
                      name="author"
                      value={editForm.author}
                      onChange={handleEditChange}
                      required
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    >
                      <option value="">Sélectionner un auteur</option>
                      {users.map((user) => (
                        <option key={user._id} value={user._id}>
                          {user.username || user.name || user.email}
                        </option>
                      ))}
                    </select>
                  </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Image de couverture (URL)<br />
                    <input
                      name="coverImageUrl"
                      value={editForm.coverImageUrl}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                  </label>
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label>Vidéo (URL)<br />
                    <input
                      name="videoUrl"
                      value={editForm.videoUrl}
                      onChange={handleEditChange}
                      style={{ width: '100%', padding: 8, marginTop: 4 }}
                    />
                  </label>
                </div>
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
                  <button type="button" onClick={handleCloseEditModal} style={{ padding: '8px 12px' }}>
                    Annuler
                  </button>
                  <button type="submit" disabled={editing} style={{
                    background: '#1976d2', color: '#fff', border: 'none', borderRadius: 4, padding: '8px 16px', fontWeight: 600
                  }}>
                    {editing ? 'Modification...' : 'Modifier'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Titre de l'article</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Image de couverture</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre de vues</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre de like</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Catégorie</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Auteur</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Vidéo</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '16px' }}>Chargement...</td>
                </tr>
              ) : articles.length > 0 ? (
                articles.map((article: any) => (
                  <tr key={article._id}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{article.title}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      {article.coverImageUrl ? (
                        <img src={article.coverImageUrl} alt="Couverture" style={{ width: 60, height: 40, objectFit: 'cover', borderRadius: 4 }} />
                      ) : (
                        <span style={{ color: '#aaa' }}>Aucune</span>
                      )}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{article.views ?? 0}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>{article.likes ?? 0}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      {article.category ?? '-'}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      {/* Affichage de l'auteur */}
                      {typeof article.author === 'object' && article.author !== null
                        ? (article.author.username || article.author.name || article.author.email || article.author._id)
                        : (article.author ?? '-')}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      {article.videoUrl ? (
                        <a href={article.videoUrl} target="_blank" rel="noopener noreferrer">Voir</a>
                      ) : (
                        <span style={{ color: '#aaa' }}>-</span>
                      )}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      <button
                        onClick={() => handleOpenEditModal(article)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#1976d2',
                          fontSize: '20px',
                          marginRight: '8px',
                        }}
                        aria-label="Modifier l'article"
                        title="Modifier l'article"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => handleDeleteArticle(article._id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          cursor: 'pointer',
                          color: '#e53935',
                          fontSize: '20px',
                        }}
                        aria-label="Supprimer l'article"
                        title="Supprimer l'article"
                      >
                        🗑️
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '16px' }}>
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