const bcrypt = require("bcryptjs");
const db = require("../utils/supabase");
const {
  validateUser,
  validateStore,
  validatePassword,
} = require("../utils/validation");
const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  address: user.address,
  role: user.role,
  createdAt: user.created_at,
});
const pageValues = (query) => ({
  page: Math.max(Number(query.page) || 1, 1),
  limit: Math.min(Math.max(Number(query.limit) || 10, 1), 100),
});
const pageSlice = (items, page, limit) =>
  items.slice((page - 1) * limit, page * limit);

exports.getDashboard = async (req, res, next) => {
  try {
    const [users, stores, ratings] = await Promise.all([
      db.from("users").select("*", { count: "exact", head: true }),
      db.from("stores").select("*", { count: "exact", head: true }),
      db.from("ratings").select("*", { count: "exact", head: true }),
    ]);
    if (users.error || stores.error || ratings.error)
      throw users.error || stores.error || ratings.error;
    res.json({
      totalUsers: users.count || 0,
      totalStores: stores.count || 0,
      totalRatings: ratings.count || 0,
    });
  } catch (error) {
    next(error);
  }
};
exports.getUsers = async (req, res, next) => {
  try {
    const { page, limit } = pageValues(req.query);
    const sort = ["name", "email", "address", "role", "created_at"].includes(
      req.query.sort,
    )
      ? req.query.sort
      : "name";
    let query = db
      .from("users")
      .select("id,name,email,address,role,created_at", { count: "exact" })
      .order(sort, { ascending: req.query.order !== "desc" });
    if (req.query.role) query = query.eq("role", req.query.role);
    if (req.query.search)
      query = query.or(
        `name.ilike.%${req.query.search}%,email.ilike.%${req.query.search}%,address.ilike.%${req.query.search}%`,
      );
    const { data, error, count } = await query.range(
      (page - 1) * limit,
      page * limit - 1,
    );
    if (error) throw error;
    res.json({ users: data.map(safeUser), total: count || 0 });
  } catch (error) {
    next(error);
  }
};
exports.getUserById = async (req, res, next) => {
  try {
    const { data: user, error } = await db
      .from("users")
      .select("id,name,email,address,role,created_at")
      .eq("id", req.params.id)
      .maybeSingle();
    if (error) throw error;
    if (!user) return res.status(404).json({ message: "User not found" });
    const result = safeUser(user);
    if (user.role === "STORE_OWNER") {
      const { data: store } = await db
        .from("stores")
        .select("id,name")
        .eq("owner_id", user.id)
        .maybeSingle();
      if (store) {
        const { data: ratings } = await db
          .from("ratings")
          .select("rating")
          .eq("store_id", store.id);
        const average = ratings.length
          ? ratings.reduce((sum, item) => sum + item.rating, 0) / ratings.length
          : 0;
        result.store = {
          name: store.name,
          avgRating: Number(average.toFixed(2)),
          totalRatings: ratings.length,
        };
      }
    }
    res.json(result);
  } catch (error) {
    next(error);
  }
};
exports.createUser = async (req, res, next) => {
  try {
    const { name, email, password, address, role, storeId } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const errors = validateUser({ name, email: normalizedEmail, address });
    errors.push(...validatePassword(password || ""));
    if (!name || !email || !password || errors.length)
      return res.status(400).json({
        message: errors[0] || "Name, email, and password are required",
      });
    const validRole = ["ADMIN", "USER", "STORE_OWNER"].includes(role)
      ? role
      : "USER";
    if (validRole === "STORE_OWNER") {
      if (!storeId)
        return res
          .status(400)
          .json({ message: "A store is required for Store Owner users" });
      const { data: store, error: storeError } = await db
        .from("stores")
        .select("id,owner_id")
        .eq("id", storeId)
        .maybeSingle();
      if (storeError) throw storeError;
      if (!store)
        return res
          .status(400)
          .json({ message: "Selected store was not found" });
      if (store.owner_id)
        return res
          .status(409)
          .json({ message: "Selected store already has an owner" });
    }
    if (validRole !== "STORE_OWNER" && storeId)
      return res
        .status(400)
        .json({ message: "Only Store Owner users can be assigned a store" });
    const { data, error } = await db
      .from("users")
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        password: await bcrypt.hash(password, 12),
        address: address?.trim() || null,
        role: validRole,
      })
      .select()
      .single();
    if (error?.code === "23505")
      return res.status(409).json({ message: "Email already registered" });
    if (error) throw error;
    if (validRole === "STORE_OWNER") {
      const { data: assignedStore, error: assignError } = await db
        .from("stores")
        .update({ owner_id: data.id })
        .eq("id", storeId)
        .is("owner_id", null)
        .select("id")
        .maybeSingle();
      if (assignError || !assignedStore) {
        await db.from("users").delete().eq("id", data.id);
        if (assignError) throw assignError;
        return res
          .status(409)
          .json({ message: "Selected store already has an owner" });
      }
    }
    res.status(201).json({ message: "User created", user: safeUser(data) });
  } catch (error) {
    next(error);
  }
};
exports.getStores = async (req, res, next) => {
  try {
    const { page, limit } = pageValues(req.query);
    let query = db.from("stores").select("*");
    if (req.query.search)
      query = query.or(
        `name.ilike.%${req.query.search}%,email.ilike.%${req.query.search}%,address.ilike.%${req.query.search}%`,
      );
    const { data: all, error } = await query;
    if (error) throw error;
    const { data: ratings, error: ratingError } = await db
      .from("ratings")
      .select("store_id,rating");
    if (ratingError) throw ratingError;
    const mapped = all
      .map((store) => {
        const list = ratings.filter((rating) => rating.store_id === store.id);
        return {
          ...store,
          avgRating: list.length
            ? list.reduce((sum, rating) => sum + rating.rating, 0) / list.length
            : 0,
          totalRatings: list.length,
        };
      })
      .sort((a, b) => {
        const key =
          req.query.sort === "rating"
            ? "avgRating"
            : ["name", "email", "address"].includes(req.query.sort)
              ? req.query.sort
              : "name";
        const result = String(a[key] ?? "").localeCompare(
          String(b[key] ?? ""),
          undefined,
          { numeric: true },
        );
        return req.query.order === "desc" ? -result : result;
      });
    res.json({
      stores: pageSlice(mapped, page, limit).map((store) => ({
        id: store.id,
        name: store.name,
        email: store.email,
        address: store.address,
        ownerId: store.owner_id,
        avgRating: Number(store.avgRating.toFixed(2)),
        totalRatings: store.totalRatings,
      })),
      total: mapped.length,
    });
  } catch (error) {
    next(error);
  }
};
exports.createStore = async (req, res, next) => {
  try {
    const { name, email, address, ownerId } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const errors = validateStore({ name, email: normalizedEmail, address });
    if (!name || !email || errors.length)
      return res
        .status(400)
        .json({ message: errors[0] || "Name and email are required" });
    if (ownerId) {
      const { data: owner, error } = await db
        .from("users")
        .select("role")
        .eq("id", ownerId)
        .maybeSingle();
      if (error) throw error;
      if (!owner || owner.role !== "STORE_OWNER")
        return res
          .status(400)
          .json({ message: "Owner must be a Store Owner user" });
    }
    const { data, error } = await db
      .from("stores")
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        address: address?.trim() || null,
        owner_id: ownerId || null,
      })
      .select()
      .single();
    if (error?.code === "23505")
      return res
        .status(409)
        .json({ message: "Store email or owner is already assigned" });
    if (error) throw error;
    res.status(201).json({ message: "Store created", store: data });
  } catch (error) {
    next(error);
  }
};
