const express = require("express");
const router = express.Router();
// Load user controller
const user_controller = require("../controllers/userController");
const auth = require("../config/auth");

router.post("/new", user_controller.user_create);

router.get("/all", user_controller.users_read_all);

router.post("/login", user_controller.user_login);

// Change all routes with id by the variable passed by the middleware
router.get("/:id", auth.isAuthenticate, user_controller.user_read);

router.put("/:id", user_controller.user_update);

router.delete("/:id", user_controller.user_delete);

module.exports = router;
