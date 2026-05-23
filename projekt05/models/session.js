import { DatabaseSync } from "node:sqlite";
import { randomBytes } from "node:crypto";
import userModel from "./user.js";

const db_path = "./db.sqlite";
const db = new DatabaseSync(db_path, { readBigInts: true });

const SESSION_COOKIE = "session_id";
const ONE_WEEK = 7 * 24 * 60 * 60 * 1000;

// TODO: foreign key user references fc_users(user_id)
db.exec(`
CREATE TABLE IF NOT EXISTS fc_session (
  id INTEGER PRIMARY KEY,
  user_id INTEGER,
  created_at INTEGER
) STRICT;
`);

const db_ops = {
  create_session(userId) {
    const sessionId = randomBytes(8).readBigInt64BE();
    const createdAt = Date.now();
    const stmt = db.prepare(
      `INSERT INTO fc_session (id, user_id, created_at) VALUES (?, ?, ?);`,
    );
    stmt.run(sessionId, userId, createdAt);
    return { id: sessionId, user_id: userId, created_at: createdAt };
  },
  get_session(sessionId) {
    const stmt = db.prepare(
      "SELECT id, user_id, created_at FROM fc_session WHERE id = ?;",
    );
    stmt.setReadBigInts(true);
    return stmt.get(sessionId);
  },
  delete_session(sessionId) {
    const stmt = db.prepare("DELETE FROM fc_session WHERE id = ?;");
    return stmt.run(sessionId);
  },
};

function createSession(userId, res) {
  const session = db_ops.create_session(userId);

  res.locals.session = session;
  res.locals.user = userId != null ? userModel.getUser(userId) : null;

  res.cookie(SESSION_COOKIE, session.id.toString(), {
    maxAge: ONE_WEEK,
    httpOnly: true,
    secure: false, 
    sameSite: "lax",
    path: "/",
    signed: true,
  });
  
  console.log("[SESSION] Cookie set:", SESSION_COOKIE, "=", session.id.toString());

  return session;
}

function deleteSession(res) {
  if (!res.locals.session) return;
  db_ops.delete_session(res.locals.session.id);
  res.clearCookie(SESSION_COOKIE, { path: "/" });
  res.locals.session = null;
  res.locals.user = null;
}

function sessionHandler(req, res, next) {
  let sessionId = req.signedCookies[SESSION_COOKIE];
  let session = null;

  console.log("[SESSION] Handler - signedCookies:", Object.keys(req.signedCookies));
  console.log("[SESSION] Handler - looking for:", SESSION_COOKIE, "found:", sessionId);

  if (sessionId != null) {
    if (!/^-?[0-9]+$/.test(sessionId)) {
      console.log("[SESSION] Handler - sessionId invalid format:", sessionId);
      sessionId = null;
    } else {
      sessionId = BigInt(sessionId);
      console.log("[SESSION] Handler - converted to BigInt:", sessionId.toString());
    }
  }

  if (sessionId != null) {
    session = db_ops.get_session(sessionId);
    console.log("[SESSION] Handler - DB lookup result:", session);
  }

  if (session != null) {
    res.locals.session = session;
    if (session.user_id != null) {
      res.locals.user = userModel.getUser(session.user_id);
      console.log("[SESSION] Handler - Session found, user loaded:", res.locals.user);
    } else {
      res.locals.user = null;
    }

    res.cookie(SESSION_COOKIE, session.id.toString(), {
      maxAge: ONE_WEEK,
      httpOnly: true,
      secure: false,
      sameSite: "lax",
      path: "/",
      signed: true,
    });
  } else {
    console.log("[SESSION] Handler - No session, creating anonymous");
    session = createSession(null, res);
  }

  next();
}

function loginRequired(req, res, next) {
  if (res.locals.user == null) {
    const nextUrl = encodeURIComponent(req.originalUrl || req.url);
    res.redirect(`/auth/login?next=${nextUrl}`);
    return;
  }
  next();
}

export default {
  createSession,
  deleteSession,
  sessionHandler,
  loginRequired,
};