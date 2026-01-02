const TaskItem = ({ task, onToggle, onDelete }) => {
  const priorityClass =
    task.priority === "High"
      ? "priority-high"
      : task.priority === "Medium"
      ? "priority-medium"
      : "priority-low";

  return (
    <li className="task-item">
      <div>
        <div
          className={`task-title ${
            task.status === "Completed" ? "completed" : ""
          }`}
        >
          {task.title}
        </div>

        {task.description && (
          <div className="task-desc">{task.description}</div>
        )}

        <div className={priorityClass}>
          Priority: {task.priority}
        </div>
      </div>

      <div>
        <button className="secondary" onClick={onToggle}>
          {task.status === "Pending" ? "Mark Done" : "Reopen"}
        </button>
        <button className="secondary" onClick={onDelete}>
          Delete
        </button>
      </div>
    </li>
  );
};

export default TaskItem;
