const bcrypt = require("bcrypt");
const userModel = require("../models/userModel");

exports.register = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ error: "Username and password are required" });
    }

    const existing = await userModel.getUserByName(username);
    if (existing.rows.length > 0) {
      return res.status(409).json({ error: "Username already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await userModel.createUser(username, email || null, hashedPassword);

    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: result.rows[0].id,
        name: result.rows[0].name,
        email: result.rows[0].email
      }
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ error: "Internal Server Error" });
  }
};
