import React from 'react';

function TodoItem({ task, onDelete, onEdit }) {
  // Définir la couleur du border-r selon la catégorie
  const categoryBorder =
    task.categorie === "education"
      ? "border-l-4 border-blue-500"
      : task.categorie === "course"
      ? "border-l-4 border-green-500"
      : "border-l-4 border-gray-200"; // par défaut blanc/gris clair

  return (
    <div
      className={`flex flex-col bg-white rounded-lg p-4 shadow-md mb-3 transition hover:shadow-lg ${categoryBorder}`}
    >
      <h2 className="text-xl font-semibold text-gray-800">{task.titre}</h2>
      <p className="text-gray-700 mt-1">
        <span className="font-bold text-blue-500">Description:</span> {task.description}
      </p>
      <p className="text-gray-700">
        <span className="font-bold">Catégorie:</span>{" "}
        <span
          className={
            task.categorie === "education"
              ? "text-blue-500 font-semibold"
              : task.categorie === "course"
              ? "text-green-600 font-semibold"
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
      <p className="text-gray-700">
        <span className="font-bold">Statut:</span> {task.statut}
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