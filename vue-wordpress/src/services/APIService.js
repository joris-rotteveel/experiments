import axios from "axios";

const apiClient = axios.create({
  baseURL: `http://localhost:8888/wp-json/grafik/v1`,
  withCredentials: false,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json"
  }
});

export default {
  getProjects() {
    return apiClient.get("/list-by-type/project");
  },
  getProject(id) {
    return apiClient.get("/post-by-id/" + id);
  }
};
