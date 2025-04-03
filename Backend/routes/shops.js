const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");

const {
  getShop,
  getShops,
  createShop,
  updateShop,
  deleteShop,
} = require("../controllers/shops");

const reservationRouter = require("./reservations");

router.use(
  "/:shopId/reservations/",
  protect,
  authorize("admin", "user"),
  reservationRouter
); // Get all reservation from that shop only for admin

// Protect is used to check if the user is logged in
// authorize checks if the user has the required role
router.get("/", getShops);
router.get("/:id", getShop);
router.post("/", protect, authorize("admin"), createShop);
router.put("/:id", protect, authorize("admin"), updateShop);
router.delete("/:id", protect, authorize("admin"), deleteShop);

module.exports = router;
