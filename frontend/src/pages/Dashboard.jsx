import { useEffect, useMemo, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useTasks } from "../context/TaskContext";
import DeleteModal from "../components/DeleteModal";
import TaskCard from "../components/TaskCard";
import TaskForm from "../components/TaskForm";

const PAGE_SIZE = 5;

const Dashboard = () => {
  const { user } = useAuth();
  const { tasks, loading, error, fetchTasks, deleteTask } = useTasks();
  const [statusFilter, setStatusFilter] = useState("All Tasks");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [page, setPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);

  useEffect(() => {
    setPage(1);
  }, [statusFilter, priorityFilter, search, sortBy]);

  useEffect(() => {
    if (!toast) return undefined;
    const timeout = setTimeout(() => setToast(""), 3000);
    return () => clearTimeout(timeout);
  }, [toast]);

  const counts = {
    total: tasks.length,
    notStarted: tasks.filter((task) => task.status === "Not Started").length,
    inProgress: tasks.filter((task) => task.status === "In Progress").length,
    completed: tasks.filter((task) => task.status === "Completed").length,
  };

  const filteredTasks = useMemo(() => {
    const result = tasks.filter((task) => {
      const matchesStatus =
        statusFilter === "All Tasks" || task.status === statusFilter;
      const matchesPriority =
        priorityFilter === "All" || task.priority === priorityFilter;
      const matchesSearch = task.title
        .toLowerCase()
        .includes(search.trim().toLowerCase());

      return matchesStatus && matchesPriority && matchesSearch;
    });

    return [...result].sort((a, b) => {
      if (sortBy === "oldest") {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
      if (sortBy === "dueDate") {
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return new Date(a.dueDate) - new Date(b.dueDate);
      }
      return new Date(b.createdAt) - new Date(a.createdAt);
    });
  }, [tasks, statusFilter, priorityFilter, search, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredTasks.length / PAGE_SIZE));
  const currentPage = Math.min(page, totalPages);
  const visibleTasks = filteredTasks.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const openAddModal = () => {
    setEditingTask(null);
    setFormOpen(true);
  };

  const openEditModal = (task) => {
    setEditingTask(task);
    setFormOpen(true);
  };

  const handleDelete = async () => {
    setDeleting(true);
    try {
      await deleteTask(taskToDelete._id);
      setTaskToDelete(null);
      setToast("Task deleted successfully");
    } catch (err) {
      setToast(err.response?.data?.message || "Could not delete the task");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <main className="dashboard-bg min-vh-100 py-4 py-md-5">
      <div className="container">
        <section className="d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3 mb-4">
          <div>
            <h1 className="h3 fw-bold mb-1">Welcome back, {user.name}</h1>
            <p className="text-muted mb-0">Here’s what’s on your task list today.</p>
          </div>
          <button className="btn btn-primary px-4" onClick={openAddModal}>
            + Add Task
          </button>
        </section>

        <section className="row g-3 mb-4">
          {[
            ["Total Tasks", counts.total, "primary"],
            ["Not Started", counts.notStarted, "secondary"],
            ["In Progress", counts.inProgress, "warning"],
            ["Completed", counts.completed, "success"],
          ].map(([label, value, color]) => (
            <div className="col-6 col-lg-3" key={label}>
              <div className="card border-0 shadow-sm h-100">
                <div className="card-body">
                  <div className={`small fw-semibold text-${color} mb-2`}>{label}</div>
                  <div className="h3 fw-bold mb-0">{value}</div>
                </div>
              </div>
            </div>
          ))}
        </section>

        <section className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3">
              <div className="col-lg-4">
                <label className="form-label small fw-semibold" htmlFor="search">
                  Search
                </label>
                <input
                  id="search"
                  className="form-control"
                  placeholder="Search by title"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </div>
              <div className="col-sm-4 col-lg-3">
                <label className="form-label small fw-semibold" htmlFor="status-filter">
                  Status
                </label>
                <select
                  id="status-filter"
                  className="form-select"
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option>All Tasks</option>
                  <option>Not Started</option>
                  <option>In Progress</option>
                  <option>Completed</option>
                </select>
              </div>
              <div className="col-sm-4 col-lg-2">
                <label className="form-label small fw-semibold" htmlFor="priority-filter">
                  Priority
                </label>
                <select
                  id="priority-filter"
                  className="form-select"
                  value={priorityFilter}
                  onChange={(event) => setPriorityFilter(event.target.value)}
                >
                  <option>All</option>
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                </select>
              </div>
              <div className="col-sm-4 col-lg-3">
                <label className="form-label small fw-semibold" htmlFor="sort">
                  Sort
                </label>
                <select
                  id="sort"
                  className="form-select"
                  value={sortBy}
                  onChange={(event) => setSortBy(event.target.value)}
                >
                  <option value="newest">Newest first</option>
                  <option value="oldest">Oldest first</option>
                  <option value="dueDate">Due date</option>
                </select>
              </div>
            </div>
          </div>
        </section>

        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading tasks...</span>
            </div>
          </div>
        )}

        {!loading && error && (
          <div className="alert alert-danger d-flex justify-content-between align-items-center">
            <span>{error}</span>
            <button className="btn btn-sm btn-outline-danger" onClick={fetchTasks}>
              Try again
            </button>
          </div>
        )}

        {!loading && !error && visibleTasks.length === 0 && (
          <div className="card border-0 shadow-sm">
            <div className="card-body text-center py-5">
              <div className="empty-icon mb-3">✓</div>
              <h2 className="h5">No tasks found</h2>
              <p className="text-muted mb-3">
                {tasks.length
                  ? "Try changing your search or filters."
                  : "Add your first task to get started."}
              </p>
              {!tasks.length && (
                <button className="btn btn-primary" onClick={openAddModal}>
                  Add Task
                </button>
              )}
            </div>
          </div>
        )}

        {!loading && !error && visibleTasks.length > 0 && (
          <>
            <div className="d-flex justify-content-between align-items-center mb-3">
              <h2 className="h5 mb-0">Tasks</h2>
              <span className="text-muted small">
                {filteredTasks.length} {filteredTasks.length === 1 ? "task" : "tasks"}
              </span>
            </div>
            <div className="row g-3">
              {visibleTasks.map((task) => (
                <div className="col-12 col-md-6" key={task._id}>
                  <TaskCard
                    task={task}
                    onEdit={openEditModal}
                    onDelete={setTaskToDelete}
                  />
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <nav className="mt-4" aria-label="Task pages">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
                    <button
                      className="page-link"
                      onClick={() => setPage((value) => value - 1)}
                    >
                      Previous
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, index) => index + 1).map(
                    (pageNumber) => (
                      <li
                        className={`page-item ${
                          currentPage === pageNumber ? "active" : ""
                        }`}
                        key={pageNumber}
                      >
                        <button className="page-link" onClick={() => setPage(pageNumber)}>
                          {pageNumber}
                        </button>
                      </li>
                    )
                  )}
                  <li
                    className={`page-item ${
                      currentPage === totalPages ? "disabled" : ""
                    }`}
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage((value) => value + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>

      {formOpen && (
        <TaskForm
          taskToEdit={editingTask}
          onClose={() => setFormOpen(false)}
          onSaved={setToast}
        />
      )}

      {taskToDelete && (
        <DeleteModal
          task={taskToDelete}
          deleting={deleting}
          onClose={() => setTaskToDelete(null)}
          onConfirm={handleDelete}
        />
      )}

      {toast && (
        <div className="toast-container position-fixed bottom-0 end-0 p-3">
          <div className="toast show align-items-center text-bg-dark border-0">
            <div className="d-flex">
              <div className="toast-body">{toast}</div>
              <button
                type="button"
                className="btn-close btn-close-white me-2 m-auto"
                onClick={() => setToast("")}
                aria-label="Close"
              />
            </div>
          </div>
        </div>
      )}
    </main>
  );
};

export default Dashboard;
