const TaskForm = ({ form, setForm, onSubmit }) => {
  const isValid = form.title && form.dueDate;

  return (
    <div>
      <div className="form-group">
        <input
          placeholder="Task title"
          value={form.title}
          onChange={e => setForm({ ...form, title: e.target.value })}
        />
      </div>

      <div className="form-group">
        <textarea
          placeholder="Task description (optional)"
          value={form.description}
          onChange={e => setForm({ ...form, description: e.target.value })}
          rows="3"
        />
      </div>

      <div className="form-group">
        <select
          value={form.priority}
          onChange={e => setForm({ ...form, priority: e.target.value })}
        >
          <option value="Low">Low Priority</option>
          <option value="Medium">Medium Priority</option>
          <option value="High">High Priority</option>
        </select>
      </div>

      <div className="form-group">
        <input
          type="date"
          value={form.dueDate}
          onChange={e => setForm({ ...form, dueDate: e.target.value })}
        />
      </div>

      <button
        className="primary"
        disabled={!isValid}
        onClick={onSubmit}
      >
        Add Task
      </button>

      {!isValid && (
        <p style={{ color: "#dc2626", marginTop: 8 }}>
          Title and Due Date are required
        </p>
      )}
    </div>
  );
};

export default TaskForm;
