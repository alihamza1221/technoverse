const userModel = require("../models/user.model");

module.exports.registerUser = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    const isUserAlready = await userModel.findOne({ email });

    console.log("isUserAlready", isUserAlready);
    if (isUserAlready) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role,
    });
    await user.save();
    const token = user.generateAuthToken();
    res.cookie("token", token);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    console.log("email", email);
    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = user.generateAuthToken();
    res.cookie("token", token);

    res.status(200).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  console.log("req user", req.user);
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  try {
    console.log("loggin out user: ", req.user);
    res.clearCookie("token");
    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
