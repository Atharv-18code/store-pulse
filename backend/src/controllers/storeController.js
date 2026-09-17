const db = require("../utils/supabase");
const decorate = (stores, ratings, userId) =>
  stores.map((store) => {
    const values = ratings.filter((rating) => rating.store_id === store.id);
    const average = values.length
      ? values.reduce((sum, item) => sum + item.rating, 0) / values.length
      : 0;
    return {
      id: store.id,
      name: store.name,
      email: store.email,
      address: store.address,
      avgRating: Number(average.toFixed(2)),
      totalRatings: values.length,
      myRating: userId
        ? values.find((item) => item.user_id === userId)?.rating
        : undefined,
    };
  });
exports.getStores = async (req, res, next) => {
  try {
    const page = Math.max(Number(req.query.page) || 1, 1);
    const limit = Math.min(Math.max(Number(req.query.limit) || 12, 1), 100);
    let query = db.from("stores").select("*", { count: "exact" });
    if (req.query.search)
      query = query.or(
        `name.ilike.%${req.query.search}%,address.ilike.%${req.query.search}%`,
      );
    const {
      data: stores,
      error,
      count,
    } = await query.range((page - 1) * limit, page * limit - 1);
    if (error) throw error;
    const { data: ratings, error: ratingError } = await db
      .from("ratings")
      .select("store_id,user_id,rating")
      .in(
        "store_id",
        stores.map((store) => store.id),
      );
    if (ratingError) throw ratingError;
    res.json({
      stores: decorate(stores, ratings, req.user?.id),
      total: count || 0,
    });
  } catch (error) {
    next(error);
  }
};
exports.getStore = async (req, res, next) => {
  try {
    const { data: store, error } = await db
      .from("stores")
      .select("*")
      .eq("id", req.params.id)
      .single();
    if (error) return res.status(404).json({ message: "Store not found" });
    const { data: ratings, error: ratingError } = await db
      .from("ratings")
      .select("store_id,user_id,rating")
      .eq("store_id", store.id);
    if (ratingError) throw ratingError;
    res.json(decorate([store], ratings)[0]);
  } catch (error) {
    next(error);
  }
};
