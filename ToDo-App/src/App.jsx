import { useState, useEffect, useRef } from "react";
import "./App.css";
import TodoItem from "./components/TodoItem";

// Fonction utilitaire pour gérer le localStorage
const getUsersFromStorage = () => {
  const users = localStorage.getItem("users");
  return users ? JSON.parse(users) : [];
};
const setUsersToStorage = (users) => {
  localStorage.setItem("users", JSON.stringify(users));
};

function App() {
  // Authentification
  const [currentUser, setCurrentUser] = useState(() => {
    const user = localStorage.getItem("currentUser");
    return user ? JSON.parse(user) : null;
  });
  const [authForm, setAuthForm] = useState({ email: "", password: "" });
  const [isRegister, setIsRegister] = useState(false);
  const [authError, setAuthError] = useState("");

  // Tâches de l'utilisateur connecté
  const [tasks, setTasks] = useState([]);
  const [reminder, setReminder] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    titre: "",
    description: "",
    categorie: "",
    dateDebut: new Date().toISOString().slice(0, 16),
    dateFin: "",
    statut: "à faire",
  });
  const [editTask, setEditTask] = useState(null);
  const [filter, setFilter] = useState("all");
  const reminderTimeout = useRef(null);

  // Charger les tâches de l'utilisateur connecté
  useEffect(() => {
    if (currentUser) {
      const users = getUsersFromStorage();
      const user = users.find((u) => u.email === currentUser.email);
      setTasks(user?.tasks || []);
    }
  }, [currentUser]);

  // Sauvegarder les tâches de l'utilisateur connecté
  useEffect(() => {
    if (currentUser) {
      const users = getUsersFromStorage();
      const idx = users.findIndex((u) => u.email === currentUser.email);
      if (idx !== -1) {
        users[idx].tasks = tasks;
        setUsersToStorage(users);
      }
    }
  }, [tasks, currentUser]);

  // Gestion du rappel
  useEffect(() => {
    if (reminderTimeout.current) clearTimeout(reminderTimeout.current);
    if (reminder) return;
    const now = new Date();
    let nextTask = null;
    let nextIndex = -1;
    let minDiff = Infinity;
    tasks.forEach((task, idx) => {
      if (!task.dateFin || task.notified) return;
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
      reminderTimeout.current = setTimeout(() => {}, 60000);
    }
    return () => {
      if (reminderTimeout.current) clearTimeout(reminderTimeout.current);
    };
  }, [tasks, reminder]);

  // Authentification
  const handleAuthChange = (e) => {
    setAuthForm({ ...authForm, [e.target.name]: e.target.value });
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setAuthError("");
    const users = getUsersFromStorage();
    if (users.find((u) => u.email === authForm.email)) {
      setAuthError("Cet email existe déjà.");
      return;
    }
    const newUser = {
      email: authForm.email,
      password: authForm.password,
      tasks: [],
    };
    users.push(newUser);
    setUsersToStorage(users);
    setCurrentUser({ email: newUser.email });
    localStorage.setItem("currentUser", JSON.stringify({ email: newUser.email }));
    setAuthForm({ email: "", password: "" });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setAuthError("");
    const users = getUsersFromStorage();
    const user = users.find(
      (u) => u.email === authForm.email && u.password === authForm.password
    );
    if (!user) {
      setAuthError("Email ou mot de passe incorrect.");
      return;
    }
    setCurrentUser({ email: user.email });
    localStorage.setItem("currentUser", JSON.stringify({ email: user.email }));
    setAuthForm({ email: "", password: "" });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    localStorage.removeItem("currentUser");
    setTasks([]);
  };

  // Gestion des tâches
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
        notified: false,
      },
    ]);
    setForm({
      titre: "",
      description: "",
      categorie: "",
      dateDebut: new Date().toISOString().slice(0, 16),
      dateFin: "",
      statut: "à faire",
    });
    setShowModal(false);
  };

  const handleProlong = () => {
    if (!reminder) return;

    setTasks(tasks =>
      tasks.map((t, i) =>
        i === reminder.index
          ? { ...t, dateFin: getNewDateFin(t.dateFin, 20), notified: true }
          : t
      )
    );

    setReminder(null);
  };


  const handleOkReminder = () => {
    if (!reminder) return;

    setTasks(tasks =>
      tasks.map((t, i) =>
        i === reminder.index ? { ...t, notified: true } : t
      )
    );

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

  const onUpdateStatus = (id, newStatus) => {
    setTasks((tasks) =>
      tasks.map((task) =>
        task.id === id ? { ...task, statut: newStatus } : task
      )
    );
  };

  const handleEdit = (task) => {
    setEditTask(task);
    setShowModal(false);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    setTasks((tasks) =>
      tasks.map((t) => (t.id === editTask.id ? { ...editTask } : t))
    );
    setEditTask(null);
  };

  const handleEditChange = (e) => {
    setEditTask({ ...editTask, [e.target.name]: e.target.value });
  };

  const filteredTasks =
    filter === "all"
      ? tasks
      : tasks.filter((task) => task.statut === filter);

  // Interface d'authentification
  if (!currentUser) {
    return (
      <div className="min-h-screen flex flex-col w-full justify-center items-center bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-500 p-4">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md animate-slideIn">
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br w-full from-indigo-600 to-purple-600 rounded-2xl mb-4 shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-800 mb-2">
              {isRegister ? "Créer un compte" : "Bienvenue"}
            </h2>
            <p className="text-gray-600 text-sm">
              {isRegister ? "Rejoignez-nous pour organiser vos tâches" : "Connectez-vous pour gérer vos tâches"}
            </p>
          </div>
          <form
            onSubmit={isRegister ? handleRegister : handleLogin}
            className="flex flex-col gap-4"
          >
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                name="email"
                value={authForm.email}
                onChange={handleAuthChange}
                placeholder="votre@email.com"
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
              <input
                type="password"
                name="password"
                value={authForm.password}
                onChange={handleAuthChange}
                placeholder="••••••••"
                className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                required
              />
            </div>
            {authError && (
              <div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm flex items-center gap-2">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                {authError}
              </div>
            )}
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl transition-all duration-200"
            >
              {isRegister ? "Créer mon compte" : "Se connecter"}
            </button>
          </form>
          <div className="mt-6 text-center">
            {isRegister ? (
              <span className="text-gray-600 text-sm">
                Déjà un compte ?{" "}
                <button
                  className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline"
                  onClick={() => setIsRegister(false)}
                >
                  Se connecter
                </button>
              </span>
            ) : (
              <span className="text-gray-600 text-sm">
                Pas de compte ?{" "}
                <button
                  className="text-indigo-600 font-semibold hover:text-indigo-800 hover:underline"
                  onClick={() => setIsRegister(true)}
                >
                  Créer un compte
                </button>
              </span>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Interface principale (tâches)
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-indigo-100">
      {/* Header moderne */}
      <div className="bg-white shadow-lg border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center shadow-md">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
                  Gestion des tâches
                </h1>
                <p className="text-sm text-gray-500">Bonjour, {currentUser.email}</p>
              </div>
            </div>
            <button
              className="flex items-center gap-2 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transform hover:scale-105 shadow-md hover:shadow-lg transition-all duration-200"
              onClick={handleLogout}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Déconnexion
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

      {/* Pop-up de rappel */}
      {reminder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4 relative items-center text-center animate-slideIn border-4 border-red-400">
            <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-500 rounded-full flex items-center justify-center shadow-xl">
              <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold mb-2 text-red-600 flex items-center gap-2">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Rappel important !
            </h2>
            <p className="text-lg font-semibold text-gray-700">
              La tâche suivante arrive à échéance dans moins de 20 minutes&nbsp;:
            </p>
            <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl p-4 w-full border-2 border-red-200">
              <div className="font-bold text-xl text-gray-800 mb-2">{reminder.task.titre}</div>
              <div className="text-sm text-gray-600 mb-3">
                {reminder.task.description}
              </div>
              <div className="flex items-center justify-center gap-2 text-xs font-semibold text-red-600 bg-white px-3 py-2 rounded-lg">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Échéance : {new Date(reminder.task.dateFin).toLocaleString()}
              </div>
            </div>
            <div className="flex gap-3 mt-2 w-full">
              <button
                className="flex-1 bg-yellow-500 text-white px-4 py-3 rounded-lg hover:bg-yellow-600 transform hover:scale-105 font-semibold shadow-md transition-all"
                onClick={handleProlong}
              >
                Prolonger de 20 min
              </button>
              <button
                className="flex-1 bg-indigo-600 text-white px-4 py-3 rounded-lg hover:bg-indigo-700 transform hover:scale-105 font-semibold shadow-md transition-all"
                onClick={handleOkReminder}
              >
                OK
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal d'ajout de tâche */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4 relative animate-slideIn max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() => setShowModal(false)}
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Créer une tâche</h2>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  type="text"
                  name="titre"
                  value={form.titre}
                  onChange={handleChange}
                  placeholder="Ex: Faire les courses"
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Décrivez votre tâche..."
                  rows="3"
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select
                  name="categorie"
                  value={form.categorie}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="education">📚 Éducation</option>
                  <option value="sport">⚽ Sport</option>
                  <option value="course">🛒 Course</option>
                  <option value="autre">📌 Autre</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Début *</label>
                  <input
                    type="datetime-local"
                    name="dateDebut"
                    value={form.dateDebut}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin *</label>
                  <input
                    type="datetime-local"
                    name="dateFin"
                    value={form.dateFin}
                    onChange={handleChange}
                    className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  name="statut"
                  value={form.statut}
                  onChange={handleChange}
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                >
                  <option value="à faire">⏳ À faire</option>
                  <option value="en cours">🔄 En cours</option>
                  <option value="terminé">✅ Terminé</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl transition-all duration-200 mt-2"
              >
                ✨ Ajouter la tâche
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Modal d'édition */}
      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 animate-fadeIn">
          <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md flex flex-col gap-4 relative animate-slideIn max-h-[90vh] overflow-y-auto">
            <button
              className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-3xl transition-colors w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100"
              onClick={() => setEditTask(null)}
            >
              &times;
            </button>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h2 className="text-2xl font-bold text-gray-800">Modifier la tâche</h2>
            </div>
            <form onSubmit={handleUpdate} className="flex flex-col gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Titre *</label>
                <input
                  type="text"
                  name="titre"
                  value={editTask.titre}
                  onChange={handleEditChange}
                  placeholder="Ex: Faire les courses"
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                <textarea
                  name="description"
                  value={editTask.description}
                  onChange={handleEditChange}
                  placeholder="Décrivez votre tâche..."
                  rows="3"
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all resize-none"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Catégorie *</label>
                <select
                  name="categorie"
                  value={editTask.categorie}
                  onChange={handleEditChange}
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                  required
                >
                  <option value="">Sélectionnez une catégorie</option>
                  <option value="education">📚 Éducation</option>
                  <option value="sport">⚽ Sport</option>
                  <option value="course">🛒 Course</option>
                  <option value="autre">📌 Autre</option>
                </select>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Début *</label>
                  <input
                    type="datetime-local"
                    name="dateDebut"
                    value={editTask.dateDebut}
                    onChange={handleEditChange}
                    className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Fin *</label>
                  <input
                    type="datetime-local"
                    name="dateFin"
                    value={editTask.dateFin}
                    onChange={handleEditChange}
                    className="w-full border-2 border-gray-200 p-2 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                    required
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Statut</label>
                <select
                  name="statut"
                  value={editTask.statut}
                  onChange={handleEditChange}
                  className="w-full border-2 border-gray-200 p-3 rounded-lg focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-none transition-all"
                >
                  <option value="à faire">⏳ À faire</option>
                  <option value="en cours">🔄 En cours</option>
                  <option value="terminé">✅ Terminé</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-4 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-[1.02] shadow-lg hover:shadow-xl transition-all duration-200 mt-2"
              >
                💾 Mettre à jour
              </button>
            </form>
          </div>
        </div>
      )}

        {/* Filtres et actions */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-wrap gap-3 items-center justify-between mb-4">
            <div className="flex flex-wrap gap-2">
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md ${
                  filter === "all"
                    ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
                onClick={() => setFilter("all")}
              >
                📋 Toutes ({tasks.length})
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md ${
                  filter === "à faire"
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg"
                    : "bg-blue-50 text-blue-700 hover:bg-blue-100"
                }`}
                onClick={() => setFilter("à faire")}
              >
                ⏳ À faire ({tasks.filter(t => t.statut === "à faire").length})
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md ${
                  filter === "en cours"
                    ? "bg-gradient-to-r from-yellow-500 to-orange-500 text-white shadow-lg"
                    : "bg-yellow-50 text-yellow-700 hover:bg-yellow-100"
                }`}
                onClick={() => setFilter("en cours")}
              >
                🔄 En cours ({tasks.filter(t => t.statut === "en cours").length})
              </button>
              <button
                className={`px-4 py-2 rounded-lg font-semibold transition-all transform hover:scale-105 shadow-md ${
                  filter === "terminé"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "bg-green-50 text-green-700 hover:bg-green-100"
                }`}
                onClick={() => setFilter("terminé")}
              >
                ✅ Terminé ({tasks.filter(t => t.statut === "terminé").length})
              </button>
            </div>
            <button
              className="flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl transition-all duration-200"
              onClick={() => setShowModal(true)}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Créer une tâche
            </button>
          </div>
        </div>

      <div className="space-y-4">
        {/* Affichage du message si aucune tâche après filtrage */}
        {filteredTasks.length === 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gray-100 rounded-full mb-4">
              <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">
              {filter === "all" && "Aucune tâche disponible"}
              {filter === "à faire" && "Aucune tâche à faire"}
              {filter === "en cours" && "Aucune tâche en cours"}
              {filter === "terminé" && "Aucune tâche terminée"}
            </h3>
            <p className="text-gray-500 mb-4">
              {filter === "all" && "Commencez par créer votre première tâche !"}
              {(filter === "à faire" || filter === "en cours" || filter === "terminé") && "Essayez de changer de filtre ou créez une nouvelle tâche."}
            </p>
            {filter === "all" && (
              <button
                onClick={() => setShowModal(true)}
                className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-purple-700 transform hover:scale-105 shadow-lg transition-all"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Créer ma première tâche
              </button>
            )}
          </div>
        )}
        {[...filteredTasks]
          .sort((a, b) => new Date(b.dateDebut) - new Date(a.dateDebut))
          .map((task) => (
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
    </div>
  );
}

export default App;
