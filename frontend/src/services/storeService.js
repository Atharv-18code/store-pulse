import api from "./api";
export const getStores = (params) => api.get("/stores", { params });
export const getStore = (id) => api.get(`/stores/${id}`);
