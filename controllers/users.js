const User = require('../models/user');

const getUsers = (req, res) => {
  User.find()
  .then((data) => {
    res.send(data);
  })
  .catch(err => res.status(500).send({ message: 'Error' }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
  .then()
  .catch();
};

module.exports = { getUsers, getUser };