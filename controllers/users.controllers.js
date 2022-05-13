const { response } = require("express");
const bcrypt = require("bcryptjs");

const User = require("../models/user.model");
const { generateJWT } = require("../helpers/jwt");
const { query } = require("express");

const getUsers = async (req, res = response) => {
  const since = Number(req.query.since) || 0;

  const [users, total] = await Promise.all([
    User.find({}, "name email role google img").skip(since).limit(5),
    User.countDocuments(),
  ]);

  res.json({
    ok: true,
    id: req.id,
    total,
    users,
  });
};

const createUser = async (req, res = response) => {
  const { name, email, password } = req.body;

  try {
    if (await User.findOne({ email })) {
      return res.status(400).json({
        ok: false,
        msg: "User already exists",
      });
    }

    const user = new User({ name, email, password });

    //encrypt password
    const salt = bcrypt.genSaltSync();
    user.password = bcrypt.hashSync(password, salt);

    await user.save();

    const token = await generateJWT(user.id);

    res.status(200).json({
      ok: true,
      user,
      token,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error creating user",
    });
  }
};

const updateUser = async (req, res = response) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }

    const { password, google, email, ...fields } = req.body;

    if (user.email !== email) {
      if (await User.findOne({ email })) {
        return res.status(400).json({
          ok: false,
          msg: "User already exists",
        });
      }
    }

    if (!user.google) {
      fields.email = email;
    } else if (user.email !== email) {
      return res.status(400).json({
        ok: false,
        msg: "Google user can't change email",
      });
    }

    const updatedUser = await User.findByIdAndUpdate(id, fields, { new: true });

    res.status(200).json({
      ok: true,
      user: updatedUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error updating user",
    });
  }
};

const deleteUser = async (req, res = response) => {
  const id = req.params.id;

  try {
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({
        ok: false,
        msg: "User not found",
      });
    }

    await User.findByIdAndDelete(id);

    res.status(200).json({
      ok: true,
      msg: "User deleted",
      id,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      ok: false,
      msg: "Error deleting user",
    });
  }
};

module.exports = { getUsers, createUser, updateUser, deleteUser };
