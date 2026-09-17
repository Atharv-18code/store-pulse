import api from "./api";
export const submitRating = (storeId, rating) =>
  api.post("/ratings", { storeId, rating });
export const updateRating = (storeId, rating) =>
  api.put(`/ratings/${storeId}`, { rating });
export const getMyRating = (storeId) => api.get(`/ratings/my/${storeId}`);
