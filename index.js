require("dotenv").config();

const express = require("express");
const cors = require("cors");

const { dbConnection } = require("./database/config");

const app = express();

//Cors configuration
app.use(cors());

//Body parser configuration
app.use(express.json());

//Database connection
dbConnection();

//Directory public
app.use(express.static("public"));

//Routes
app.use("/api/users", require("./routes/user.routes"));
app.use("/api/auth", require("./routes/auth.routes"));
app.use("/api/hospitals", require("./routes/hospital.routes"));
app.use("/api/doctors", require("./routes/doctor.routes"));
app.use("/api", require("./routes/searchs.routes"));
app.use("/api/uploads", require("./routes/upload.routes"));

app.listen(process.env.PORT, () => {
  console.log("Server is running on port " + process.env.PORT);
});
