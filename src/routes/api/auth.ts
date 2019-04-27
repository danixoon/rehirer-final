import * as bcrypt from "bcrypt";
import * as config from "config";
import { Router } from "express";
import User from "../../models/User";
import * as jwt from "jsonwebtoken";
import auth from "../../middleware/auth";

const router = Router();

// @route POST api/auth
// @decs Auth User
// @access Public
router.post("/", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) return res.status(400).json({ msg: "Please enter all fields" });

  User.findOne({ email }).then((user: any) => {
    if (!user) return res.status(400).json({ msg: "User doesn't exists" });
    //Validate Passwords
    bcrypt.compare(password, user.password).then(isMatch => {
      if (!isMatch) return res.status(400).json({ msg: "Invalid credentials" });

      jwt.sign(
        {
          id: user.id
        },
        config.get("jwtSecret"),
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

// @route GET api/auth/user
// @decs Get User Data
// @access Private
router.get("/user", auth, (req: any, res) => {
  User.findById(req.user.id)
    .select("-password")
    .then(user => res.send(user));
});
export default router;
