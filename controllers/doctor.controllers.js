const { response } = require("express");

const Doctor = require("../models/doctor.model");

const getDoctors = async (req, res = response) => {
  //populate para traer el usuario y hospital
  const doctors = await Doctor.find()
    .populate("user", "name img")
    .populate("hospital", "name img");

  try {
    res.json({
      ok: true,
      doctors,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Doctor not found",
    });
  }
};

const createDoctor = async (req, res = response) => {
  const { id } = req;

  const doctor = new Doctor({
    user: id,
    ...req.body,
  });

  try {
    const doctorSaved = await doctor.save();

    res.json({
      ok: true,
      doctor: doctorSaved,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Doctor not created",
    });
  }
};

const updateDoctor = async (req, res = response) => {
  const { id } = req.params;
  const { id: idUser } = req.id;

  try {
    const doctor = Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        ok: false,
        msg: "Doctor not found",
      });
    }

    const changeDoctor = {
      ...req.body,
      user: idUser,
    };

    const doctorUpdated = await Doctor.findByIdAndUpdate(id, changeDoctor, {
      new: true,
    });

    return res.json({
      ok: true,
      doctor: doctorUpdated,
    });
  } catch (error) {
    console.log(error);

    return res.status(500).json({
      ok: false,
      msg: "Doctor not updated",
    });
  }
};

const deleteDoctor = async (req, res = response) => {
  const { id } = req.params;
  try {
    const doctor = Doctor.findById(id);

    if (!doctor) {
      return res.status(404).json({
        ok: false,
        msg: "Doctor not found",
      });
    }

    await Doctor.findByIdAndDelete(id);

    return res.json({
      ok: true,
      msg: "Doctor deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Doctor not deleted",
    });
  }
};

module.exports = {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
};
