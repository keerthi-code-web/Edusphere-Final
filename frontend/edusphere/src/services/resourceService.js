import api from "./api";

export const createResource = async (resourceData) => {
  return await api.post("/resources/create", resourceData);
};

export const getResources = async () => {
  return await api.get("/resources/all");
};

export const updateResource = async (id, resourceData) => {
  return await api.put(`/resources/update/${id}`, resourceData);
};

export const deleteResource = async (id) => {
  return await api.delete(`/resources/delete/${id}`);
};