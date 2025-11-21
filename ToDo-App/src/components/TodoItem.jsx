import React from 'react';

function TodoItem({ task, onDelete, onEdit, onUpdateStatus }) {
  // Définir la couleur et l'icône selon la catégorie
  const getCategoryInfo = () => {
    switch (task.categorie) {
      case "education":
        return { 
          color: "blue", 
          icon: "📚", 
          bg: "bg-blue-50", 
          border: "border-blue-500",
          text: "text-blue-700"
        };
      case "sport":
        return { 
          color: "orange", 
          icon: "⚽", 
          bg: "bg-orange-50", 
          border: "border-orange-500",
          text: "text-orange-700"
        };
      case "course":
        return { 
          color: "green", 
          icon: "🛒", 
          bg: "bg-green-50", 
          border: "border-green-500",
          text: "text-green-700"
        };
      default:
        return { 
          color: "gray", 
          icon: "📌", 
          bg: "bg-gray-50", 
          border: "border-gray-400",
          text: "text-gray-700"
        };
    }
  };

  // Définir la couleur et l'icône selon le statut
  const getStatusInfo = () => {
    switch (task.statut) {
      case "à faire":
        return {
          bg: "bg-blue-100",
          text: "text-blue-800",
          icon: "⏳",
          border: "border-blue-300"
        };
      case "en cours":
        return {
          bg: "bg-yellow-100",
          text: "text-yellow-800",
          icon: "🔄",
          border: "border-yellow-300"
        };
      case "terminé":
        return {
          bg: "bg-green-100",
          text: "text-green-800",
          icon: "✅",
          border: "border-green-300"
        };
      default:
        return {
          bg: "bg-gray-100",
          text: "text-gray-800",
          icon: "📋",
          border: "border-gray-300"
        };
    }
  };

  const categoryInfo = getCategoryInfo();
  const statusInfo = getStatusInfo();

  // Vérifier si la tâche est en retard
  const isOverdue = new Date(task.dateFin) < new Date() && task.statut !== "terminé";

  return (
    <div
      className={`bg-white w-1/2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] border-l-4 ${categoryInfo.border} ${
        isOverdue ? "ring-2 ring-red-300" : ""
      }`}
    >
      {/* En-tête avec titre et statut */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h2 className="text-xl font-bold text-gray-800">{task.titre}</h2>
            {isOverdue && (
              <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded-full flex items-center gap-1">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                En retard
              </span>
            )}
          </div>
          <div className="flex flex-wrap gap-2 mb-3">
            <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold ${categoryInfo.bg} ${categoryInfo.text}`}>
              <span>{categoryInfo.icon}</span>
              {task.categorie.charAt(0).toUpperCase() + task.categorie.slice(1)}
            </span>
            <select
              value={task.statut}
              onChange={(e) => onUpdateStatus(task.id, e.target.value)}
              className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-semibold border-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 ${statusInfo.bg} ${statusInfo.text} ${statusInfo.border}`}
            >
              <option value="à faire">⏳ À faire</option>
              <option value="en cours">🔄 En cours</option>
              <option value="terminé">✅ Terminé</option>
            </select>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mb-4">
        <p className="text-gray-700 leading-relaxed">{task.description}</p>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4 p-3 bg-gray-50 rounded-lg">
        <div className="flex items-start gap-2">
          <svg className="w-5 h-5 text-gray-500 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <div>
            <div className="text-xs text-gray-500 font-medium">Début</div>
            <div className="text-sm font-semibold text-gray-700">
              {new Date(task.dateDebut).toLocaleString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
        <div className="flex items-start gap-2">
          <svg className={`w-5 h-5 mt-0.5 ${isOverdue ? 'text-red-500' : 'text-gray-500'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <div className="text-xs text-gray-500 font-medium">Échéance</div>
            <div className={`text-sm font-semibold ${isOverdue ? 'text-red-600' : 'text-gray-700'}`}>
              {new Date(task.dateFin).toLocaleString('fr-FR', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2 pt-4 border-t border-gray-200">
        {task.statut !== "terminé" ? (
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-2.5 rounded-lg hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
            onClick={() => onEdit(task)}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </button>
        ) : (
          <button
            className="flex-1 flex items-center justify-center gap-2 bg-gray-400 text-white px-4 py-2.5 rounded-lg cursor-not-allowed font-semibold shadow-md opacity-60"
            disabled
            title="Les tâches terminées ne peuvent pas être modifiées"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier (désactivé)
          </button>
        )}
        <button
          onClick={() => onDelete(task.id)}
          className="flex items-center justify-center gap-2 bg-red-500 text-white px-4 py-2.5 rounded-lg hover:bg-red-600 transform hover:scale-105 font-semibold shadow-md hover:shadow-lg transition-all duration-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
          Supprimer
        </button>
      </div>
    </div>
  );
}

export default TodoItem;