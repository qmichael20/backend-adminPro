const { response } = require("express");

const Hospital = require("../models/hospital.model");

const getHospitals = async (req, res = response) => {
  //populate para traer el usuario que creo el hospital
  const hospitals = await Hospital.find().populate("user", "name img");

  try {
    res.json({
      ok: true,
      hospitals,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hospital not found",
    });
  }
};

const createHospital = async (req, res = response) => {
  const { id } = req;

  const hospital = new Hospital({
    user: id,
    ...req.body,
  });

  try {
    const hospitalSaved = await hospital.save();

    res.json({
      ok: true,
      hospital: hospitalSaved,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hospital not created",
    });
  }
};

const updateHospital = async (req, res = response) => {
  const { id } = req.params;
  const { id: idUser } = req.id;

  try {
    const hospital = Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: "Hospital not found",
      });
    }

    const changeHospital = {
      ...req.body,
      user: idUser,
    };

    const hospitalUpdated = await Hospital.findByIdAndUpdate(
      id,
      changeHospital,
      { new: true }
    );

    res.json({
      ok: true,
      hospital: hospitalUpdated,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hospital not updated",
    });
  }
};

const deleteHospital = async (req, res = response) => {
  const { id } = req.params;

  try {
    const hospital = Hospital.findById(id);

    if (!hospital) {
      return res.status(404).json({
        ok: false,
        msg: "Hospital not found",
      });
    }

    await Hospital.findByIdAndDelete(id);

    res.json({
      ok: true,
      msg: "Hospital deleted",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      ok: false,
      msg: "Hospital not deleted",
    });
  }
};

module.exports = {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
};
