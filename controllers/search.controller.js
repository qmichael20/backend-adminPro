const { response } = require("express");

const User = require("../models/user.model");
const Hospital = require("../models/hospital.model");
const Doctor = require("../models/doctor.model");

const getAll = async (req, res = response) => {
  const { term } = req.params;

  const regex = new RegExp(term, "i");

  const [users, hospitals, doctors] = await Promise.all([
    User.find({ name: regex }),
    Hospital.find({ name: regex }),
    Doctor.find({ name: regex }),
  ]);

  res.json({
    ok: true,
    users,
    hospitals,
    doctors,
  });
};

const getDocuments = async (req, res = response) => {
  const { collection, term } = req.params;
  const regex = new RegExp(term, "i");

  let data = [];

  switch (collection) {
    case "users":
      data = await User.find({ name: regex });

      break;
    case "doctors":
      data = await Doctor.find({ name: regex })
        .populate("user", "name img")
        .populate("hospital", "name img");
      break;

    case "hospitals":
      data = await Hospital.find({ name: regex }).populate("user", "name img");
      break;

    default:
      return res.status(400).json({
        ok: false,
        msg: "Invalid collection, must be one of: users, doctors, hospitals",
      });
  }

  return res.json({
    ok: true,
    results: data,
  });
};

module.exports = { getAll, getDocuments };
