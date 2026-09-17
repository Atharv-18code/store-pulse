const bcrypt = require("bcryptjs");
const db = require("../utils/supabase");
const { validatePassword } = require("../utils/validation");
exports.updatePassword = async (req, res, next) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const errors = validatePassword(newPassword || "");
    if (!currentPassword || !newPassword || errors.length)
      return res.status(400).json({
        message: errors[0] || "Current and new password are required",
      });
    const { data: user, error } = await db
      .from("users")
      .select("password")
      .eq("id", req.user.id)
      .single();
    if (error) throw error;
    if (!(await bcrypt.compare(currentPassword, user.password)))
      return res.status(400).json({ message: "Current password is incorrect" });
    const { error: updateError } = await db
      .from("users")
      .update({ password: await bcrypt.hash(newPassword, 12) })
      .eq("id", req.user.id);
    if (updateError) throw updateError;
    res.json({ message: "Password updated successfully" });
  } catch (error) {
    next(error);
  }
};
