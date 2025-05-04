import axios from "axios";

const api = axios.create({
  baseURL: "https://2c2a6c1716eedb67b64c89482df57c15.serveo.net/api/",
  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
