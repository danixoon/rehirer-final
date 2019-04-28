import * as bcrypt from "bcrypt";
// import * as config from "config";
import { Router } from "express";
import User from "../../models/User";
import * as jwt from "jsonwebtoken";

const router = Router();

// @route POST api/user
// @decs Create A New User
// @access Public

router.post("/", (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) return res.status(400).json({ msg: "Please enter all fields" });

  User.findOne({ email }).then(user => {
    if (user) return res.status(400).json({ msg: "User already exists" });
    const newUser = new User({
      email,
      name,
      password
    }) as any;
    bcrypt.genSalt(10, (err, salt) => {
      if (err) throw err;
      bcrypt.hash(newUser.password, salt, (err, hash) => {
        if (err) throw err;
        newUser.password = hash;
        newUser.save().then(user => {
          jwt.sign(
            {
              id: user.id
            },
            process.env.JWT_SECRET,
            { expiresIn: 3600 },
            (err, token) => {
              if (err) throw err;
              res.json({
                token,
                user: {
                  id: user.id,
                  name: user.name,
                  email: user.email
                }
              });
            }
          );
        });
      });
    });
  });
});

export default router;
