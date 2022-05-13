const { Router } = require("express");
const { getAll, getDocuments } = require("../controllers/search.controller");

const { fieldValidator } = require("../middlewares/fields-validator");
const jwtValidator = require("../middlewares/jwt-validator");

const router = Router();

router.get("all/:term", jwtValidator, getAll);
router.get("/collection/:collection/:term", jwtValidator, getDocuments);

module.exports = router;
