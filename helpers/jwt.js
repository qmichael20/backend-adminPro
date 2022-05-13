const jwt = require("jsonwebtoken");

const generateJWT = (id) => {
  const payload = {
    id,
  };

  return new Promise((resolve, reject) => {
    jwt.sign(
      payload,
      process.env.SECRET_KEY,
      {
        expiresIn: "12h",
      },
      (error, token) => {
        if (error) {
          console.log(error);
          reject("Error in generating token");
        } else {
          resolve(token);
        }
      }
    );
  });
};

module.exports = { generateJWT };
