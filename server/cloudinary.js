const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: "duobbnqgx",
  api_key: "524733961283193",
  api_secret: "rwPmXHEVb8ciAVV8TMYmasSrAFg",
  secure: true,
});

module.exports = cloudinary;
