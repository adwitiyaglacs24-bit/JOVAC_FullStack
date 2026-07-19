function TodoList({ todos, deleteTodo }) {
  return (
    <div className="todo-list">
        <p className="count">Total Tasks : {todos.length}</p>
      {todos.length === 0 ? (
        <>
          <p className="empty">No tasks added yet.</p>
        </>
      ) : (
        todos.map((todo) => (
          <div className="todo-item" key={todo.id}>
            <span>{todo.text}</span>
            <button className="delete-btn" onClick={() => deleteTodo(todo.id)}>
              Delete
            </button>
          </div>
        ))
        )}
    </div>
  );
}

export default TodoList;
