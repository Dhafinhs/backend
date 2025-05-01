const bcrypt = require("bcrypt");
const userRepository = require("../repository/user.repository");
const baseResponse = require("../utils/baseResponse.util");

// Regex untuk validasi input
const nameRegex = /^[A-Za-z\s]{3,}$/;
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{8,}$/;

exports.registerUser = async (req, res) => {
  const { name, email, password } = req.body;
  
  // Validasi input menggunakan regex
  if (!name || !email || !password) {
    return baseResponse(res, false, 400, "Name, email, and password are required");
  }
  if (!nameRegex.test(name)) {
    return baseResponse(res, false, 400, "Name must be at least 3 characters and only letters");
  }
  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format");
  }
  if (!passwordRegex.test(password)) {
    return baseResponse(res, false, 400, "Password must contain uppercase, lowercase, number, and symbol");
  }

  try {
    // Hash password sebelum disimpan
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await userRepository.registerUser(name, email, hashedPassword);
    return baseResponse(res, true, 201, "User created successfully", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error registering user", error);
  }
};

exports.loginUser = async (req, res) => {
  // Mengambil email dan password dari query params
  const { email, password } = req.query;

  if (!email || !password) {
    return baseResponse(res, false, 400, "Email and password are required");
  }

  try {
    // 🔹 Ambil user berdasarkan email dari database
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 401, "Invalid email or password");
    }

    // 🔹 Bandingkan password dengan yang ada di database
    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return baseResponse(res, false, 401, "Invalid email or password");
    }

    return baseResponse(res, true, 200, "Login successful", { 
      id: user.id, 
      name: user.name, 
      email: user.email 
    });

  } catch (error) {
    return baseResponse(res, false, 500, "Error logging in", error);
  }
};

exports.getUserByEmail = async (req, res) => {
  const { email } = req.params;
  
  if (!email) {
    return baseResponse(res, false, 400, "Email is required");
  }

  try {
    const user = await userRepository.getUserByEmail(email);
    if (!user) {
      return baseResponse(res, false, 404, "User not found");
    }
    return baseResponse(res, true, 200, "User retrieved successfully", user);
  } catch (error) {
    return baseResponse(res, false, 500, "Error retrieving user", error);
  }
};

exports.updateUser = async (req, res) => {
  const { id, name, email, password, balance } = req.body;
  
  if (!id || !name || !email || !password || balance === undefined) {
    return baseResponse(res, false, 400, "ID, name, email, password, and balance are required");
  }
  if (!nameRegex.test(name)) {
    return baseResponse(res, false, 400, "Name must be at least 3 characters and only letters");
  }
  if (!emailRegex.test(email)) {
    return baseResponse(res, false, 400, "Invalid email format");
  }
  if (!passwordRegex.test(password)) {
    return baseResponse(res, false, 400, "Password must contain uppercase, lowercase, number, and symbol");
  }

  try {
    // Hash password baru
    const hashedPassword = await bcrypt.hash(password, 10);
    const updatedUser = await userRepository.updateUser(id, name, email, hashedPassword, balance);

    if (!updatedUser) {
      return baseResponse(res, false, 404, "User not found");
    }
    return baseResponse(res, true, 200, "User updated successfully", updatedUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error updating user", error);
  }
};

exports.deleteUser = async (req, res) => {
  const { id } = req.params;
  
  if (!id) {
    return baseResponse(res, false, 400, "User ID is required");
  }

  try {
    const deleted = await userRepository.deleteUser(id);
    if (!deleted) {
      return baseResponse(res, false, 404, "User not found");
    }
    return baseResponse(res, true, 200, "User deleted successfully");
  } catch (error) {
    return baseResponse(res, false, 500, "Error deleting user", error);
  }
};

exports.topUpUser = async (req, res) => {
  const { id, amount } = req.body;

  // Validasi input
  if (!id || !amount || amount <= 0) {
    return baseResponse(res, false, 400, "User ID and valid amount are required");
  }

  try {
    // 🔹 Update saldo user di database
    const updatedUser = await userRepository.topUpUser(id, amount);
    
    if (!updatedUser) {
      return baseResponse(res, false, 404, "User not found");
    }

    return baseResponse(res, true, 200, "Top-up successful", updatedUser);
  } catch (error) {
    return baseResponse(res, false, 500, "Error processing top-up", error);
  }
};