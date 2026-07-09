import axios from "axios";

const API = "http://localhost:5000/api/student";

export const getStudents = () => {

    return axios.get(`${API}/all`);

};