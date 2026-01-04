const { Router } = require("express");

const { getClothingItems, createClothingItem, deleteClothingItem } = require('../controllers/clothingItems');

const router = new Router();

router.get('/', getClothingItems);
router.post('/', createClothingItem);
router.delete('/:id', deleteClothingItem);

module.exports = router;