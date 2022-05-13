const { response } = require("express");
const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const { generateJWT } = require("../helpers/jwt");
const { googleVerify } = require("../helpers/google-verify");

const login = async (req, res = response) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "Invalid credentials",
      });
    }

    //Verify password
    const validPassword = bcrypt.compareSync(password, user.password);

    if (!validPassword) {
      return res.status(400).json({
        ok: false,
        msg: "Invalid credentials",
      });
    }

    //Generate token
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Error in login",
    });
  }
};

const loginGoogle = async (req, res = response) => {
  const googleToken = req.body.token;

  try {
    const { name, email, picture } = await googleVerify(googleToken);

    const userDB = await User.findOne({ email });

    let user;

    if (!userDB) {
      user = new User({
        name,
        email,
        password: ":)",
        img: picture,
        google: true,
      });
    } else {
      user = userDB;
      user.google = true;
      user.img = picture;
    }

    await user.save();

    //Generate token
    const token = await generateJWT(user.id);

    res.json({
      ok: true,
      token,
    });
  } catch (error) {
    console.log(error);
    return res.status(401).json({
      ok: false,
      msg: "Invalid token",
    });
  }
};

const renewToken = async (req, res = response) => {
  const id = req.id;

  const token = await generateJWT(id);

  const user = await User.findById(id);

  res.json({
    ok: true,
    token,
    user,
  });
};

module.exports = { login, loginGoogle, renewToken };
