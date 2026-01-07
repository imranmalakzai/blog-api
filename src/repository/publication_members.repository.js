import { pool } from "../config/db.config.js";

//** Add a memeber to the publication  */
export const createPublicationMember = async (data) => {
  const [result] = await pool.query(
    "INSERT INTO publication_members (publication_id,user_id,role)  VALUES (?,?,?)",
    [data.publication_id, data.user_id, data.role]
  );
  result.insertId;
};

//**Delete a member from a publication memebership */
export const deletePublicationMember = async (user_id) => {
  const result = await pool.query(
    "DELETE FROM publication_members WHERE user_id = ?",
    [user_id]
  );
  return result.affectedRows;
};

//** Update role of a member in publications */
export const changePublicationMemberRole = async (role, user_id) => {
  const result = await pool.query(
    "UPDATE publication_memebers SET role =  ? WHERE user_id = ?",
    [role, user_id]
  );
  return result.affectedRows;
};

//**Get all members of  a bublications */
export const publicationMemebers = async (publicationId) => {
  const [rows] = await pool.query(
    "SELECT * FROM publications WHERE id = ?",
    publicationId
  );
  return rows;
};
