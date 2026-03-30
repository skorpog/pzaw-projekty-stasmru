import { DatabaseSync } from "node:sqlite";
import argon2 from "argon2";

const PEPPER = process.env.PEPPER;
if (PEPPER == null) {
  console.error(
    "PEPPER environment variable missing. Please create an env file or provide PEPPER via environment variables.",
  );
  process.exit(1);
}

const HASH_PARAMS = {
  secret: Buffer.from(PEPPER, "hex"),
};

const db_path = "./db.sqlite";
const db = new DatabaseSync(db_path);

db.exec(`
  CREATE TABLE IF NOT EXISTS fc_users (
    user_id     INTEGER PRIMARY KEY,
    username    TEXT UNIQUE NOT NULL,
    passhash    TEXT NOT NULL,
    attributes  TEXT DEFAULT NULL,
    created_at  INTEGER NOT NULL
  ) STRICT;
`);

const db_ops = {
  create_user(username, passhash, attributes, createdAt) {
    const stmt = db.prepare(
      `INSERT INTO fc_users (username, passhash, attributes, created_at)
       VALUES (?, ?, ?, ?) RETURNING user_id AS id;`,
    );
    return stmt.get(username, passhash, attributes, createdAt);
  },
  get_user(userId) {
    const stmt = db.prepare(
      `SELECT user_id AS id, username, attributes, created_at
       FROM fc_users WHERE user_id = ?;`,
    );
    return stmt.get(userId);
  },
  find_by_username(username) {
    const stmt = db.prepare(
      `SELECT user_id AS id, username, attributes, created_at
       FROM fc_users WHERE username = ?;`,
    );
    return stmt.get(username);
  },
  get_auth_data(username) {
    const stmt = db.prepare(
      `SELECT user_id AS id, passhash FROM fc_users WHERE username = ?;`,
    );
    return stmt.get(username);
  },
  get_attributes(userId) {
    const stmt = db.prepare(
      `SELECT attributes FROM fc_users WHERE user_id = ?;`,
    );
    return stmt.get(userId);
  },
  update_attributes(attributes, userId) {
    const stmt = db.prepare(
      `UPDATE fc_users SET attributes = ? WHERE user_id = ?;`,
    );
    return stmt.run(attributes, userId);
  },
};

async function createUser(username, password) {
  let existing_user = db_ops.find_by_username(username);
  if (existing_user != null) return null;

  const createdAt = Date.now();
  const passhash = await argon2.hash(password, HASH_PARAMS);
  return db_ops.create_user(username, passhash, null, createdAt);
}

async function validatePassword(username, password) {
  console.log("[USER] Validating password for username:", username);
  let auth_data = db_ops.get_auth_data(username);
  console.log("[USER] Auth data found:", auth_data ? "yes" : "no");
  
  if (auth_data != null) {
    const valid = await argon2.verify(auth_data.passhash, password, HASH_PARAMS);
    console.log("[USER] Password valid:", valid, "returning id:", auth_data.id);
    if (valid) return auth_data.id;
  }
  console.log("[USER] Password validation failed");
  return null;
}

function getUser(userId) {
  const row = db_ops.get_user(userId);
  if (row == null) return null;

  const attributes = row.attributes ? JSON.parse(row.attributes) : {};
  return {
    id: row.id,
    username: row.username,
    created_at: row.created_at,
    ...attributes,
  };
}

const forbiddenAttributeNames = new Set([
  "id",
  "user_id",
  "username",
  "passhash",
  "attributes",
  "created_at",
]);
const allowedAttributeValueTypes = new Set(["string", "boolean", "number"]);
const attributeNameRegex = /^[a-z_]+$/;

function addAttribute(userId, name, value) {
  if (typeof name !== "string") return "attribute name must be string";
  if (forbiddenAttributeNames.has(name)) return "forbidden attribute name";
  if (!attributeNameRegex.test(name)) return "attribute name should contain lowercase letters and underscore only";
  if (!allowedAttributeValueTypes.has(typeof value)) return "attribute value type not allowed";

  const row = db_ops.get_attributes(userId);
  if (row == null) return "user not found";

  const attributes = row.attributes ? JSON.parse(row.attributes) : {};
  attributes[name] = value;
  db_ops.update_attributes(JSON.stringify(attributes), userId);

  return null;
}

export default {
  createUser,
  validatePassword,
  getUser,
  addAttribute,
};
