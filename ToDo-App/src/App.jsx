
import { useState } from 'react';
import './App.css';
import TodoInput from './components/TodoInput';
import TodoList from './components/TodoList';

function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState('');

  const handleAdd = () => {
    if (input.trim() === '') return;
    setTodos([
      ...todos,
      { id: Date.now(), text: input }
    ]);
    setInput('');
  };

  const handleDelete = (id) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  return (
    <div className='bg-gray-50 min-h-screen w-full flex flex-col justify-center mx-auto items-center'>
      <h1 className='text-4xl font-bold p-4'>Gestion des taches </h1>
      {/* <TodoInput
        value={input}
        onChange={e => setInput(e.target.value)}
        onAdd={handleAdd}
      />
      <TodoList todos={todos} onDelete={handleDelete} /> */}
      <div className="flex flex-col items-center justify-center  bg-white border border-gray-300 rounded-lg m-4 p-4">
<div className="flex flex-col gap-4 w-full">
      <h1 className='text-xl font-semiBold'>Tâches 1: Acheter a manger</h1>
      <h3> <span className='font-bold text-blue-500'>Description:</span> Acheter des fruits et légumes a Carrefour avec une bonne qualité</h3>
      </div>
      <div className="flex gap-2 mt-4 justify-start w-full">
        <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">Modifier</button>
        <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">Supprimer</button>
      </div>
      </div>
    </div>
  );
}

export default App;
