const User = require("../models/userModel");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const authMiddleware = require("../middlewares/authMiddleware");
const cloudinary = require("../cloudinary");

// User Registration

router.post("/register", async (req, res) => {
  try {
    // Check if user is already present or not
    const user = await User.findOne({ email: req.body.email });
    // This below line of code executes and throw error if user already exist
    if (user) {
      return res.send({
        success: false,
        message: "User already exists",
      });
    }

    // Create New User
    // Before that we have to encrypt our password
    // and store them in hashed format

    const hashedPassword = await bcrypt.hash(req.body.password, 10);
    req.body.password = hashedPassword;
    const newUser = new User(req.body);
    await newUser.save();
    res.send({
      success: true,
      message: "User Created Sucessfully",
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

// User login

// Login End-Points

router.post("/login", async (req, res) => {
  try {
    // Check if User exist
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.send({
        success: false,
        message: "User does not exist",
      });
    }

    //Check if password is correct or not

    const validPassword = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!validPassword) {
      return res.send({
        success: false,
        message: "Invalid Password",
      });
    }

    //Create and assign a tokens

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });
    res.send({
      success: true,
      message: "User logged in successfully",
      data: token,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

//get current User

router.get("/get-current-user", authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.body.userId });
    res.send({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

// Get all users except current users

router.get("/get-all-users", authMiddleware, async (req, res) => {
  try {
    const allUsers = await User.find({ _id: { $ne: req.body.userId } });
    res.send({
      success: true,
      message: "Users fetched successfully",
      data: allUsers,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

// Update User Profile Pic

router.post("/update-profile-picture", authMiddleware, async (req, res) => {
  try {
    const image = req.body.image;

    //upload iage to cloudinary and get the url

    const uploadedImage = await cloudinary.uploader.upload(image, {
      folder: "akp",
    });

    //update user profile Picture

    const user = await User.findOneAndUpdate(
      { _id: req.body.userId },
      { profilePic: uploadedImage.secure_url },
      { new: true }
    );

    res.send({
      success: true,
      message: "Profile Picture updated Successfully",
      data: user,
    });
  } catch (error) {
    res.send({
      message: error.message,
      success: false,
    });
  }
});

module.exports = router;
