const ClothingItem = require("../models/clothingItem");
const ForbiddenError = require("../utils/errors/ForbiddenError");

const getClothingItems = (req, res, next) => {
  ClothingItem.find()
    .then((data) => {
      res.send(data);
    })
    .catch((err) => {
      next(err);
    });
};

const createClothingItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      next(err);
    });
};

const deleteClothingItem = (req, res, next) => {
  const owner = req.user._id;
  ClothingItem.findById(req.params.id)
    .orFail()
    .then((item) => {
      if (owner !== item.owner.toString()) {
        return next(new ForbiddenError("Clothing item cannot be deleted"));
      } else {
        ClothingItem.findByIdAndDelete(req.params.id)
          .orFail()
          .then((deleted) => {
            res.send({ data: deleted });
          })
          .catch((err) => {
            next(err);
          });
      }
    })
    .catch((err) => {
      next(err);
    });
};

const likeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((like) => {
      res.send({ data: like });
    })
    .catch((err) => {
      next(err);
    });
};

const dislikeItem = (req, res, next) => {
  ClothingItem.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((like) => {
      res.send({ data: like });
    })
    .catch((err) => {
      next(err);
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
