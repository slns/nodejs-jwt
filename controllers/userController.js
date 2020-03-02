const router = require("express").Router();
const mongoose = require("mongoose");
//const authMiddleware = require("../middleware/auth");
const expressJwt = require('express-jwt');
//const blacklist = require("express-jwt-blacklist");
const auth = require('../middleware/auth');

const jwtMiddleWare = expressJwt({
  secret: process.env.TOKEN_KEY
});

const User = mongoose.model("User");

// router.use(expressJwt({
//   secret: process.env.TOKEN_KEY,
//   isRevoked: blacklist.isRevoked
// }));

router.post("/register", async (req, res) => {
  const { email, username } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({ error: "User already exists" });
    }

    const user = await User.create(req.body);

    return res.json({ user });
  } catch (err) {
    return res.status(400).json({ error: "User registration failed" });
  }
});

router.post("/authenticate", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    if (!(await user.compareHash(password))) {
      return res.status(400).json({ error: "Invalid password" });
    }

    return res.json({
      user,
      token: User.generateToken(user)
    });
  } catch (err) {
    return res.status(400).json({ error: "User authentication failed" });
  }
});

//router.use(authMiddleware);

// router.get("/me", async (req, res) => {
//   try {
//     const { userId } = req;

//     const user = await User.findById(userId);

//     return res.json({ user });
//   } catch (err) {
//     return res.status(400).json({ error: "Can't get user information" });
//   }
// });

// router.get('/logout', function (req, res) {
//   //console.log('REQ  ',req.headers.authorization)
//   blacklist.revoke(req.headers.authorization);
//   res.sendStatus(200);
// });

// router.get("/me", jwtMiddleWare, async (req, res) => {
//   try {
//     const { user } = req;
//     const userDB = await User.findById(user.id);

//     return res.json({ userDB });
//   } catch (err) {
//     return res.status(400).json({ error: "Can't get user information" });
//   }
// });

router.get("/me", auth.checkToken, async (req, res) => {
  console.log('MEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEEE?');
  try {
    const { user } = req;
    const userDB = await User.findById(user.id);
    console.log('userDB ', userDB);

    return res.json({ userDB });
  } catch (err) {
    return res.status(400).json({ error: "Can't get user information" });
  }
});

module.exports = router;
