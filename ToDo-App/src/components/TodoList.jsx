import React from 'react';
import TodoItem from './TodoItem';

function TodoList({ todos, onDelete }) {
  return (
    <ul className="todo-list w-full bg-black flex flex-row justify-center items-center gap-4">
      {todos.map((todo) => (
        <TodoItem key={todo.id} todo={todo} onDelete={onDelete} />
      ))}
    </ul>
  );
}

export default TodoList;
