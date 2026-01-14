const User = require("../models/user");
const { badRequest, serverError, notFound } = require("../utils/errors");

const getUsers = (req, res) => {
  User.find()
    .then((data) => {
      res.send(data);
    })
    .catch(() =>
      res
        .status(serverError)
        .send({ message: "An error has occurred on the server." })
    );
};

const getUser = (req, res) => {
  User.findById(req.params.userId)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if (err.name === "CastError") {
        res.status(badRequest).send({ message: "Validation failed" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(notFound).send({ message: "User not found" });
      } else {
        res
          .status(serverError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.send({ data: user }))
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

module.exports = { getUsers, getUser, createUser };
