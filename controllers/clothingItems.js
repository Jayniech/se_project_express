const ClothingItem = require('../models/clothingItem');
const { badRequest, serverError, notFound } = require('../utils/errors');


const getClothingItems = (req, res) => {
  ClothingItem.find()
  .then(data => {
    res.send(data);
  })
  .catch(() => res.status(serverError).send({ message: 'An error has occurred on the server.' }));
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;

  if (!name || !weather || !imageUrl || !owner) {
    return res.status(badRequest).send({ message: 'Name, weather, image and ID are required.' });
  }

  return ClothingItem.create({ name, weather, imageUrl, owner })
  .then(item => res.status(201).send({ data: item }))
  .catch(() => res.status(serverError).send({ message: 'An error has occurred on the server.' }));
};

const deleteClothingItem = (req, res) => {
  ClothingItem.findByIdAndDelete(req.params.id)
  .then(item => {
    if (!item) {
      return res.status(notFound).send({ message: 'Clothing item not found.' });
    }
    return res.send({ data: item });
    })
  .catch(() => res.status(serverError).send({ message: 'An error has occurred on the server.' }));
};

module.exports = { getClothingItems, createClothingItem, deleteClothingItem };
