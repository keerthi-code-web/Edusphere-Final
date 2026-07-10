import api from "./api";

export const getAnnouncements = async () => {
    return await api.get("/announcements/all");
};

export const createAnnouncement = async (announcementData) => {
    return await api.post(
        "/announcements/create",
        announcementData
    );
};

export const updateAnnouncement = async (
    announcementId,
    announcementData
) => {
    return await api.put(
        `/announcements/update/${announcementId}`,
        announcementData
    );
};

export const deleteAnnouncement = async (announcementId) => {
    return await api.delete(
        `/announcements/delete/${announcementId}`
    );
};