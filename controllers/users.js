const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  badRequest,
  serverError,
  notFound,
  conflictError,
  unauthorized,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

// const getUsers = (req, res) => {
//   User.find()
//     .then((data) => {
//       res.send(data);
//     })
//     .catch(() =>
//       res
//         .status(serverError)
//         .send({ message: "An error has occurred on the server." })
//     );
// };

const getCurrentUser = (req, res) => {
  User.findById(req.user)
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
  bcrypt
    .hash(password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObject = user.toObject();
      delete userObject.password;
      res.status(201).send(userObject);
    })
    .catch((err) => {
      if (err.name === "ValidationError") {
        res.status(badRequest).send({ message: "Validation failed" });
      } else if (err.code === 11000) {
        res
          .status(conflictError)
          .send({ message: "That email is already being used." });
      } else {
        res
          .status(serverError)
          .send({ message: "An error has occurred on the server." });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    res.status(badRequest).send({ message: "Please enter email and password" });
  } else {
    User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
        expiresIn: "7d",
      });
      res.send({ token });
    })
    .catch((err) => {
      res.status(unauthorized).send({ message: err.message });
    });
  }
};

const updateProfile = (req, res) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(req.user, { name, avatar }, { new: true, runValidators: true })
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

module.exports = { getCurrentUser, createUser, login, updateProfile };
