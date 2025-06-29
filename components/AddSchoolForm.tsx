'use client';
import React, { useState } from 'react';

export function AddSchool({ onAdded }: { onAdded: () => void }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    nom: '', adresse: '', site: '', logo: '', resume: ''
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await fetch('/api/schools', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });
    setLoading(false);
    setOpen(false);
    setForm({ nom: '', adresse: '', site: '', logo: '', resume: '' });
    onAdded();
  };

  return (
    <>
      <button onClick={() => setOpen(true)} style={{ marginBottom: 16, background: '#2563eb', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: 4 }}>
        Ajouter
      </button>
      {open && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
          background: 'rgba(0,0,0,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000
        }}>
          <form onSubmit={handleSubmit} style={{ background: '#fff', padding: 24, borderRadius: 8, minWidth: 320 }}>
            <h2>Ajouter une école</h2>
            <input name="nom" placeholder="Nom" value={form.nom} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
            <input name="adresse" placeholder="Adresse" value={form.adresse} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
            <input name="site" placeholder="Site web" value={form.site} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
            <input name="logo" placeholder="Logo (URL)" value={form.logo} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
            <input name="resume" placeholder="Résumé" value={form.resume} onChange={handleChange} required style={{ width: '100%', marginBottom: 8 }} />
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
              <button type="button" onClick={() => setOpen(false)} disabled={loading}>Annuler</button>
              <button type="submit" disabled={loading}>{loading ? 'Ajout...' : 'Ajouter'}</button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}