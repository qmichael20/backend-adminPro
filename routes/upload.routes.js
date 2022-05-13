const { Router } = require("express");
const { fileUpload, returnImg } = require("../controllers/upload.controllers");
const expressfileUpload = require("express-fileupload");

const jwtValidator = require("../middlewares/jwt-validator");

const router = Router();

router.use(expressfileUpload());

router.put("/:type/:id", jwtValidator, fileUpload);
router.get("/:type/:img", returnImg);

module.exports = router;
