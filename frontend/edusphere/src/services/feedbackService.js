import api from "./api";

export const createFeedback = async (message) => {
    return await api.post("/feedback/create", {
        message
    });
};

export const getFeedback = async () => {
    return await api.get("/feedback/all");
};

// Admin

export const getAllFeedback = async () => {
    return await api.get("/feedback/admin/all");
};

export const updateFeedbackStatus = async (feedbackId, status) => {
    return await api.put(
        `/feedback/admin/status/${feedbackId}`,
        { status }
    );
};