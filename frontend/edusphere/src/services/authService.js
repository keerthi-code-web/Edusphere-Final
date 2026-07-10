import api from "./api";

export const login = async (email, password) => {
    return await api.post("/auth/login", {
        email,
        password
    });
};

export const register = async (data) => {
    return await api.post("/auth/register", data);
};

export const getCurrentStudent = async () => {

    const token = localStorage.getItem("token");

    return await api.get("/auth/me", {

        headers: {

            Authorization: `Bearer ${token}`

        }

    });

};