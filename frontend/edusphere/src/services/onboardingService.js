import api from "./api";

export const completeOnboarding = async (data) => {

    return await api.put("/auth/onboarding", data);

};