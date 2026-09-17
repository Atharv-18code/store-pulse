import api from "./api";
export const updatePassword = (data) => api.put("/users/password", data);
