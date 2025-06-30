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
      <button
        onClick={() => setOpen(true)}
        className="mb-4 px-6 py-3 bg-[#FFB151] dark:bg-[#3CBDD1] rounded-lg font-semibold text-base shadow transition text-white flex items-center gap-2 hover:scale-105 hover:shadow-lg"
        style={{ boxShadow: '0 2px 8px 0 rgba(255,177,81,0.15)' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        Ajouter une école
      </button>
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30">
          <form
            onSubmit={handleSubmit}
            className="bg-white dark:bg-[#454141] p-8 rounded-xl shadow-xl w-full max-w-xs flex flex-col gap-3"
          >
            <h2 className="text-lg font-bold mb-2 text-gray-800 dark:text-gray-200">Ajouter une école</h2>
            <input
              name="nom"
              placeholder="Nom"
              value={form.nom}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 dark:text-gray-200 border border-gray-200 dark:border-[#3CBDD1] rounded"
            />
            <input
              name="adresse"
              placeholder="Adresse"
              value={form.adresse}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 dark:text-gray-200 border border-gray-200 dark:border-[#3CBDD1] rounded"
            />
            <input
              name="site"
              placeholder="Site web"
              value={form.site}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 dark:text-gray-200 border border-gray-200 dark:border-[#3CBDD1] rounded"
            />
            <input
              name="logo"
              placeholder="Logo (URL)"
              value={form.logo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 dark:text-gray-200 border border-gray-200 dark:border-[#3CBDD1] rounded"
            />
            <input
              name="resume"
              placeholder="Résumé"
              value={form.resume}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 dark:text-gray-200 border border-gray-200 dark:border-[#3CBDD1] rounded"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setOpen(false)}
                disabled={loading}
                className="px-4 py-2 rounded border border-gray-200 text-gray-700 dark:text-gray-300 dark:hover:text-gray-700 hover:bg-gray-50"
              >
                Annuler
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-3 bg-[#FFB151] dark:bg-[#3CBDD1] rounded-lg font-semibold text-base shadow transition text-white flex items-center gap-2 hover:scale-105 hover:shadow-lg"
                style={{ boxShadow: '0 2px 8px 0 rgba(255,177,81,0.15)' }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                </svg>
                {loading ? 'Ajout...' : 'Ajouter'}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}