const { Router } = require("express");

const { getCurrentUser, updateProfile } = require("../controllers/users");

const { validateUpdateProfile } = require("../middleware/validation")

const router = new Router();

router.get("/me", getCurrentUser);
router.patch("/me", validateUpdateProfile, updateProfile);

module.exports = router;
