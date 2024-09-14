const {
  bookSlotController,
  registerUser,
  googleLogin,
} = require("../controllers/userController");

const router = require("express").Router();

router.post("/register", registerUser);
router.post("/book-slots", bookSlotController);
router.get("/auth/google", googleLogin);
module.exports = router;
