const mongoose = require("mongoose");
const Post = require("../models/Post");
const { body, validationResult } = require("express-validator");

exports.posts_read_all = function (req, res) {
    Post.find()
        .sort({ publishedAt: -1 })
        .exec(function (err, posts) {
            if (err) return res.json(err);
            if (posts.length === 0) {
                return res.json({ error: "No post has been written yet." });
            }
            res.json(posts);
        });
};

exports.post_read = function (req, res) {
    Post.findById(req.params.id).exec(function (err, post) {
        if (err) return res.json({ err });
        if (!post) {
            return res.json({ error: "No post found" });
        }
        res.json(post);
    });
};

exports.post_create = [
    body("title")
        .isLength({ min: 1 })
        .withMessage("Title must be specified.")
        .trim(),
    body("text")
        .isLength({ min: 1 })
        .withMessage("Text must be specified.")
        .trim(),

    function (req, res) {
        const errors = validationResult(req);

        var post = new Post({
            title: req.body.title,
            text: req.body.text,
        });

        if (!errors.isEmpty()) {
            res.json({ post, errors });
        } else {
            post.save(function (err) {
                if (err) return res.json(err);
                res.json(post);
            });
        }
    },
];

exports.post_update = [
    body("title")
        .isLength({ min: 1 })
        .withMessage("Title must be specified.")
        .trim(),
    body("text")
        .isLength({ min: 1 })
        .withMessage("Text must be specified.")
        .trim(),

    function (req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            res.json({ errors });
        } else {
            Post.findByIdAndUpdate(
                req.params.id,
                {
                    title: req.body.title,
                    text: req.body.text,
                    publishedAt: new Date(),
                },
                { new: true },
                function (err, post) {
                    if (err)
                        return res.json({ message: "Post not found", err });
                    res.json({
                        message: "The post have been updated successfully.",
                        post,
                    });
                }
            );
        }
    },
];

exports.post_delete = function (req, res) {
    Post.findByIdAndDelete(req.params.id).exec(function (err, post) {
        if (err) return res.json(err);
        res.json({
            message: `Post ${post._id} has been successfully deleted!`,
        });
    });
};
