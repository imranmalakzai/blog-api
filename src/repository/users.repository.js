import { pool } from "../config/db.config.js";

//** user registration database query */
export const userRegistration = async (data) => {
  const result = await pool.query(
    "INSERT INTO users (username,email,password_hash) VALUES (?,?,?)",
    [data.username, data.email, data.password_hash]
  );
  return result.affectedRows;
};

//** GET all users database query */
export const getAllUsers = async (data) => {
  const [rows] = await pool.query("SELECT * FROM users");
  return rows;
};

//**GET a user by id */
export const getUserbyId = async (userId) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE id = ?", [userId]);
  return rows[0];
};

//**GET a user by Email */
export const getUserByEmail = async (email) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [
    email,
  ]);
  return rows[0];
};

//**GET users by role */
export const getUserByRole = async (role) => {
  const [rows] = await pool.query("SELECT * FROM users WHERE role = ?", [role]);
  return rows;
};

//**Update user profile */
export const updateUserRole = async (role, userId) => {
  const result = await pool.query("UPDATE users SET role = ?, WHERE id = ? ", [
    role,
    userId,
  ]);
  return result.affectedRows;
};

//**Update user Password */
export const updateUserPassword = async (password, userId) => {
  const result = await pool.query(
    "UPDATE users SET password_hash = ? WHERE id = ?",
    [password, userId]
  );
  return result.affectedRows;
};

//**Updte user avatar */
export const updateUserAvatar = async (avatar, userId) => {
  const result = await pool.query(
    "UPDATE users SET avatar_url = ? WHERE id = ?",
    [avatar, userId]
  );
  return result.affectedRows;
};

//**update user bio */
export const updateUserProfile = async (data, userId) => {
  const result = await pool.query(
    "UPDATE users SET bio = ? , username = ? WHERE id = ?",
    [data.bio, data.username, userId]
  );
  return result.affectedRows;
};
