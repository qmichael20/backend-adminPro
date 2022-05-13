const { response } = require("express");
const { v4: uuidv4 } = require("uuid");
const { updateImg } = require("../helpers/updateImg");
const path = require("path");
const fs = require("fs");

const fileUpload = (req, res = response) => {
  const { type, id } = req.params;

  const validTypes = ["users", "doctors", "hospitals"];

  if (!validTypes.includes(type)) {
    return res.status(400).json({
      ok: false,
      msg: "Invalid type, must be one of: users, doctors, hospitals",
    });
  }

  //validate file
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).json({
      ok: false,
      msg: "No files were uploaded",
    });
  }

  //process file
  const file = req.files.image;

  const fileSplit = file.name.split(".");

  const fileExt = fileSplit[fileSplit.length - 1];

  //validate file extension
  const validExt = ["jpg", "jpeg", "png", "gif", "svg"];
  if (!validExt.includes(fileExt)) {
    return res.status(400).json({
      ok: false,
      msg: "Invalid file extension, must be one of: jpg, jpeg, png, gif",
    });
  }

  //generate new file name
  const fileName = `${uuidv4()}.${fileExt}`;

  //move file to uploads folder
  const path = `./uploads/${type}/${fileName}`;

  // Use the mv() method to place the file somewhere on your server
  file.mv(path, (error) => {
    if (error) {
      console.log(error);
      return res.status(500).json({
        ok: false,
        msg: "Error moving file",
      });
    }

    //update user or hospital or doctor image
    updateImg(type, id, path, fileName);

    res.json({
      ok: true,
      msg: "File uploaded",
      fileName,
    });
  });
};

const returnImg = (req, res = response) => {
  const { type, img } = req.params;

  const pathImg = path.join(__dirname, `../uploads/${type}/${img}`);

  //default image
  if (fs.existsSync(pathImg)) {
    res.sendFile(pathImg);
  } else {
    const pathImg = path.join(__dirname, `../uploads/users/noimage.jpg`);
    res.sendFile(pathImg);
  }
};

module.exports = { fileUpload, returnImg };
