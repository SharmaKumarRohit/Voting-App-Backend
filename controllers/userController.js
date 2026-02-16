const User = require("../models/user");
const { generateToken } = require("../jwt");

// User can signup
exports.userSignup = async (req, res) => {
  const data = req.body;
  try {
    // Check if already an admin user
    const adminUser = await User.findOne({ role: "admin" });
    if (data.role === "admin" && adminUser) {
      return res.status(400).json({ error: "Admin user already exists." });
    }

    // Validate aadhar card number must have exactly 12 digits.
    if (!/^\d{12}$/.test(data.aadharCardNumber)) {
      return res
        .status(400)
        .json({ error: "Aadhar card number must be exactly 12 digits." });
    }

    // Check if a user with same aadhar card number already exists
    const existingUser = await User.findOne({
      aadharCardNumber: data.aadharCardNumber,
    });
    if (existingUser) {
      return res.status(400).json({
        error: "User with the same aadhar card number already exists.",
      });
    }

    const newUser = new User(data);
    const user = await newUser.save();

    const payload = { id: user.id };
    const token = generateToken(payload);

    res.status(201).json({ user, token });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

// User can login after expires user token validity (1hr)
exports.userLogin = async (req, res) => {
  const { aadharCardNumber, password } = req.body;
  try {
    // Check if aadhar card number or password is missing
    if (!aadharCardNumber || !password) {
      return res
        .status(400)
        .json({ error: "Aadhar card number and password are required" });
    }
    const user = await User.findOne({ aadharCardNumber });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: "Invalid username or password" });
    }
    const payload = { id: user.id };
    const token = generateToken(payload);
    res.status(200).json({ token });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

// Show user profile
exports.userProfile = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const user = await User.findById(userId);
    res.status(200).json({ user });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};

// User can change own currentPassword to newPassword
exports.updatePassword = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { currentPassword, newPassword } = req.body;

    // Check if currentPassword and newPassword are present in the request body
    if (!currentPassword || !newPassword) {
      return res
        .status(400)
        .json({ error: "Both currentPassword and newPassword are required" });
    }

    const user = await User.findById(userId);
    if (!(await user.comparePassword(currentPassword))) {
      return res.status(401).json({ error: "Invalid current password!" });
    }
    user.password = newPassword;
    await user.save();
    res.status(200).json({ message: "Password updated" });
  } catch (error) {
    res
      .status(500)
      .json({ error: error.message, message: "Internal server error" });
  }
};
