const express = require("express");
const router = express.Router();
// Load post controller
const post_controller = require("../controllers/postController");

// Create post
router.post("/new", post_controller.post_create);

// Read all posts
router.get("/all", post_controller.posts_read_all);

// Read post by ID
router.get("/:id", post_controller.post_read);

// Update post by ID
router.put("/:id", post_controller.post_update);

// Delete post by ID
router.delete("/:id", post_controller.post_delete);

module.exports = router;
