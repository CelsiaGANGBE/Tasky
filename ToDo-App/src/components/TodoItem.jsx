import React from "react";

function TodoItem({ task, onDelete, onEdit, onUpdateStatus }) {
  // Définir la couleur du border-l selon la catégorie
  
  const handleStatusChange = (e) => {
    onUpdateStatus(task.id, e.target.value);
  };
  
  const categoryBorder =
    task.categorie === "education"
      ? "border-l-4 border-blue-500"
      : task.categorie === "course"
      ? "border-l-4 border-green-500"
      : task.categorie === "sport"
      ? "border-l-4 border-white"
      : "border-l-4 border-gray-200"; // par défaut

  return (
    <div
      className={`flex flex-col bg-white ${categoryBorder} border border-gray-300 rounded-lg p-4 shadow-sm mb-2`}
    >
      <h2 className="text-xl font-semibold">{task.titre}</h2>
      <p>
        <span className="font-bold text-blue-500">Description:</span>{" "}
        {task.description}
      </p>
      <p>
        <span className="font-bold">Catégorie:</span>{" "}
        <span
          className={
            task.categorie === "education"
              ? "text-blue-500 font-semibold"
              : task.categorie === "course"
              ? "text-green-600 font-semibold"
              : task.categorie === "sport"
              ? "text-gray-800 font-semibold"
              : "text-gray-600"
          }
        >
          {task.categorie}
        </span>
      </p>
      <p className="text-gray-700">
        <span className="font-bold">Début:</span>{" "}
        {new Date(task.dateDebut).toLocaleString()}
      </p>
      <p className="text-gray-700">
        <span className="font-bold">Fin:</span>{" "}
        {new Date(task.dateFin).toLocaleString()}
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
          className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 shadow"
          onClick={() => onEdit(task)}
        >
          Modifier
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 shadow"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
