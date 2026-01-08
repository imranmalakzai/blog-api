import { pool } from "../config/db.config.js";

//** Follow a user */
export const follow = async (followerId, followedId) => {
  const [result] = await pool.query(
    "INSERT INTO user_followers (follower_id,followed_id)",
    [followerId, followedId]
  );
  return result.insertId;
};

//** Unfollow a user */
export const unFollow = async (followerId, followedId) => {
  const result = await pool.query(
    "DELETE from user_followers WHERE follower_id = ? AND followed_Id = ? ",
    [followerId, followedId]
  );
  return result.affectedRows;
};

//** Get all my followers */
export const followers = async (userId) => {
  const [rows] = await pool.query(
    "SELECT u.id,u.username,u.avatar_url FROM users u JOIN user_followers us ON u.id = us.follower_id WHERE us.followed_id = ?",
    [userId]
  );
  return rows;
};
