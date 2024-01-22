// src/App.jsx
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient, QueryClient, QueryClientProvider } from 'react-query';
import './TodoList.css'; // Import the CSS file

const fetchTodos = async () => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos');
  const data = await response.json();
  return data.slice(0, 5);
};

const addTodo = async (text) => {
  const response = await fetch('https://jsonplaceholder.typicode.com/todos', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title: text,
      completed: false,
    }),
  });
  return response.json();
};

const TodoList = () => {
  const queryClient = useQueryClient();
  const { data: todos } = useQuery('todos', fetchTodos);

  const mutation = useMutation(addTodo, {
    onSuccess: () => {
      queryClient.invalidateQueries('todos');
    },
  });

  const [newTodo, setNewTodo] = useState('');

  const handleAddTodo = () => {
    if (newTodo.trim() !== '') {
      mutation.mutate(newTodo);
      setNewTodo('');
    }
  };

  return (
    <div className="container">
      <h1>Todo List</h1>
      <ul>
        {todos &&
          todos.map((todo) => (
            <li key={todo.id}>{todo.title}</li>
          ))}
      </ul>
      <div className="input-container">
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
        />
        <button onClick={handleAddTodo}>Add Todo</button>
      </div>
    </div>
  );
};

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TodoList />
    </QueryClientProvider>
  );
};

export default App;
