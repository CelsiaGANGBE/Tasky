import { useState, useEffect, useRef } from "react";
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
      dateDebut: "2025-09-10T09:00",
      dateFin: "2025-09-12T18:00",
      statut: "à faire",
    },
    {
      id: 2,
      titre: "Révision examen React",
      description: "Relire le cours et faire des petits projets pratiques",
      categorie: "education",
      dateDebut: "2025-09-11T10:00",
      dateFin: "2025-09-15T20:00",
      statut: "en cours",
    },
    {
      id: 3,
      titre: "Tester le rappel",
      description: "Cette tâche doit déclencher un rappel rapidement",
      categorie: "test",
      dateDebut: new Date().toISOString(),
      dateFin: new Date(Date.now() + 60 * 1000).toISOString(), // échéance dans 1 min
      statut: "à faire",
    },
  ]);

  const [reminder, setReminder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    categorie: "",
    dateDebut: "",
    dateFin: "",
    statut: "à faire",
  });
  const [editTask, setEditTask] = useState(null);

  // Ajout de l'état pour le filtre
  const [filter, setFilter] = useState("all");

  const reminderTimeout = useRef(null);

  // Effet pour gérer les rappels automatiques
  useEffect(() => {
    if (reminderTimeout.current) clearTimeout(reminderTimeout.current);
    if (reminder) return;

    const now = new Date();
    let nextTask = null;
    let nextIndex = -1;
    let minDiff = Infinity;

    tasks.forEach((task, idx) => {
      if (!task.dateFin) return;
      const dateFin = new Date(task.dateFin);
      const diff = dateFin - now;
      if (diff > 0 && diff <= 20 * 60 * 1000 && diff < minDiff) {
        minDiff = diff;
        nextTask = task;
        nextIndex = idx;
      }
    });

    if (nextTask) {
      reminderTimeout.current = setTimeout(() => {
        setReminder({ task: nextTask, index: nextIndex });
      }, 1000);
    } else {
      reminderTimeout.current = setTimeout(() => {}, 60000); // recheck dans 1 min
    }

    return () => {
      if (reminderTimeout.current) clearTimeout(reminderTimeout.current);
    };
  }, [tasks, reminder]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !form.titre ||
      !form.description ||
      !form.categorie ||
      !form.dateDebut ||
      !form.dateFin
    )
      return;
    setTasks([
      ...tasks,
      {
        ...form,
        id: Date.now(),
        statut: 'à faire',
      },
    ]);
    setForm({
      titre: "",
      description: "",
      categorie: "",
      dateDebut: "",
      dateFin: "",
      statut: "à faire",
    });
    setShowModal(false);
  };

  const handleProlong = () => {
    if (!reminder) return;
    setTasks((tasks) =>
      tasks.map((t, i) =>
        i === reminder.index ? { ...t, dateFin: getNewDateFin(t.dateFin, 20) } : t
      )
    );
    setReminder(null);
  };

  const handleOkReminder = () => {
    setReminder(null);
  };

  const getNewDateFin = (dateFin, minutes) => {
    const d = new Date(dateFin);
    d.setMinutes(d.getMinutes() + minutes);
    return d.toISOString();
  };

  const handleDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  // Fonction pour mettre à jour le statut d'une tâche
  const onUpdateStatus = (id, newStatus) => {
    setTasks(tasks =>
      tasks.map(task =>
        task.id === id ? { ...task, statut: newStatus } : task
      )
    );
  };

  // Fonction pour ouvrir la modale d'édition avec les données de la tâche
  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(false); // ferme la modale de création si ouverte
  };

  // Fonction pour gérer la soumission de la modale d'édition
  const handleUpdate = (e) => {
    e.preventDefault();
    setTasks(tasks =>
      tasks.map(t =>
        t.id === editTask.id ? { ...editTask } : t
      )
    );
    setEditTask(null);
  };

  // Fonction pour gérer les changements dans la modale d'édition
  const handleEditChange = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  // Méthode de filtrage
  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((task) => task.statut === filter);

  return (
    <div className="p-6 mx-auto flex flex-col justify-center items-center">
      {/* Pop-up de rappel */}
      {reminder && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4 relative items-center text-center">
            <h2 className="text-xl font-bold mb-2 text-red-600">Rappel&nbsp;!</h2>
            <p className="text-lg font-semibold">
              La tâche suivante arrive à échéance dans moins de 20 minutes&nbsp;:
            </p>
            <div className="bg-gray-100 rounded p-3 w-full">
              <div className="font-bold">{reminder.task.titre}</div>
              <div className="text-sm text-gray-600">
                {reminder.task.description}
              </div>
              <div className="text-xs mt-2">
                Échéance : {new Date(reminder.task.dateFin).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-4 mt-4 justify-center">
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                onClick={handleProlong}
              >
                Prolonger de 20 min
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleOkReminder}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      <h1 className="text-4xl font-bold mb-6">Gestion des tâches</h1>

      {/* Modal d'ajout de tâche */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">Créer une tâche</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="text"
                name="titre"
                value={form.titre}
                onChange={handleChange}
                placeholder="Titre"
                className="border p-2 rounded"
                required
              />
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-2 rounded"
                required
              />
              <select
                name="categorie"
                value={form.categorie}
                onChange={handleChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Catégorie</option>
                <option value="education">Éducation</option>
                <option value="sport">Sport</option>
                <option value="course">Course</option>
                <option value="autre">Autre</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  name="dateDebut"
                  value={form.dateDebut}
                  onChange={handleChange}
                  className="border p-2 rounded w-1/2"
                  required
                />
                <input
                  type="datetime-local"
                  name="dateFin"
                  value={form.dateFin}
                  onChange={handleChange}
                  className="border p-2 rounded w-1/2"
                  required
                />
              </div>
              {/* PLUS DE CHAMP STATUT ICI */}
              <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2">Ajouter</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md flex flex-col gap-4 relative">
            <button
              className="absolute top-2 right-2 text-gray-500 hover:text-red-500 text-2xl"
              onClick={() => setEditTask(null)}
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-2">Modifier la tâche</h2>
            <form onSubmit={handleUpdate} className="flex flex-col gap-3">
              <input
                type="text"
                name="titre"
                value={editTask.titre}
                onChange={handleEditChange}
                placeholder="Titre"
                className="border p-2 rounded"
                required
              />
              <textarea
                name="description"
                value={editTask.description}
                onChange={handleEditChange}
                placeholder="Description"
                className="border p-2 rounded"
                required
              />
              <select
                name="categorie"
                value={editTask.categorie}
                onChange={handleEditChange}
                className="border p-2 rounded"
                required
              >
                <option value="">Catégorie</option>
                <option value="education">Éducation</option>
                <option value="sport">Sport</option>
                <option value="course">Course</option>
                <option value="autre">Autre</option>
              </select>
              <div className="flex gap-2">
                <input
                  type="datetime-local"
                  name="dateDebut"
                  value={editTask.dateDebut}
                  onChange={handleEditChange}
                  className="border p-2 rounded w-1/2"
                  required
                />
                <input
                  type="datetime-local"
                  name="dateFin"
                  value={editTask.dateFin}
                  onChange={handleEditChange}
                  className="border p-2 rounded w-1/2"
                  required
                />
              </div>
              <select
                name="statut"
                value={editTask.statut}
                onChange={handleEditChange}
                className="border p-2 rounded"
              >
                <option value="à faire">À faire</option>
                <option value="en cours">En cours</option>
                <option value="terminé">Terminé</option>
              </select>
              <button
                type="submit"
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 mt-2"
              >
                Mettre à jour
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="grid gap-4">
        <div className=" flex space-x-10 items-center mb-4">
          <button
            className={`px-4 py-2 rounded ${filter === "all" ? "bg-blue-700" : "bg-blue-500"} text-white hover:bg-blue-600`}
            onClick={() => setFilter("all")}
          >
            Toutes
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === "à faire" ? "bg-blue-700" : "bg-blue-500"} text-white hover:bg-blue-600`}
            onClick={() => setFilter("à faire")}
          >
            À faire
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === "en cours" ? "bg-yellow-700" : "bg-yellow-500"} text-white hover:bg-yellow-600`}
            onClick={() => setFilter("en cours")}
          >
            En cours
          </button>
          <button
            className={`px-4 py-2 rounded ${filter === "terminé" ? "bg-green-700" : "bg-green-500"} text-white hover:bg-green-600`}
            onClick={() => setFilter("terminé")}
          >
            Terminé
          </button>
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={() => setShowModal(true)}
          >
            Créer tâche
          </button>
        </div>
        {/* Affichage du message si aucune tâche après filtrage */}
        {filteredTasks.length === 0 && (
          <div className="text-center text-gray-500 font-semibold mb-4">
            {filter === "all" && "Aucune tâche disponible"}
            {filter === "à faire" && "Aucune tâche à faire"}
            {filter === "en cours" && "Aucune tâche en cours"}
            {filter === "terminé" && "Aucune tâche terminée"}
          </div>
        )}
        {filteredTasks.map((task) => (
          <TodoItem
            key={task.id}
            task={task}
            onDelete={handleDelete}
            onUpdateStatus={onUpdateStatus}
            onEdit={handleEdit}
          />
        ))}
      </div>
    </div>
  );
}

export default App;
