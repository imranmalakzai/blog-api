import { pool } from "../config/db.config.js";

//** user registration database query */
export const userRegistration = async (data) => {
  const result = await pool.query(
    "INSERT INTO users (username,email,password_hash,bio,avatar_url,role) VALUES (?,?,?,?,?,?)",
    [
      data.username,
      data.email,
      data.password_hash,
      data.bio,
      data.avatar_url,
      data.role,
    ]
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
