"use client";
import { useEffect, useState } from "react";
import { AddSchool } from "@/components/AddSchoolForm";

interface School {
  id: string;
  nom: string;
  adresse: string;
  site: string;
  logo: string;
  resume: string;
}

export default function SchoolList() {
  const [schools, setSchools] = useState<School[]>([]);
  const [editingSchool, setEditingSchool] = useState<School | null>(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [editForm, setEditForm] = useState<Partial<School>>({});

  useEffect(() => {
    fetch("/api/schools")
      .then((res) => res.json())
      .then(setSchools);
  }, []);

  const handleEditClick = (school: School) => {
  setEditingSchool(school);
  setEditForm(school);
  setModalOpen(true);
};

const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  setEditForm({ ...editForm, [e.target.name]: e.target.value });
};

const handleEditSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  if (!editingSchool) return;
  await fetch(`/api/schools/${editingSchool.id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(editForm),
  });
  setModalOpen(false);
  setEditingSchool(null);
  // Refresh list
  fetch("/api/schools")
    .then((res) => res.json())
    .then(setSchools);
};

const handleDelete = async (schoolId: string) => {
  if (!window.confirm("Voulez-vous vraiment supprimer cette école ?")) return;
  await fetch(`/api/schools/${schoolId}`, { method: "DELETE" });
  // Refresh list
  fetch("/api/schools")
    .then((res) => res.json())
    .then(setSchools);
};

  return (
    <main style={{ flex: 1, padding: "2rem" }}>
      <AddSchool onAdded={() => window.location.reload()} />
<ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-8">
  {schools.map((school) => (
    <li
      key={school.id}
      className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col mx-auto mb-8 p-4" // Ajout de w-full pour uniformiser la largeur
    >
      <a href={school.site} target="_blank" rel="noopener noreferrer">
        <img
          className="rounded-t-lg w-full h-40 object-contain bg-gray-50 border-b border-gray-100"
          src={school.logo}
          alt={school.nom}
        />
      </a>
      <div className="p-5 flex flex-col flex-1">
        <a href={school.site} target="_blank" rel="noopener noreferrer">
          <h5 className="mb-2 text-xl font-bold tracking-tight text-gray-900">
            {school.nom}
          </h5>
        </a>
        <div className="mb-2 text-gray-600 text-sm">{school.adresse}</div>
        <p className="mb-4 font-normal text-gray-700 flex-1">{school.resume}</p>
        <div className="flex gap-2 mt-auto">
          <button
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-900 bg-[#FEB157] rounded-lg hover:bg-[#e09e3c] transition"
            onClick={() => handleEditClick(school)}
          >
            Modifier
          </button>
          <button
            style={{ backgroundColor: '#e53935' }}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white rounded-lg hover:bg-[#b71c1c] transition shadow focus:outline-none focus:ring-2 focus:ring-red-400/60 border-0"
            onClick={() => handleDelete(school.id)}
          >
            Supprimer
          </button>
        </div>
      </div>
    </li>
  ))}
</ul>
{modalOpen && editingSchool && (
  <div style={{
    position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
    background: "rgba(0,0,0,0.3)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
  }}>
    <div style={{ background: "#fff", padding: 32, borderRadius: 8, minWidth: 350, maxWidth: 400, boxShadow: "0 2px 16px rgba(0,0,0,0.2)" }}>
      <h2>Modifier l'école</h2>
      <form onSubmit={handleEditSubmit}>
        <div style={{ marginBottom: 12 }}>
          <label>Nom<br />
            <input
              name="nom"
              value={editForm.nom || ""}
              onChange={handleEditChange}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Adresse<br />
            <input
              name="adresse"
              value={editForm.adresse || ""}
              onChange={handleEditChange}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Site<br />
            <input
              name="site"
              value={editForm.site || ""}
              onChange={handleEditChange}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Logo (URL)<br />
            <input
              name="logo"
              value={editForm.logo || ""}
              onChange={handleEditChange}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>Résumé<br />
            <input
              name="resume"
              value={editForm.resume || ""}
              onChange={handleEditChange}
              style={{ width: "100%", padding: 8, marginTop: 4 }}
            />
          </label>
        </div>
        <div style={{ display: "flex", justifyContent: "flex-end", gap: 8 }}>
          <button type="button" onClick={() => setModalOpen(false)} style={{ padding: "8px 12px" }}>
            Annuler
          </button>
          <button type="submit" style={{ background: "#1976d2", color: "#fff", border: "none", borderRadius: 4, padding: "8px 16px", fontWeight: 600 }}>
            Enregistrer
          </button>
        </div>
      </form>
    </div>
  </div>
)}
    </main>
  );
}