const router = require("express").Router();
const { getDashboard } = require("../controllers/ownerController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.use(auth, role("STORE_OWNER"));
router.get("/dashboard", getDashboard);

module.exports = router;
