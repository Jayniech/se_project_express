const { Router } = require('express');

const { getUser, createUser, getUsers } = require('../controllers/users');

const router = new Router();

router.get('/', getUsers);
router.get('/:id', getUser);
router.post('/', createUser);

module.exports = router;