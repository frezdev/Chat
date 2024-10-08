// Modules
import path from "path";
import sqlite3 from "sqlite3";
import fs from "node:fs/promises";

// Imports
import { __dirname } from "#root";

// Variables
let db_instance = null;
const { DB_DIR } = process.env;

// db dir exists
async function dirExists(dir) {
  console.log("[DB] Checking directory");
  try {
    await fs.access(dir);
    console.log("[DB] Directory exists");
  } catch (err) {
    console.log("[DB] Directory does not exist, creating...");
    if (err.code === "ENOENT") {
      await fs.mkdir(dir, { recursive: true });
      console.log(`[DB] Directory created: ${dir}`);
    } else {
      console.error(`[DB] Error checking directory: ${err.message}`);
    }
  }
}

// db connection
async function db() {
  if (db_instance) return db_instance;
  console.log("[DB] Making connection");

  const databaseDir =
    path.join(__dirname, DB_DIR) || path.join(__dirname, "db");
  const databaseFile = path.join(databaseDir, "db.sqlite");

  const databasePath = path.resolve(databaseFile);

  await dirExists(databaseDir);

  console.log("[DB] Establishing connection");

  return new Promise((resolve, reject) => {
    const database = new sqlite3.Database(databasePath, (error) => {
      if (error) {
        console.error("[DB] Connection failed: ", error.message);
        reject(error);
      } else {
        console.log("[DB] Successful connection.");
        db_instance = database;
        resolve(db_instance);
      }
    });
  });
}

export default db;
