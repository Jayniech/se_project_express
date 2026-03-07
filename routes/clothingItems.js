const { Router } = require("express");

const auth = require("../middlewares/auth")

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const router = new Router();

router.get("/", getClothingItems);
router.post("/", auth, createClothingItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, dislikeItem);
router.delete("/:id", auth, deleteClothingItem);

module.exports = router;
