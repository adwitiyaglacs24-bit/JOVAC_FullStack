import { useState } from "react";
import "./App.css";

function App() {
  const [projectName, setProjectName] = useState("");

  const [projects, setProjects] = useState([]);

  function addProject() {
    if (projectName.trim() === "") return;

    const newProject = {
      id: Date.now(),
      project: projectName,
      completed: false,
    };

    setProjects([...projects, newProject]);
    setProjectName("");
  }

  function toggleStatus(id) {
    setProjects(
      projects.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item,
      ),
    );
  }

  return (
    <div className="container">
      <h2>Project Checklist</h2>

      <div className="input-box">
        <input
          type="text"
          placeholder="Enter project"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <button onClick={addProject}>Add</button>
      </div>

      <ul>
        {projects.map((item) => (
          <li key={item.id}>
            <input
              type="checkbox"
              checked={item.completed}
              onChange={() => toggleStatus(item.id)}
            />

            <span
              style={{
                textDecoration: item.completed ? "underline" : "none",
              }}
            >
              {item.project}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
