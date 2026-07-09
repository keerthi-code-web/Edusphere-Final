import api from "./api";

// Create Exam
export const createExam = async (examData) => {
  return await api.post("/exams/create", examData);
};

// Get Exams
export const getExams = async () => {
  return await api.get("/exams/all");
};

// Update Exam
export const updateExam = async (id, examData) => {
  return await api.put(`/exams/update/${id}`, examData);
};

// Delete Exam
export const deleteExam = async (id) => {
  return await api.delete(`/exams/delete/${id}`);
};