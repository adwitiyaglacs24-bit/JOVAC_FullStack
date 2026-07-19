import { useState } from "react";
import "./App.css";
import TodoForm from "./TODO_Components/TodoForm";
import TodoList from "./TODO_Components/TodoList";

function App() {
  const [todos, setTodos] = useState([]);

  const addTodo = (task) => {
    if (task.trim() === "") return;

    const newTodo = {
      id: Date.now(),
      text: task,
    };

    setTodos([...todos, newTodo]);
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  return (
    <div className="container">
      <div className="todo-box">
        <h1>Todo App</h1>
        <p className="subtitle">Manage your daily tasks</p>

        <TodoForm addTodo={addTodo} />

        <TodoList todos={todos} deleteTodo={deleteTodo} />
      </div>
    </div>
  );
}

export default App;
