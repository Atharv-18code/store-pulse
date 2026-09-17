const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../utils/supabase");
const { validateUser, validatePassword } = require("../utils/validation");
const safeUser = (user) => ({
  id: user.id,
  name: user.name,
  email: user.email,
  address: user.address,
  role: user.role,
});
const tokenFor = (user) =>
  jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || "7d" },
  );

exports.register = async (req, res, next) => {
  try {
    const { name, email, password, address } = req.body;
    const normalizedEmail = String(email || "")
      .trim()
      .toLowerCase();
    const errors = validateUser({ name, email: normalizedEmail, address });
    errors.push(...validatePassword(password || ""));
    if (!name || !email || !password || errors.length)
      return res.status(400).json({
        message: errors[0] || "Name, email, and password are required",
      });
    const { data: existing, error: findError } = await db
      .from("users")
      .select("id")
      .eq("email", normalizedEmail)
      .maybeSingle();
    if (findError) throw findError;
    if (existing)
      return res.status(409).json({ message: "Email already registered" });
    const hashed = await bcrypt.hash(password, 12);
    const { data, error } = await db
      .from("users")
      .insert({
        name: name.trim(),
        email: normalizedEmail,
        password: hashed,
        address: address?.trim() || null,
        role: "USER",
      })
      .select()
      .single();
    if (error) throw error;
    res
      .status(201)
      .json({ message: "Account created successfully", user: safeUser(data) });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res
        .status(400)
        .json({ message: "Email and password are required" });
    const { data: user, error } = await db
      .from("users")
      .select("*")
      .eq("email", String(email).trim().toLowerCase())
      .maybeSingle();
    if (error) throw error;
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: "Invalid email or password" });
    res.json({ token: tokenFor(user), user: safeUser(user) });
  } catch (error) {
    next(error);
  }
};
exports.logout = (req, res) => res.json({ message: "Logged out successfully" });
