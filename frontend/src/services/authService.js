import api from "./api";
export const register = (data) => api.post("/auth/register", data);
export const login = (email, password) =>
  api.post("/auth/login", { email, password });
