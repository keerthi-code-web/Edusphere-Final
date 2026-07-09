import api from "./api";

// Get Logged-in Student
export const getProfile = async () => {
    return await api.get("/auth/me");
};

// Update Profile
export const updateProfile = async (profileData) => {
    return await api.put("/auth/profile", profileData);
};
export const uploadProfilePhoto = async (formData) => {
    return await api.post(
        "/auth/upload-photo",
        formData,
        {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        }
    );
};