
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
    <div className='min-h-screen bg-gray-100 flex flex-col justify-center items-center'>
      <h1 className='text-4xl font-bold p-4'>Gestion des Tâches</h1>
      {/* <TodoInput
        value={input}
        onChange={e => setInput(e.target.value)}
        onAdd={handleAdd}
      />
      <TodoList todos={todos} onDelete={handleDelete} /> */}
    </div>
  );
}

export default App;
