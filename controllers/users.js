const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const BadRequestError = require("../utils/errors/BadRequestError");
const NotFoundError = require("../utils/errors/NotFoundError");

const {
  badRequest,
  serverError,
  notFound,
  conflictError,
  unauthorized,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getCurrentUser = (req, res, next) => {
  User.findById(req.user._id)
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch(() => {
      return next(new NotFoundError("User not found"));
    });
};

const createUser = (req, res, next) => {
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
      next(err);
    });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Please enter email and password"));
  } else {
    User.findUserByCredentials(email, password)
      .then((user) => {
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.send({ token });
      })
      .catch((err) => {
        next(err);
      });
  }
};

const updateProfile = (req, res, next) => {
  const { name, avatar } = req.body;
  User.findByIdAndUpdate(
    req.user._id,
    { name, avatar },
    { new: true, runValidators: true }
  )
    .orFail()
    .then((user) => {
      res.send({ data: user });
    })
    .catch((err) => {
      if(err.name === "ValidationError"){
        return next(new BadRequestError("Invalid data passed for updating profile"));
        // err.statusCode = badRequest;
      }
      if(err.name === "DocumentNotFoundError"){
        return next(new NotFoundError("User not found"));
        // err.statusCode = notFound;
      }
      next(err);
    });
};

module.exports = { getCurrentUser, createUser, login, updateProfile };
