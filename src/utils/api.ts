import axios from "axios";

const api = axios.create({
  baseURL: "https://8a50c4b0a2b09a7795f7d582cf3c0cc8.serveo.net/api/",

  headers: {
    "Content-Type": "application/json",
  },
});

export default api;
