import React from 'react';

function TodoItem({ todo, onDelete }) {
  return (
    <li className="todo-item">
      {todo.text}
      <button onClick={() => onDelete(todo.id)}>Supprimer</button>
    </li>
  );
}

export default TodoItem;
