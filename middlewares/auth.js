const bcrypt = require("bcrypt");
const db = require("../db/db");

module.exports = async function (req, res, next) {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Basic ")) {
    return res.status(401).json({ error: "Missing or invalid auth header" });
  }

  try {
    const [name, password] = Buffer.from(authHeader.split(" ")[1], "base64")
      .toString("ascii")
      .split(":");

    const userQuery = await db.query("SELECT * FROM users WHERE name = $1", [name]);
    const user = userQuery.rows[0];

    if (!user || !(await bcrypt.compare(password, user.password_hash))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    res.status(500).json({ error: "Authentication failed" });
  }
};
