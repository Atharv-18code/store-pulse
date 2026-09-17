const router = require("express").Router();
const ctrl = require("../controllers/adminController");
const auth = require("../middleware/authMiddleware");
const role = require("../middleware/roleMiddleware");

router.use(auth, role("ADMIN"));

router.get("/dashboard", ctrl.getDashboard);
router.get("/users", ctrl.getUsers);
router.post("/users", ctrl.createUser);
router.get("/users/:id", ctrl.getUserById);
router.get("/stores", ctrl.getStores);
router.post("/stores", ctrl.createStore);

module.exports = router;
