const User = require('../models/user');

const getUsers = (req, res) => {
  User.find()
  .then(data => {
    res.send(data);
  })
  .catch(() => res.status(500).send({ message: 'Requested resource not found' }));
};

const getUser = (req, res) => {
  User.findById(req.params.id)
  .then(user => {
    if (!user) {
      return res.status(404).send({ message: 'User not found' });
    }
    return res.send({ data: user });
  })
  .catch(() => res.status(500).send({ message: 'Requested resource not found' }));
};

const createUser = (req, res) => {
  const { name, avatar } = req.body;

  User.create({ name, avatar })
  .then(user => res.send({ data: user }))
  .catch(() => res.status(400).send({ message: 'User not created' }));
};

module.exports = { getUsers, getUser, createUser };