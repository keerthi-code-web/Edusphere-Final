import api from "./api";

// Create
export const createTask = (taskData) =>
    api.post("/tasks/create", taskData);

// Get
export const getTasks = () =>
    api.get("/tasks/all");

// Update
export const updateTask = (id, taskData) =>
    api.put(`/tasks/update/${id}`, taskData);

// Delete
export const deleteTask = (id) =>
    api.delete(`/tasks/delete/${id}`);