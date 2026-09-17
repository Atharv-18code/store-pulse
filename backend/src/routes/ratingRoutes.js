const router = require("express").Router();
const {
  submitRating,
  updateRating,
  getMyRating,
} = require("../controllers/ratingController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.use(auth, role("USER"));

router.post("/", submitRating);
router.put("/:storeId", updateRating);
router.get("/my/:storeId", getMyRating);

module.exports = router;
