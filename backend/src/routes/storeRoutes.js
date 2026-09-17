const router = require("express").Router();
const { getStores, getStore } = require("../controllers/storeController");
const auth = require("../middleware/authMiddleware");

router.get("/", auth, getStores);
router.get("/:id", getStore);

module.exports = router;
