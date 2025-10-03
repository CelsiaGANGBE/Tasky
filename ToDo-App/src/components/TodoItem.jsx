import React, { useState } from 'react';

function TodoItem({ task, onDelete, onEdit, onUpdateStatus }) {
  const [showPopup, setShowPopup] = useState(false);

  const [editedTask, setEditedTask] = useState({ ...task });

  const handleEditClick = () => {
    setEditedTask({ ...task }); 
    setShowPopup(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditedTask((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    onEdit(editedTask);
    setShowPopup(false);
  };

  const handleStatusChange = (e) => {
    onUpdateStatus(task.id, e.target.value);
  };

  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-lg p-4 shadow-sm mb-2">
      <h2 className="text-xl font-semibold">{task.titre}</h2>
      <p>
        <span className="font-bold text-blue-500">Description:</span> {task.description}
      </p>
      <p>
        <span className="font-bold">Catégorie:</span>{' '}
        <span className={task.categorie === 'education' ? 'text-blue-500' : 'text-green-500'}>
          {task.categorie}
        </span>
      </p>
      <p>
        <span className="font-bold">Debut:</span> {task.dateDebut}
      </p>
      <p>
        <span className="font-bold">Fin:</span> {task.dateFin}
      </p>
      <p>
        <span className="font-bold">Statut:</span>{' '}
        <select
          value={task.statut}
          onChange={handleStatusChange}
          className="border border-gray-300 rounded p-1"
        >
          {/* Afficher "à faire" seulement si le statut actuel est "à faire" */}
          {task.statut === "à faire" && <option value="à faire">À faire</option>}
          <option value="en cours">En cours</option>
          <option value="terminé">Terminé</option>
          <option value="abandonné">Abandonné</option>
        </select>
      </p>

      <div className="flex gap-2 mt-4">
        <button
          onClick={handleEditClick}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Supprimer
        </button>
      </div>

      {/* Popup de modification */}
      {showPopup && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white p-6 rounded shadow-lg w-1/2">
            <h2 className="text-xl font-bold mb-4">Modifier la tâche</h2>

            <form className="flex flex-col gap-3">
              <input
                type="text"
                name="titre"
                value={editedTask.titre}
                onChange={handleChange}
                placeholder="Titre"
                className="border p-2 rounded"
              />
              <textarea
                name="description"
                value={editedTask.description}
                onChange={handleChange}
                placeholder="Description"
                className="border p-2 rounded"
              />
              <input
                type="text"
                name="categorie"
                value={editedTask.categorie}
                onChange={handleChange}
                placeholder="Catégorie"
                className="border p-2 rounded"
              />
              <input
                type="date"
                name="dateDebut"
                value={editedTask.dateDebut}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <input
                type="date"
                name="dateFin"
                value={editedTask.dateFin}
                onChange={handleChange}
                className="border p-2 rounded"
              />
              <select
                name="statut"
                value={editedTask.statut}
                onChange={handleChange}
                className="border p-2 rounded"
              > 
                <option value="à faire">À faire</option>
                <option value="en cours">En cours</option>
                <option value="terminé">Terminé</option>
                <option value="abandonné">Abandonné</option>
              </select>
            </form>

            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={handleSave}
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              >
                Sauvegarder
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
              >
                Annuler
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TodoItem;
