import axios from "axios";

const API = "http://localhost:5000/api/announcements";

// ============================
// CREATE ANNOUNCEMENT
// ============================

export const createAnnouncement = async (announcementData) => {

    return await axios.post(

        `${API}/create`,

        announcementData,

        {
           headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
}
        }

    );

};

// ============================
// GET ALL ANNOUNCEMENTS
// ============================

export const getAnnouncements = async () => {

    return await axios.get(

        `${API}/all`,

        {
           headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
}
        }

    );

};

// ============================
// UPDATE ANNOUNCEMENT
// ============================

export const updateAnnouncement = async (announcementId, announcementData) => {

    return await axios.put(

        `${API}/update/${announcementId}`,

        announcementData,

        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }

    );

};

// ============================
// DELETE ANNOUNCEMENT
// ============================

export const deleteAnnouncement = async (announcementId) => {

    return await axios.delete(

        `${API}/delete/${announcementId}`,

        {
           headers: {
    Authorization: `Bearer ${localStorage.getItem("token")}`
}
        }

    );

};