import { createContext, useContext, useState, useCallback } from "react";
import api from "../api/axiosInstance";

const TaskContext = createContext(null);

export const TaskProvider = ({ children }) => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTasks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await api.get("/tasks");
      setTasks(data.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load tasks");
    } finally {
      setLoading(false);
    }
  }, []);

  const createTask = async (taskData) => {
    const { data } = await api.post("/tasks", taskData);
    setTasks((prev) => [data.data, ...prev]);
    return data.data;
  };

  const updateTask = async (id, taskData) => {
    const { data } = await api.put(`/tasks/${id}`, taskData);
    setTasks((prev) => prev.map((t) => (t._id === id ? data.data : t)));
    return data.data;
  };

  const deleteTask = async (id) => {
    await api.delete(`/tasks/${id}`);
    setTasks((prev) => prev.filter((t) => t._id !== id));
  };

  return (
    <TaskContext.Provider
      value={{ tasks, loading, error, fetchTasks, createTask, updateTask, deleteTask }}
    >
      {children}
    </TaskContext.Provider>
  );
};

export const useTasks = () => useContext(TaskContext);
