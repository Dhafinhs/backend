const db = require("../database/pg.database");

exports.registerUser = async (name, email, password) => {
  try {
    const res = await db.query(
      "INSERT INTO users (name, email, password) VALUES ($1, $2, $3) RETURNING *",
      [name, email, password]
    );
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    return null;
  }
};

exports.loginUser = async (email, password) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1 AND password = $2", [email, password]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    return null;
  }
};

exports.getUserByEmail = async (email) => {
  try {
    const res = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    return res.rows[0];
  } catch (error) {
    console.error("Error executing query", error);
    return null;
  }
};

exports.updateUser = async (id, name, email, hashedPassword, balance) => {
  const res = await db.query(
    "UPDATE users SET name = $1, email = $2, password = $3, balance = $4 WHERE id = $5 RETURNING *",
    [name, email, hashedPassword, balance, id]
  );
  return res.rows[0];
};

exports.deleteUser = async (id) => {
  try {
    const res = await db.query("DELETE FROM users WHERE id = $1 RETURNING *", [id]);
    return res.rowCount > 0;
  } catch (error) {
    console.error("Error executing query", error);
    return null;
  }
};

exports.topUpUser = async (id, amount) => {
  const res = await db.query(
    "UPDATE users SET balance = balance + $1 WHERE id = $2 RETURNING id, name, balance",
    [amount, id]
  );
  return res.rows[0]; // Mengembalikan user setelah update saldo
};
