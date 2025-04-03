const User = require("../models/User");

// POST public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, role, telephone } = req.body;

    const user = await User.create({
      name,
      email,
      role,
      password,
      telephone,
    });

    // const token = user.getSignedJwtToken();
    // res.status(200).json({ success: true, token });
    sendTokenResponse(user, 200, res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err.stack);
  }
};
exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, msg: "Please provide an email and password" });
  }

  const user = await User.findOne({ email }).select("+password"); // shorthand for User.findOne({ email : email }).select("+password");

  if (!user) {
    return res.status(400).json({ success: false, msg: "Invalid credentials" });
  }

  if (user.isBan) {
    return res.status(403).json({
      success: false,
      msg: "User is banned and cannot perform this action",
    });
  }

  const isMatch = await user.matchPassword(password);

  if (!isMatch) {
    return res.status(401).json({ success: false, msg: "Invalid credentials" });
  }

  // const token = user.getSignedJwtToken();
  // res.status(200).json({ success: true, token, msg: "Login Successful" });
  sendTokenResponse(user, 200, res);
};

// Get current logged in user @route POST /api/v1/auth/me @access Private
exports.getMe = async (req, res, next) => {
  // use after authmiddleware 'protect'
  // console.log(req.user);
  const user = await User.findById(req.user._id); // come from req.user = await User.findById(decoded.id); inside protect
  res.status(200).json({ success: true, data: user });
};

exports.logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 5 * 1000),
    httpOnly: true,
    path: "/",
  });
  // console.log(Date.now());

  res.status(200).json({
    success: true,
  });
};

exports.banUser = async (req, res, next) => {
  try {
    const user = await User.findOneAndUpdate(
      { _id: req.params.id, role: { $ne: "admin" } }, // Ensure not banning an admin
      { isBan: true },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found or cannot be banned",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User banned successfully",
      data: user,
    });
  } catch (err) {
    console.error(err.stack);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

exports.unbanUser = async (req, res, next) => {
  try {
    const user = await User.findByIdAndUpdate(
      { _id: req.params.id, role: { $ne: "admin" } },
      { isBan: false },
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.stack(404).json({
        success: false,
        message: "User not found or cannot be unbanned",
      });
    }

    return res.status(200).json({
      success: true,
      message: "User unbanned successfully",
      data: user,
    });
  } catch (err) {
    console.log(err.stack);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};

const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000 // use milisec JWT_COOKIE_EXPIRE is a day
    ),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  const role = user.role;
  const email = user.email;
  const name = user.name;

  res
    .status(statusCode)
    .cookie("token", token, options)
    .json({ success: true, token, email, role, name });
};
