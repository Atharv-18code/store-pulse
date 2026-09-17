const db = require("../utils/supabase");
const { validateRating } = require("../utils/validation");
const save = async (userId, storeId, rating) =>
  db
    .from("ratings")
    .upsert(
      {
        user_id: userId,
        store_id: storeId,
        rating: Number(rating),
        updated_at: new Date().toISOString(),
      },
      { onConflict: "user_id,store_id" },
    )
    .select()
    .single();
exports.submitRating = async (req, res, next) => {
  try {
    const { storeId, rating } = req.body;
    const errors = validateRating(rating);
    if (!storeId || errors.length)
      return res
        .status(400)
        .json({ message: errors[0] || "Store is required" });
    const { data, error } = await save(req.user.id, storeId, rating);
    if (error) throw error;
    res.status(201).json({ message: "Rating submitted", rating: data });
  } catch (error) {
    next(error);
  }
};
exports.updateRating = async (req, res, next) => {
  try {
    const errors = validateRating(req.body.rating);
    if (errors.length) return res.status(400).json({ message: errors[0] });
    const { data, error } = await save(
      req.user.id,
      req.params.storeId,
      req.body.rating,
    );
    if (error) throw error;
    res.json({ message: "Rating updated", rating: data });
  } catch (error) {
    next(error);
  }
};
exports.getMyRating = async (req, res, next) => {
  try {
    const { data, error } = await db
      .from("ratings")
      .select("rating")
      .eq("user_id", req.user.id)
      .eq("store_id", req.params.storeId)
      .maybeSingle();
    if (error) throw error;
    res.json({ rating: data?.rating || null });
  } catch (error) {
    next(error);
  }
};
