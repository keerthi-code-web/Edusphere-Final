import api from "./api";

// Create Study Plan
export const createStudyPlan = async (planData) => {
    return await api.post("/studyplans/create", planData);
};

// Get All Study Plans
export const getStudyPlans = async () => {
    return await api.get("/studyplans/all");
};

// Update Study Plan
export const updateStudyPlan = async (planId, planData) => {
    return await api.put(`/studyplans/update/${planId}`, planData);
};

// Delete Study Plan
export const deleteStudyPlan = async (planId) => {
    return await api.delete(`/studyplans/delete/${planId}`);
};