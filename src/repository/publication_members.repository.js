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
export const deletePublicationMember = async (id) => {
  const result = await pool.query(
    "DELETE FROM publication_members WHERE id = ?",
    [id]
  );
  return result.affectedRows;
};
