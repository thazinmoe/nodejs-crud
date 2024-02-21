// require('dotenv').config();
// const express = require("express");
// const app = express();
// // const mysql = require("mysql2"); // Change to mysql2
// let mysql = require("mysql");

// // Using MYSQL connection (run terminal npm start) connection errors in mysql
// let db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
//   });

// db.connect((err) => {
//    if (err) return console.error(err.message);

//    console.log('Connected to the MySQL server.');
//   });

// app.listen(3001, () => {
//   console.log("server runing on port is 3001");
// });

// Using MYSQL2 connection need to delete package.json file's "type": "module",
// const db = mysql.createConnection({
//     host: process.env.DB_HOST,
//     port: process.env.DB_PORT,
//     user: process.env.DB_USER,
//     password: process.env.DB_PASSWORD,
//     database: process.env.DB_NAME,
// });

// db.connect(function (err) {
//   if (err) throw err;
//   console.log("Connected Mysql server!");
// });

// app.get("/select", (req, res) => {

//     const countryName = 'Bulgaria';
//     const population = 6900000;

//   db.query(
//     'SELECT * FROM countries',
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       }

//       res.send(result);
//     }
//   );
// });

// app.post("/insert", (req, res) => {

//     const countryName = 'Bulgaria';
//     const population = 6900000;

//   db.query(
//     'INSERT INTO countries (countryName, population) VALUES (?,?)',
//     [countryName, population],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//       }

//       res.send(result);
//     }
//   );
// });

// app.listen(4001, () => {
//   console.log("server running on port 4001");
// });

import mysql from "mysql2";
import dotenv, { populate } from "dotenv";
dotenv.config();

// declare in package.json file type: module is support import and export statement
const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  })
  .promise();

export async function getNotes() {
  const [rows] = await pool.query("SELECT * FROM countries");
  return rows;
}

export async function getNote(id) {
  const [rows] = await pool.query(
    `
    SELECT * FROM countries 
    WHERE id = ?
    `,
    [id]
  );
  // const [rows] = await pool.query(`
  // SELECT * FROM countries
  // WHERE id = ${id}
  // `)
  // return rows
  return rows[0];
}

export async function createNote(countryName, population) {
  const [result] = await pool.query(
    `
    INSERT INTO countries (countryName, population)
    VALUES (?, ?)
    `,
    [countryName, population]
  );
  const id = result.insertId;
  return getNote(id);
}

export async function updateNote(id, countryName, population) {
  try {
    const [result] = await pool.query(
      `
        UPDATE countries SET countryName = ?, population = ?
        WHERE id = ?
        `,
      [countryName, population, id]
    );
    if (result) {
      return getNotes();
    }
  } catch (error) {
    console.error("Error updating note:", error);
    throw error;
  }
}

export async function deleteRowById(id) {
  try {
    const [result] = await pool.query(`
        DELETE FROM countries WHERE id = ?
    `, [id])
    console.log(result)
    if (result.affectedRows > 0) {
        return getNotes(); // Row was successfully deleted
      } else {
        return false; // Row with the specified ID does not exist
      }
  } catch (error) {
    console.log(error);
    return false;
  }
}

// const result = await deleteRowById(6)
//  console.log("final==",result)
