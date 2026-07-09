import axios from "axios";

const API = "http://localhost:5000/api/admin";

export const getAdmins = async () => {
    return await axios.get(
        `${API}/all`
    );
};

export const createAdmin = async (adminData) => {
    return await axios.post(
        `${API}/create`,
        adminData
    );
};

export const updateAdmin = async (adminId, adminData) => {
    return await axios.put(
        `${API}/update/${adminId}`,
        adminData
    );
};

export const deleteAdmin = async (adminId) => {
    return await axios.delete(
        `${API}/delete/${adminId}`
    );
};

export const loginAdmin = async (loginData) => {
    return await axios.post(
        `${API}/login`,
        loginData
    );
};

export const getAllFeedback = async () => {

    return await axios.get(
        "http://localhost:5000/api/feedback/admin/all"
    );

};