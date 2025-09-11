import React from 'react';

function TodoInput({ value, onChange, onAdd }) {
  return (
    <div className="todo-input">
      <input
        type="text"
        value={value}
        onChange={onChange}
        placeholder="Ajouter une tâche..."
      />
      <button onClick={onAdd}>Ajouter</button>
    </div>
  );
}

export default TodoInput;
