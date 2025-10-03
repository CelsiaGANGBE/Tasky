

import { useState } from "react";
import "./App.css";
import TodoItem from "./components/TodoItem";

function App() {
  const [tasks, setTasks] = useState([
    {
      id: 1,
      titre: "Acheter à manger",
      description:
        "Acheter des fruits et légumes à Carrefour avec une bonne qualité",
      categorie: "course",
      dateDebut: "2025-09-10",
      dateFin: "2025-09-12",
      statut: "à faire",
    },
    {
      id: 2,
      titre: "Révision examen React",
      description: "Relire le cours et faire des petits projets pratiques",
      categorie: "education",
      dateDebut: "2025-09-11",
      dateFin: "2025-09-15",
      statut: "en cours",
    },
  ]);


  // État pour la modal d'ajout
  const [showModal, setShowModal] = useState(false);
  // État pour le formulaire
  const [form, setForm] = useState({
    titre: '',
    description: '',
    categorie: '',
    dateDebut: '',
    dateFin: '',
    statut: 'à faire',
  });

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.titre || !form.description || !form.categorie || !form.dateDebut || !form.dateFin) return;
    setTasks([
      ...tasks,
      {
        ...form,
        id: Date.now(),
        statut: 'à faire',
      },
    ]);
    setForm({ titre: '', description: '', categorie: '', dateDebut: '', dateFin: '', statut: 'à faire' });
    setShowModal(false);
  };

  return (
    <div className="p-6 mx-auto flex flex-col justify-center items-center">
      <h1 className="text-4xl font-bold mb-6">Gestion des tâches</h1>

      {/* Modal d'ajout de tâche */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4 relative">
            <button className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl" onClick={() => setShowModal(false)}>&times;</button>
            <h2 className="text-xl font-bold mb-2">Créer une tâche</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input type="text" name="titre" value={form.titre} onChange={handleChange} placeholder="Titre" className="border p-2 rounded" required />
              <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="border p-2 rounded" required />
              <select name="categorie" value={form.categorie} onChange={handleChange} className="border p-2 rounded" required>
                <option value="">Catégorie</option>
                <option value="education">Éducation</option>
                <option value="sport">Sport</option>
                <option value="course">Course</option>
                <option value="autre">Autre</option>
              </select>
              <div className="flex gap-2">
                <input type="date" name="dateDebut" value={form.dateDebut} onChange={handleChange} className="border p-2 rounded w-1/2" required />
                <input type="date" name="dateFin" value={form.dateFin} onChange={handleChange} className="border p-2 rounded w-1/2" required />
              </div>
              {/* PLUS DE CHAMP STATUT ICI */}
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2">Ajouter</button>
            </form>
          </div>
        </div>
      )}

      {tasks.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-center p-6 border rounded-lg shadow-md bg-gray-50">
          <img
            src="https://img.freepik.com/premium-vector/illustration-task_498740-14038.jpg"
            alt="empty"
            className="w-64 h-64 mb-4"
          />
          <p className="text-lg font-semibold mb-2">Aucune tâche disponible</p>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setShowModal(true)}>
            Créer tâche
          </button>
        </div>
      ) : (
        <div className="grid gap-4">
          <div className=" flex space-x-10 items-center mb-4">
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600" onClick={() => setShowModal(true)}>
              Créer tâche
            </button>
            <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              A faire 
            </button>
            <button className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              En cours
            </button>
            <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-blue-600">
              terminé
            </button>
          </div>
          {/* {tasks.map((task) => (
            <TodoItem key={task.id} task={task} onDelete={handleDelete} />
          ))} */}
         {tasks.map((task) => (
  <TodoItem
    key={task.id}
    task={task}
    onDelete={handleDelete}
    onEdit={(updatedTask) => {
      setTasks(tasks.map(t => t.id === updatedTask.id ? updatedTask : t));
    }}
    onUpdateStatus={(id, newStatus) => {
      setTasks(tasks.map(t => t.id === id ? { ...t, statut: newStatus } : t));
    }}
  />
))}


        </div>
      )}
    </div>
  );
}
//Test
export default App;
