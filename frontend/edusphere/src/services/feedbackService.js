import axios from "axios";

const API = "http://localhost:5000/api/feedback";

export const createFeedback = async (message) => {

    return await axios.post(
        `${API}/create`,
        {
            message
        },
        {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }
    );

};

export const getFeedback = async () => {

    return await axios.get(
        `${API}/all`,
        {
            headers: {
                Authorization: localStorage.getItem("token")
            }
        }
    );

};

// ===== ADMIN =====

export const getAllFeedback = async () => {

    return await axios.get(

        `${API}/admin/all`

    );

};

export const updateFeedbackStatus = async (feedbackId, status) => {

    return await axios.put(

        `${API}/admin/status/${feedbackId}`,

        {
            status
        }

    );

};