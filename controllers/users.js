const User = require("../models/user");
const { badRequest, serverError, notFound, conflictError } = require("../utils/errors");
const bcrypt = require('bcryptjs');

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
  const { name, avatar, email, password } = req.body;
  bcrypt.hash(req.body.password, 10)
  .then((hash) => {
    return User.create({ name, avatar, email, password: hash });
  })
  .then((user) => res.send({ data: user }))
  .catch((err) => {
    if (err.name === "ValidationError") {
      res.status(badRequest).send({ message: "Validation failed" });
    } else if(err.code === 11000){
      res.status(conflictError).send({ message: "That email is already being used."})
    } else {
      res
        .status(serverError)
        .send({ message: "An error has occurred on the server." });
    }
  });
};

const login = () => {

};

module.exports = { getUsers, getUser, createUser, login };
