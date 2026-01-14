const { Router } = require("express");

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const router = new Router();

router.get("/", getClothingItems);
router.post("/", createClothingItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", dislikeItem);
router.delete("/:id", deleteClothingItem);

module.exports = router;
