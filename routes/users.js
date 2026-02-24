const { Router } = require("express");

const { getCurrentUser, } = require("../controllers/users");

const router = new Router();

router.get("/me", getCurrentUser);

module.exports = router;
