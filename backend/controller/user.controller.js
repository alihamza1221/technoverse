const userModel = require("../models/user.model");

module.exports.registerUser = async (req, res, next) => {
  try {
    const { username, email, password, imageUri } = req.body;

    const isUserAlready = await userModel.findOne({ email });

    if (isUserAlready) {
      return res.status(400).json({ message: "User already exist" });
    }

    const hashedPassword = await userModel.hashPassword(password);

    const user = await userService.createUser({
      username,
      email,
      password: hashedPassword,
      imageUri,
    });

    await user.save();
    const token = user.generateAuthToken();
    res.cookie("token", token);

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
module.exports.loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

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

    res.status(201).json({ token, user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports.getUserProfile = async (req, res, next) => {
  res.status(200).json(req.user);
};

module.exports.logoutUser = async (req, res, next) => {
  try {
    res.clearCookie("token");

    return res.status(200).json({ message: "Logged out" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
