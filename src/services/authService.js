/**
 * authService.js — Authentication API calls
 */

import api from "./api";

const authService = {
  login: async (email, password) => {
    const res = await api.post("/auth/login", { email, password });
    return res.data; // expects { token, user }
  },

  logout: async () => {
    try {
      await api.post("/auth/logout");
    } finally {
      localStorage.removeItem("auth_token");
      localStorage.removeItem("auth_user");
    }
  },

  me: async () => {
    const res = await api.get("/auth/me");
    return res.data; // expects { user }
  },

  refreshToken: async () => {
    const res = await api.post("/auth/refresh");
    return res.data;
  },
};

export default authService;
