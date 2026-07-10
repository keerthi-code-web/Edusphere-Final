import api from "./api";

export const createProgress = async (progressData) => {
    return await api.post("/progress/create", progressData);
};

export const getProgress = async () => {
    return await api.get("/progress/all");
};

export const updateProgress = async (progressId, progressData) => {
    return await api.put(`/progress/update/${progressId}`, progressData);
};

export const deleteProgress = async (progressId) => {
    return await api.delete(`/progress/delete/${progressId}`);
};