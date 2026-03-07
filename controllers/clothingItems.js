const ClothingItem = require("../models/clothingItem");
const { badRequest, serverError, notFound } = require("../utils/errors");
const { forbidden } = require("../utils/errors");

const getClothingItems = (req, res) => {
  ClothingItem.find()
    .then((data) => {
      res.send(data);
    })
    .catch(() =>
      res
        .status(serverError)
        .send({ message: "An error has occurred on the server." })
    );
};

const createClothingItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;
  const owner = req.user._id;
  ClothingItem.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(badRequest).send({ message: "Validation failed" });
      } else {
        res
          .status(serverError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const deleteClothingItem = (req, res) => {
  const owner = req.user._id;
  ClothingItem.findById(req.params.id)
  .orFail()
  .then((item) => {
    if (owner !== item.owner.toString()) {
      res.status(forbidden).send({ message: "Clothing item cannot be deleted."});
    } else {
      ClothingItem.findByIdAndDelete(req.params.id)
      .orFail()
      .then((deleted) => {
        res.send({ data: deleted });
      })
      .catch((err) => {
        if (err.name === "DocumentNotFoundError") {
          res.status(notFound).send({ message: "Clothing item not found" });
        } else if (err.name === "CastError") {
          res.status(badRequest).send({ message: "Validation failed" });
        } else {
          res
            .status(serverError)
            .send({ message: "An error has occurred on the server." });
        }
      });
    }
  })
  .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(notFound).send({ message: "Clothing item not found" });
      } else if (err.name === "CastError") {
        res.status(badRequest).send({ message: "Validation failed" });
      } else {
        res
          .status(serverError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const likeItem = (req, res) => {
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
      if (err.name === "CastError") {
        res.status(badRequest).send({ message: "Validation failed" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(notFound).send({ message: "Clothing item not found" });
      } else {
        res
          .status(serverError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const dislikeItem = (req, res) => {
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
      if (err.name === "DocumentNotFoundError") {
        res.status(notFound).send({ message: "Clothing item not found" });
      } else if (err.name === "CastError") {
        res.status(badRequest).send({ message: "Validation failed" });
      } else {
        res
          .status(serverError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

module.exports = {
  getClothingItems,
  createClothingItem,
  deleteClothingItem,
  likeItem,
  dislikeItem,
};
