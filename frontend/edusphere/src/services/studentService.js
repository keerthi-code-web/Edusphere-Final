import api from "./api";

export const getStudents = async () => {
    return await api.get("/student/all");
};