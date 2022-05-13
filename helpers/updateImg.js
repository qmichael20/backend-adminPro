const fs = require("fs");

const User = require("../models/user.model");
const Doctor = require("../models/doctor.model");
const Hospital = require("../models/hospital.model");

const deleteImage = (path) => {
  if (fs.existsSync(path)) {
    fs.unlinkSync(path);
  }
};

let lastPath = "";

const updateImg = async (type, id, path, fileName) => {
  switch (type) {
    case "users":
      const users = await User.findById(id);

      if (!users) {
        console.log("No users found");
        return false;
      }

      lastPath = `./uploads/users/${users.img}`;

      deleteImage(lastPath);

      users.img = fileName;

      await users.save();

      return true;
    case "doctors":
      const doctors = await Doctor.findById(id);

      if (!doctors) {
        console.log("No doctors found");
        return false;
      }

      lastPath = `./uploads/doctors/${doctors.img}`;

      deleteImage(lastPath);

      doctors.img = fileName;

      await doctors.save();

      return true;

    case "hospitals":
      const hospitals = await Hospital.findById(id);

      if (!hospitals) {
        console.log("No hopitals found");
        return false;
      }

      lastPath = `./uploads/hospitals/${hospitals.img}`;

      deleteImage(lastPath);

      hospitals.img = fileName;

      await hospitals.save();

      return true;
  }
};

module.exports = { updateImg };
