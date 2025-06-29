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
      <h1>Liste des écoles</h1>
      <ul style={{ padding: 0, listStyle: "none" }}>
        {schools.map((school) => (
          <li key={school.id} style={{ marginBottom: "2rem", display: "flex", alignItems: "center" }}>
            <img src={school.logo} alt={school.nom} style={{ width: 64, height: 64, marginRight: 16, borderRadius: 8, background: "#fff" }} />
            <div>
                <a href={school.site} target="_blank" rel="noopener noreferrer" style={{ fontWeight: "bold", fontSize: "1.2rem", color: "#2563eb", textDecoration: "none" }}>
                {school.nom}
                </a>
                <div style={{ color: "#555", fontSize: "0.95rem" }}>{school.adresse}</div>
                <div style={{ color: "#666", fontSize: "0.9rem", marginTop: 4 }}>{school.resume}</div>
            </div>
            <button
                style={{ marginLeft: 16, padding: "8px 12px", borderRadius: 6, background: "#feb151", color: "#222", border: "none", cursor: "pointer", fontWeight: 600 }}
                onClick={() => handleEditClick(school)}
            >
                Modifier
            </button>
            <button
                style={{ marginLeft: 8, padding: "8px 12px", borderRadius: 6, background: "#e53935", color: "#fff", border: "none", cursor: "pointer", fontWeight: 600 }}
                onClick={() => handleDelete(school.id)}
            >
                Supprimer
            </button>
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