const mongoose = require("mongoose");

const dbConnection = async () => {
  try {
    await mongoose.connect(
      "mongodb+srv://khaelm25:wuAVbwZL2uTpreWP@cluster0.hx3yg.mongodb.net/test"
    );

    console.log("DB is connected");
  } catch (error) {
    console.log(error);

    throw new Error("Error connecting to database");
  }
};

module.exports = { dbConnection };
