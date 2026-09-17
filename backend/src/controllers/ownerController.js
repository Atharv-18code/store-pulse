const db = require("../utils/supabase");
exports.getDashboard = async (req, res, next) => {
  try {
    const { data: store, error } = await db
      .from("stores")
      .select("*")
      .eq("owner_id", req.user.id)
      .maybeSingle();
    if (error) throw error;
    if (!store)
      return res
        .status(404)
        .json({ message: "No store assigned to your account" });
    const { data: ratings, error: ratingError } = await db
      .from("ratings")
      .select("id,rating,created_at,user_id")
      .eq("store_id", store.id)
      .order("created_at", { ascending: false });
    if (ratingError) throw ratingError;
    const { data: users, error: userError } = await db
      .from("users")
      .select("id,name,email")
      .in(
        "id",
        ratings.map((rating) => rating.user_id),
      );
    if (userError) throw userError;
    const byId = Object.fromEntries(users.map((user) => [user.id, user]));
    const avg = ratings.length
      ? ratings.reduce((sum, rating) => sum + rating.rating, 0) / ratings.length
      : 0;
    res.json({
      store: { id: store.id, name: store.name, address: store.address },
      avgRating: Number(avg.toFixed(2)),
      totalRatings: ratings.length,
      ratings: ratings.map((rating) => ({
        id: rating.id,
        rating: rating.rating,
        createdAt: rating.created_at,
        user: byId[rating.user_id],
      })),
    });
  } catch (error) {
    next(error);
  }
};
