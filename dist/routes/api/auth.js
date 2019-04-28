"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = require("bcrypt");
const config = require("config");
const express_1 = require("express");
const User_1 = require("../../models/User");
const jwt = require("jsonwebtoken");
const auth_1 = require("../../middleware/auth");
const router = express_1.Router();
// @route POST api/auth
// @decs Auth User
// @access Public
router.post("/", (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ msg: "Please enter all fields" });
    User_1.default.findOne({ email }).then((user) => {
        if (!user)
            return res.status(400).json({ msg: "User doesn't exists" });
        //Validate Passwords
        bcrypt.compare(password, user.password).then(isMatch => {
            if (!isMatch)
                return res.status(400).json({ msg: "Invalid credentials" });
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
// @route GET api/auth/user
// @decs Get User Data
// @access Private
router.get("/user", auth_1.default, (req, res) => {
    User_1.default.findById(req.user.id)
        .select("-password")
        .then(user => res.send(user));
});
exports.default = router;
