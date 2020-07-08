const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { body, validationResult } = require("express-validator");

exports.users_read_all = function (req, res) {
    User.find().exec(function (err, users) {
        if (err) throw err;
        if (users.length === 0) {
            return res.json({ error: "No user has been registered yet" });
        }
        res.json({ users });
    });
};

exports.user_read = function (req, res) {
    User.findById(req.params.id).exec(function (err, user) {
        if (err) return res.json({ err, error: "User not found" });
        res.json({ user });
    });
};

exports.user_create = [
    // Validation & sanitization
    body("username")
        .isLength({ min: 1 })
        .withMessage("A username must be specified.")
        .trim()
        .escape(),
    body("email")
        .isLength({ min: 1 })
        .withMessage("A password must be specified.")
        .isEmail()
        .withMessage("Email syntax incorrect.")
        .trim()
        .escape(),
    body("password")
        .isAlphanumeric()
        .withMessage("A password must be specified.")
        .isLength({ min: 1 })
        .withMessage("A password must be specified.")
        .trim()
        .escape(),

    function (req, res) {
        const errors = validationResult(req);

        var newUser = new User({
            username: req.body.username,
            email: req.body.email,
        });

        User.findOne({ email: req.body.email }).exec(function (err, user) {
            if (err) return res.json({ err });
            // Verify if user already exist
            if (user) {
                return res.json({
                    error: "This email already have an account.",
                });
            } else {
                // Verify errors on body
                if (!errors.isEmpty()) {
                    return res.json({
                        errors: errors,
                    });
                } else {
                    // Hash the password before saving the user
                    bcrypt.hash(req.body.password, 10, function (
                        err,
                        hashedPassword
                    ) {
                        if (err) return res.json(err);
                        newUser.password = hashedPassword;

                        newUser.save(function (err) {
                            if (err) return res.json(err);

                            res.json(newUser);
                        });
                    });
                }
            }
        });
    },
];

exports.user_login = [
    body("email")
        .isLength({ min: 1 })
        .withMessage("A password must be specified.")
        .isEmail()
        .withMessage("Email syntax incorrect.")
        .trim()
        .escape(),
    body("password")
        .isLength({ min: 1 })
        .withMessage("A password must be specified.")
        .trim()
        .escape(),

    function (req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json({ errors });
        } else {
            User.findOne({ email: req.body.email }).exec(function (err, user) {
                if (err) return res.json(err);

                if (!user) {
                    return res.json({ error: "User not found" });
                } else {
                    bcrypt.compare(req.body.password, user.password, function (
                        err,
                        result
                    ) {
                        if (err)
                            return res.json({ error: "Password incorrect" });

                        jwt.sign({ user }, process.env.TOKEN_SECRET, function (
                            err,
                            token
                        ) {
                            if (err) return res.json(err);

                            res.json({ user, token: token });
                        });
                    });
                }
            });
        }
    },
];

exports.user_update = [
    // Validation & sanitization
    body("username")
        .isLength({ min: 1 })
        .withMessage("A username must be specified.")
        .trim()
        .escape(),
    body("email")
        .isLength({ min: 1 })
        .withMessage("A mail must be specified.")
        .isEmail()
        .withMessage("Email syntax incorrect.")
        .trim()
        .escape(),

    function (req, res) {
        const errors = validationResult(req);

        if (!errors.isEmpty()) {
            return res.json({
                errors,
            });
        } else {
            User.findOne({ email: req.body.email }).exec(function (err, user) {
                if (err) return res.json(err);
                if (user) {
                    return res.json({
                        error: "This email already have an account.",
                    });
                } else {
                    User.findOneAndUpdate(
                        req.params.id,
                        { email: req.body.email, username: req.body.username },
                        { new: true },
                        function (err, newUser) {
                            if (err) return res.json(err);
                            res.json(newUser);
                        }
                    );
                }
            });
        }
    },
];

exports.user_delete = function (req, res) {
    User.findByIdAndDelete(req.params.id).exec(function (err, user) {
        if (err) return res.json(err);
        res.json({
            message: `User (${user.username}) have been successfully deleted!`,
        });
    });
};
