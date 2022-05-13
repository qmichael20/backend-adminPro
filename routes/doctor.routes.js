const { Router } = require("express");
const { check } = require("express-validator");
const {
  getDoctors,
  createDoctor,
  updateDoctor,
  deleteDoctor,
} = require("../controllers/doctor.controllers");

const { fieldValidator } = require("../middlewares/fields-validator");

const jwtValidator = require("../middlewares/jwt-validator");

const router = Router();

router.get("/", jwtValidator, getDoctors);

router.post(
  "/",
  [
    [
      jwtValidator,
      check("name", "Doctor name is required").not().isEmpty(),
      check("hospital", "Hospital ID must be valid").isMongoId(),
      fieldValidator,
    ],
  ],
  createDoctor
);

router.put(
  "/:id",
  [
    jwtValidator,
    check("name", "Doctor name is required"),
    check("hospital", "Hospital ID must be valid").isMongoId(),
  ],
  updateDoctor
);

router.delete("/:id", jwtValidator, deleteDoctor);

module.exports = router;
