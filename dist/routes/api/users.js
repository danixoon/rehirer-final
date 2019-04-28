"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const config = require("config");
const express_1 = require("express");
const User_1 = require("../../models/User");
const jwt = require("jsonwebtoken");
const router = express_1.Router();
// @route POST api/user
// @decs Create A New User
// @access Public
router.post("/", (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
        return res.status(400).json({ msg: "Please enter all fields" });
    User_1.default.findOne({ email }).then(user => {
        if (user)
            return res.status(400).json({ msg: "User already exists" });
        const newUser = new User_1.default({
            email,
            name,
            password
        });
        bcrypt.genSalt(10, (err, salt) => {
            if (err)
                throw err;
            bcrypt.hash(newUser.password, salt, (err, hash) => {
                if (err)
                    throw err;
                newUser.password = hash;
                newUser.save().then(user => {
                    jwt.sign({
                        id: user.id
                    }, config.get("jwtSecret"), { expiresIn: 3600 }, (err, token) => {
                        if (err)
                            throw err;
                        res.json({
                            token,
                            user: {
                                id: user.id,
                                name: user.name,
                                email: user.email
                            }
                        });
                    });
                });
            });
        });
    });
});
exports.default = router;
