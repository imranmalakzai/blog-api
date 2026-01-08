import { pool } from "../config/db.config.js";

//** Follow a user */
export const follow = async (followerId, followedId) => {
  const [result] = await pool.query(
    "INSERT INTO user_followers (follower_id,followed_id)",
    [followerId, followedId]
  );
  return result.insertId;
};
