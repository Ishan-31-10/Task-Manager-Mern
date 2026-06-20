import { useEffect, useState } from "react";
import { useTasks } from "../context/TaskContext";

const emptyForm = {
  title: "",
  description: "",
  status: "Not Started",
  priority: "Medium",
  dueDate: "",
};

const TaskForm = ({ taskToEdit, onClose, onSaved }) => {
  const { createTask, updateTask } = useTasks();
  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isEditMode = Boolean(taskToEdit);

  useEffect(() => {
    setForm(
      taskToEdit
        ? {
            title: taskToEdit.title,
            description: taskToEdit.description || "",
            status: taskToEdit.status || "Not Started",
            priority: taskToEdit.priority || "Medium",
            dueDate: taskToEdit.dueDate
              ? new Date(taskToEdit.dueDate).toISOString().split("T")[0]
              : "",
          }
        : emptyForm
    );
    setError("");
  }, [taskToEdit]);

  const handleChange = (event) => {
    setForm((current) => ({
      ...current,
      [event.target.name]: event.target.value,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setSubmitting(true);
    setError("");

    try {
      if (isEditMode) {
        await updateTask(taskToEdit._id, form);
      } else {
        await createTask(form);
      }
      onSaved(isEditMode ? "Task updated successfully" : "Task added successfully");
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Could not save the task");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="modal fade show d-block" tabIndex="-1" role="dialog">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h5 className="modal-title">
                  {isEditMode ? "Edit Task" : "Add Task"}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={onClose}
                  aria-label="Close"
                />
              </div>

              <div className="modal-body">
                {error && <div className="alert alert-danger py-2">{error}</div>}

                <div className="mb-3">
                  <label className="form-label" htmlFor="task-title">
                    Title
                  </label>
                  <input
                    id="task-title"
                    name="title"
                    className="form-control"
                    value={form.title}
                    onChange={handleChange}
                    maxLength="100"
                    autoFocus
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label" htmlFor="task-description">
                    Description
                  </label>
                  <textarea
                    id="task-description"
                    name="description"
                    className="form-control"
                    rows="3"
                    value={form.description}
                    onChange={handleChange}
                    maxLength="500"
                    placeholder="Add a few details (optional)"
                  />
                </div>

                <div className="row g-3">
                  <div className="col-sm-6">
                    <label className="form-label" htmlFor="task-status">
                      Status
                    </label>
                    <select
                      id="task-status"
                      name="status"
                      className="form-select"
                      value={form.status}
                      onChange={handleChange}
                    >
                      <option>Not Started</option>
                      <option>In Progress</option>
                      <option>Completed</option>
                    </select>
                  </div>
                  <div className="col-sm-6">
                    <label className="form-label" htmlFor="task-priority">
                      Priority
                    </label>
                    <select
                      id="task-priority"
                      name="priority"
                      className="form-select"
                      value={form.priority}
                      onChange={handleChange}
                    >
                      <option>Low</option>
                      <option>Medium</option>
                      <option>High</option>
                    </select>
                  </div>
                  <div className="col-12">
                    <label className="form-label" htmlFor="task-due-date">
                      Due date
                    </label>
                    <input
                      id="task-due-date"
                      name="dueDate"
                      type="date"
                      className="form-control"
                      value={form.dueDate}
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn btn-light" onClick={onClose}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={submitting}>
                  {submitting ? "Saving..." : isEditMode ? "Save Changes" : "Add Task"}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
      <div className="modal-backdrop fade show" />
    </>
  );
};

export default TaskForm;
