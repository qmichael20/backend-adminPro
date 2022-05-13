const { Router } = require("express");
const { check } = require("express-validator");
const {
  getHospitals,
  createHospital,
  updateHospital,
  deleteHospital,
} = require("../controllers/hospital.controllers");

const { fieldValidator } = require("../middlewares/fields-validator");

const jwtValidator = require("../middlewares/jwt-validator");

const router = Router();

router.get("/", jwtValidator, getHospitals);

router.post(
  "/",
  [
    jwtValidator,
    check("name", "Hospital name is required").not().isEmpty(),
    fieldValidator,
  ],
  createHospital
);

router.put(
  "/:id",
  [jwtValidator, check("name", "Hospital name is required").not().isEmpty()],
  updateHospital
);

router.delete("/:id", jwtValidator, deleteHospital);

module.exports = router;
