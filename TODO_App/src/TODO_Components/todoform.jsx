import { useState } from "react";

function TodoForm({ addTodo }) {
  const [task, setTask] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    addTodo(task);
    setTask("");
  };
  return (
    <form onSubmit={handleSubmit} className="todo-form">
      <input
        type="text"
        placeholder="Enter your task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}
      />
      <button>+</button>
    </form>
  );
}

export default TodoForm;
