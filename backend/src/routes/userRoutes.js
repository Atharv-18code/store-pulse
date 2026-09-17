const router = require("express").Router();
const { updatePassword } = require("../controllers/userController");
const auth = require("../middleware/authMiddleware");

router.put("/password", auth, updatePassword);

module.exports = router;
