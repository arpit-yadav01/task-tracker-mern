import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import { toast } from "react-toastify";

const TaskListPage = () => {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [sortOrder, setSortOrder] = useState("asc");
  const [expandedTaskId, setExpandedTaskId] = useState(null);
  const [editingTask, setEditingTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await api.get("/tasks");
      setTasks(res.data);
    } catch (error) {
      console.error("Error fetching tasks:", error);
      toast.error("❌ Failed to load tasks");
    }
  };

  const filteredTasks = tasks
    .filter(t => statusFilter === "All" ? true : t.status === statusFilter)
    .filter(t => priorityFilter === "All" ? true : t.priority === priorityFilter)
    .sort((a, b) =>
      sortOrder === "asc"
        ? new Date(a.dueDate) - new Date(b.dueDate)
        : new Date(b.dueDate) - new Date(a.dueDate)
    );

  const toggleStatus = async (task) => {
    try {
      const updatedStatus = task.status === "Pending" ? "Completed" : "Pending";
      const res = await api.put(`/tasks/${task._id}`, { status: updatedStatus });
      setTasks(tasks.map(t => (t._id === task._id ? res.data : t)));
      
      toast.success(
        updatedStatus === "Completed"
          ? "✔️ Task marked as completed"
          : "🔄 Task reopened"
      );
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("❌ Failed to update task");
    }
  };

  const deleteTask = async (id) => {
    try {
      await api.delete(`/tasks/${id}`);
      setTasks(tasks.filter(t => t._id !== id));
      setExpandedTaskId(null);
      setEditingTask(null);
      toast.success("🗑️ Task deleted successfully");
    } catch (error) {
      console.error("Error deleting task:", error);
      toast.error("❌ Failed to delete task");
    }
  };

  const toggleExpand = (taskId) => {
    if (expandedTaskId === taskId) {
      setExpandedTaskId(null);
      setEditingTask(null);
    } else {
      setExpandedTaskId(taskId);
      setEditingTask(null);
    }
  };

  const startEdit = (task) => {
    setEditingTask({ ...task });
  };

  const saveEdit = async () => {
    try {
      const res = await api.put(`/tasks/${editingTask._id}`, editingTask);
      setTasks(tasks.map(t => (t._id === res.data._id ? res.data : t)));
      setEditingTask(null);
      toast.success("✏️ Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      toast.error("❌ Failed to update task");
    }
  };

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "Pending").length,
    completed: tasks.filter(t => t.status === "Completed").length
  };

  return (
    <>
      <header className="app-header">
        <h1>Task Manager</h1>
        <p>View and manage all your tasks</p>
      </header>

      <div className="container">
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-info">
              <h3>Total Tasks</h3>
              <p>{stats.total}</p>
            </div>
            <div className="stat-icon blue">📊</div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>Pending</h3>
              <p style={{ color: "#ea580c" }}>{stats.pending}</p>
            </div>
            <div className="stat-icon orange">⏳</div>
          </div>

          <div className="stat-card">
            <div className="stat-info">
              <h3>Completed</h3>
              <p style={{ color: "#16a34a" }}>{stats.completed}</p>
            </div>
            <div className="stat-icon green">✅</div>
          </div>
        </div>

        <div className="filters">
          <div className="filter-group">
            <label>Status</label>
            <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="All">All Status</option>
              <option value="Pending">Pending</option>
              <option value="Completed">Completed</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Priority</label>
            <select value={priorityFilter} onChange={e => setPriorityFilter(e.target.value)}>
              <option value="All">All Priority</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
            </select>
          </div>

          <div className="filter-group">
            <label>Sort By</label>
            <select value={sortOrder} onChange={e => setSortOrder(e.target.value)}>
              <option value="asc">Due Date (Earliest)</option>
              <option value="desc">Due Date (Latest)</option>
            </select>
          </div>

          <div className="filter-group" style={{ display: "flex", alignItems: "flex-end" }}>
            <button className="primary" onClick={() => navigate("/")} style={{ width: "100%" }}>
              ➕ Create Task
            </button>
          </div>
        </div>

        {filteredTasks.length === 0 ? (
          <div className="empty-state">
            <div className="empty-state-icon">📝</div>
            <h3>No tasks found</h3>
            <p>Create your first task to get started</p>
          </div>
        ) : (
          <ul className="task-list">
            {filteredTasks.map(task => {
              const isExpanded = expandedTaskId === task._id;
              const isEditing = editingTask && editingTask._id === task._id;

              return (
                <li key={task._id} className={`task-item ${task.status === "Completed" ? "completed" : ""}`}>
                  
                  <div className="task-content" onClick={() => toggleExpand(task._id)} style={{ cursor: "pointer" }}>
                    <div className="task-header">
                      <h3 className={`task-title ${task.status === "Completed" ? "completed" : ""}`}>
                        {task.title}
                      </h3>
                      <span className={`priority-badge ${task.priority.toLowerCase()}`}>
                        {task.priority}
                      </span>
                    </div>

                    {task.description && !isExpanded && (
                      <div className="task-description">{task.description}</div>
                    )}

                    <div className="task-meta">
                      <span>📅 {new Date(task.dueDate).toLocaleDateString()}</span>
                      <span>{task.status === "Completed" ? "✅" : "⏳"} {task.status}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: "15px", paddingTop: "15px", borderTop: "2px solid #e2e8f0" }}>
                      
                      {!isEditing ? (
                        <>
                          {task.description && (
                            <div style={{ marginBottom: "15px" }}>
                              <strong style={{ display: "block", marginBottom: "5px", color: "#475569" }}>Description:</strong>
                              <p style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>{task.description}</p>
                            </div>
                          )}

                          <div className="task-actions">
                            <button className="primary" onClick={() => startEdit(task)}>
                              ✏️ Edit Task
                            </button>
                            <button 
                              className={task.status === "Completed" ? "complete" : "success"}
                              onClick={() => toggleStatus(task)}
                            >
                              {task.status === "Pending" ? "✓ Complete" : "↻ Reopen"}
                            </button>
                            <button className="danger" onClick={() => deleteTask(task._id)}>
                              🗑️ Delete
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          <h4 style={{ marginBottom: "15px", fontSize: "16px" }}>✏️ Edit Task</h4>

                          <div style={{ marginBottom: "12px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Title</label>
                            <input
                              value={editingTask.title}
                              onChange={e => setEditingTask({ ...editingTask, title: e.target.value })}
                              style={{ width: "100%" }}
                            />
                          </div>

                          <div style={{ marginBottom: "12px" }}>
                            <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Description</label>
                            <textarea
                              rows={5}
                              value={editingTask.description}
                              onChange={e => setEditingTask({ ...editingTask, description: e.target.value })}
                              style={{ width: "100%" }}
                            />
                          </div>

                          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
                            <div>
                              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Priority</label>
                              <select
                                value={editingTask.priority}
                                onChange={e => setEditingTask({ ...editingTask, priority: e.target.value })}
                                style={{ width: "100%" }}
                              >
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                              </select>
                            </div>

                            <div>
                              <label style={{ display: "block", marginBottom: "5px", fontWeight: "600" }}>Due Date</label>
                              <input
                                type="date"
                                value={editingTask.dueDate}
                                onChange={e => setEditingTask({ ...editingTask, dueDate: e.target.value })}
                                style={{ width: "100%" }}
                              />
                            </div>
                          </div>

                          <div className="task-actions">
                            <button className="primary" onClick={saveEdit}>💾 Save</button>
                            <button className="secondary" onClick={() => setEditingTask(null)}>✖️ Cancel</button>
                          </div>
                        </>
                      )}
                    </div>
                  )}
                  
                  {!isExpanded && (
                    <div className="task-actions">
                      <button 
                        className={task.status === "Completed" ? "complete" : "success"}
                        onClick={() => toggleStatus(task)}
                      >
                        {task.status === "Pending" ? "✓ Complete" : "↻ Reopen"}
                      </button>
                      <button className="danger" onClick={() => deleteTask(task._id)}>
                        🗑️ Delete
                      </button>
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </>
  );
};

export default TaskListPage;