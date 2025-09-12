import React from 'react';

function TodoItem({ task, onDelete }) {
  return (
    <div className="flex flex-col bg-white border border-gray-300 rounded-lg p-4 shadow-sm mb-2">
      <h2 className="text-xl font-semibold">{task.titre}</h2>
      <p>
        <span className="font-bold text-blue-500">Description:</span> {task.description}
      </p>
      <p>
        <span className="font-bold">Catégorie:</span> <span className={task.categorie === "education" ? "text-blue-500" : "text-green-500"}> {task.categorie} </span>
      </p>
      <p> 
        <span className="font-bold">Début:</span> {task.dateDebut}
      </p>
      <p>
        <span className="font-bold">Fin:</span> {task.dateFin}
      </p>
      <p>
        <span className="font-bold">Statut:</span> {task.statut}
      </p>
      <div className="flex gap-2 mt-4">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Modifier
        </button>
        <button
          onClick={() => onDelete(task.id)}
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
        >
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default TodoItem;
