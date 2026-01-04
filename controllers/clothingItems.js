const ClothingItem = require('../models/clothingItem');

const getClothingItems = (req, res) => {
  ClothingItem.find()
  .then(data => {
    res.send(data);
  })
  .catch(() => res.status(500).send({ message: 'Requested resource not found' }));
}

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
  .then(item => res.status(201).send({ data: item }))
  .catch(() => res.status(400).send({ message: 'Clothing item not created' }));
}

const deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
  .then(item => {
    if (!item) {
      return res.status(404).send({ message: 'Clothing item not found' });
    }
     return res.send({ data: item });
    })
  .catch(() => res.status(500).send({ message: 'Requested resource not found' }));
}

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };
