import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";

const Home = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "Low",
    dueDate: ""
  });

  const isValid = form.title && form.dueDate;

  const addTask = async () => {
    await api.post("/tasks", form);
    setForm({
      title: "",
      description: "",
      priority: "Low",
      dueDate: ""
    });
  };

  return (
    <div className="container">
      <h2>Create Task</h2>

      {/* ===== ROW 1 ===== */}
      <div className="task-form">
        <input
          placeholder="Task Title"
          value={form.title}
          onChange={e =>
            setForm({ ...form, title: e.target.value })
          }
        />

        <input
          type="date"
          value={form.dueDate}
          onChange={e =>
            setForm({ ...form, dueDate: e.target.value })
          }
        />

        <select
          value={form.priority}
          onChange={e =>
            setForm({ ...form, priority: e.target.value })
          }
        >
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
        </select>

        <button
          className="primary"
          disabled={!isValid}
          onClick={addTask}
        >
          Add Task
        </button>

        <button
          className="secondary"
          onClick={() => navigate("/tasks")}
        >
          View All
        </button>
      </div>

      {/* ===== ROW 2 ===== */}
      <div className="task-desc-row">
        <textarea
          placeholder="Task Description (optional)"
          value={form.description}
          onChange={e =>
            setForm({ ...form, description: e.target.value })
          }
        />
      </div>

      {!isValid && (
        <p style={{ color: "#dc2626" }}>
          Title and Due Date are required
        </p>
      )}
    </div>
  );
};

export default Home;
