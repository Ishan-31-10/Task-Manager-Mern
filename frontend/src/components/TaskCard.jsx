const statusClasses = {
  "Not Started": "text-bg-secondary",
  "In Progress": "text-bg-primary",
  Completed: "text-bg-success",
};

const priorityClasses = {
  Low: "text-bg-light border",
  Medium: "text-bg-warning",
  High: "text-bg-danger",
};

const TaskCard = ({ task, onEdit, onDelete }) => {
  const dueDate = task.dueDate
    ? new Date(task.dueDate).toLocaleDateString(undefined, {
        day: "numeric",
        month: "short",
        year: "numeric",
        timeZone: "UTC",
      })
    : "No due date";

  return (
    <div className="card task-card border-0 shadow-sm h-100">
      <div className="card-body d-flex flex-column">
        <div className="d-flex justify-content-between gap-3 mb-2">
          <h5 className="card-title mb-0 text-break">{task.title}</h5>
          <span className={`badge ${priorityClasses[task.priority || "Medium"]}`}>
            {task.priority || "Medium"}
          </span>
        </div>

        <p className="card-text text-secondary small flex-grow-1">
          {task.description || "No description provided."}
        </p>

        <div className="d-flex flex-wrap align-items-center gap-2 mb-3">
          <span className={`badge ${statusClasses[task.status || "Not Started"]}`}>
            {task.status || "Not Started"}
          </span>
          <span className="small text-muted">Due: {dueDate}</span>
        </div>

        <div className="d-flex gap-2 border-top pt-3">
          <button
            type="button"
            className="btn btn-outline-primary btn-sm"
            onClick={() => onEdit(task)}
          >
            Edit
          </button>
          <button
            type="button"
            className="btn btn-outline-danger btn-sm"
            onClick={() => onDelete(task)}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
