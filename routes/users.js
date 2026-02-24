const { Router } = require("express");

const { getCurrentUser, updateProfile } = require("../controllers/users");

const router = new Router();

router.get("/me", getCurrentUser);
router.patch("/me", updateProfile);

module.exports = router;
