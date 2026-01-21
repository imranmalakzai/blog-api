import { pool } from "../config/db.config.js";

//** Add a memeber to the publication  */
export const createPublicationMember = async (data) => {
  const [result] = await pool.query(
    "INSERT INTO publication_members (publication_id,user_id,role)  VALUES (?,?,?)",
    [data.publication_id, data.user_id, data.role],
  );
  result.insertId;
};

//**Delete a member from a publication memebership */
export const deletePublicationMember = async (user_id) => {
  const result = await pool.query(
    "DELETE FROM publication_members WHERE user_id = ?",
    [user_id],
  );
  return result.affectedRows;
};

//** Update role of a member in publications */
export const changePublicationMemberRole = async (role, user_id) => {
  const result = await pool.query(
    "UPDATE publication_memebers SET role =  ? WHERE user_id = ?",
    [role, user_id],
  );
  return result.affectedRows;
};

//**Get all members of  publications */
export const publicationMemebers = async (publicationId) => {
  const [rows] = await pool.query(
    "SELECT u.id as userId,u.username,pm.role,u.avatar_url FROM publication_members pm JOIN  users u ON u.id = pm.user_id  WHERE publication_id = ? AND pm.role IS NOT null",
    publicationId,
  );
  return rows;
};

//** user publications -> publication that user is memeber of */
export const userPulications = async (userId) => {
  const [rows] = pool.query(
    `SELECT * FROM publication_members JOIN publications ON publication_members.publication_id = publications.id WHERE publication_members.user_id = ? `[
      userId
    ],
  );
  return rows;
};

//** Get a publication by publicationId and memeberId */
export const isPublicationMemeber = async (publicationId, userId) => {
  const [rows] = await pool.query(
    `SELECT * FROM publication_members WHERE publication_id = ? AND user_id = ?`,
    [publicationId, userId],
  );
  return rows[0];
};

//** publication followers */
export const publicationFollowers = async (publicationId) => {
  const [rows] = await pool.query(
    "SELECT u.id as userId,u.username,u.avatar_url,pm.role FROM publication_members pm JOIN users u on u.id = pm.user_id WHERE pm.publication_id = ?",
    [publicationId],
  );
  return rows;
};
