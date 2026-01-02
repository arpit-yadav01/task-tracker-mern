import TaskItem from "./TaskItem";

const TaskList = ({ tasks, onToggle, onDelete }) => {
  if (tasks.length === 0) return <p>No tasks yet</p>;

  return (
    <ul>
      {tasks.map(task => (
        <TaskItem
          key={task._id}
          task={task}
          onToggle={() => onToggle(task)}
          onDelete={() => onDelete(task._id)}
        />
      ))}
    </ul>
  );
};

export default TaskList;
