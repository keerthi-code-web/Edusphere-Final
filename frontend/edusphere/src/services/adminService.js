import api from "./api";

export const getAdmins = async () => {
    return await api.get("/admin/all");
};

export const createAdmin = async (adminData) => {
    return await api.post("/admin/create", adminData);
};

export const updateAdmin = async (adminId, adminData) => {
    return await api.put(`/admin/update/${adminId}`, adminData);
};

export const deleteAdmin = async (adminId) => {
    return await api.delete(`/admin/delete/${adminId}`);
};

export const loginAdmin = async (loginData) => {
    return await api.post("/admin/login", loginData);
};

export const getAllFeedback = async () => {
    return await api.get("/feedback/admin/all");
};