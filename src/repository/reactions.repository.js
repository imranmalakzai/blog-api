import { Router } from "express";
import { pool } from "../config/db.config.js";

//** Create Reaction */
export const create = async (name) => {
  const [result] = await pool.query("INSERT INTO reactions (name) VALUE (?)", [
    name,
  ]);
  return result.insertId;
};

//** update a reaction */
export const update = async (name, id) => {
  const result = await pool.query(
    "UPDATE reactions SET name = ? WHERE id = ?",
    [name, id],
  );
  return result.affectedRows;
};

//** delete a reaction */
export const remove = async (id) => {
  const result = await pool.query("DELETE FROM reactions WHERE id = ? ", [id]);
  return result.affectedRows;
};

//**Get all reactions */
export const reactions = async () => {
  const [rows] = await pool.query("SELECT * FROM reactions");
  return rows;
};

//** Get reaction by Id  */
export const reaction = async (id) => {
  const rows = await pool.query("SELECT * FROM reactions WHERE id = ?", [id]);
  return rows[0];
};

//** Get reaction by name */
export const getReactionByName = async (name) => {
  const [rows] = await pool.query("SELECT id FROM rections WHERE name = ?", [
    name,
  ]);
  return rows;
};
