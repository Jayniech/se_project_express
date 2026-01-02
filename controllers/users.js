const User = require('./user');

const getUsers = (req, res) => {
  User.find()
  .then((data) => {
    res.send(data);
  })
  .catch(err => res.status(500).send({ message: 'Error' }));
};

module.exports = { getUsers };