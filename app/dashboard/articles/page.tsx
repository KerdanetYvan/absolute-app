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

async function deleteArticle(articleId: string) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || ''}/api/articles/${articleId}`, {
    method: 'DELETE',
  });
  if (!res.ok) throw new Error('Erreur lors de la suppression');
  return res.json();
}

export default function DashboardArticlesPage() {
  const [articles, setArticles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchArticles()
      .then(data => setArticles(Array.isArray(data) ? data : data.articles || []))
      .catch(() => setArticles([]))
      .finally(() => setLoading(false));
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

  return (
    <div style={{ display: 'flex' }}>
      <NavBarDashboard />
      <main style={{ flex: 1, padding: '2rem' }}>
        <h1>Liste des articles</h1>
        <div style={{ overflowX: 'auto', marginTop: '2rem' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Titre de l'article</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Image de couverture</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre de vues</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Nombre de like</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Catégorie</th> {/* Nouvelle colonne */}
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Vidéo</th>
                <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={7} style={{ textAlign: 'center', padding: '16px' }}>Chargement...</td>
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
                      {article.videoUrl ? (
                        <a href={article.videoUrl} target="_blank" rel="noopener noreferrer">Voir</a>
                      ) : (
                        <span style={{ color: '#aaa' }}>-</span>
                      )}
                    </td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'center' }}>
                      <button
    onClick={() => {/* Ajoute ici la logique de modification, par exemple ouvrir un modal ou naviguer vers une page d'édition */}}
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
                  <td colSpan={7} style={{ textAlign: 'center', padding: '16px' }}>
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