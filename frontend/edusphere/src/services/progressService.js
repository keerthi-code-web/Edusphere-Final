import axios from "axios";

const API = "http://localhost:5000/api/progress";

export const createProgress = async (progressData) => {
    return await axios.post(
        `${API}/create`,
        progressData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );
};

export const getProgress = async () => {
    return await axios.get(
        `${API}/all`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );
};

export const updateProgress = async (progressId, progressData) => {
    return await axios.put(
        `${API}/update/${progressId}`,
        progressData,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );
};

export const deleteProgress = async (progressId) => {
    return await axios.delete(
        `${API}/delete/${progressId}`,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );
};