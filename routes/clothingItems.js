const { Router } = require("express");

const auth = require("../middleware/auth");

const { validateClothingItemBody, validateId } = require("../middleware/validation")

const {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
} = require("../controllers/clothingItems");

const router = new Router();

router.get("/", getClothingItems);
router.post("/", auth, validateClothingItemBody, createClothingItem);
router.put("/:itemId/likes", auth, validateId("itemId"), likeItem);
router.delete("/:itemId/likes", auth, validateId("itemId"), dislikeItem);
router.delete("/:id", auth, validateId("id"), deleteClothingItem);

module.exports = router;
