const jwt = require("jsonwebtoken");

const jwtValidator = (req, res, next) => {
  const token = req.headers["x-token"];

  if (!token) {
    return res.status(401).json({ ok: false, msg: "No token provided." });
  }

  try {
    const { id } = jwt.verify(token, process.env.SECRET_KEY);

    req.id = id;

    next();
  } catch (error) {
    console.log(error);
    return res.status(401).json({ ok: false, msg: "Token invalid" });
  }
};

module.exports = jwtValidator;
