const ClothingItem = require('../models/clothingItem');

const getClothingItems = (req, res) => {
  ClothingItem.find()
  .then(data => {
    res.send(data);
  })
  .catch(() => res.status(500).send({ message: 'Requested resource not found' }));
}

const createClothingItem = (req, res) => {
  const { name, weatherType, imageUrl, userId} = req.body;
  ClothingItem.create({ name, weatherType, imageUrl, userId})
  .then(item => res.status(201).send({ data: item }))
  .catch(() => res.status(400).send({ message: 'Clothing item not created' }));
}

module.exports = { getClothingItems, createClothingItem };
