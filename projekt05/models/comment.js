import { DatabaseSync } from "node:sqlite";

const db_path = "./db.sqlite";
const db = new DatabaseSync(db_path);

db.exec(`
CREATE TABLE IF NOT EXISTS comments (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  album_id INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
  user_id INTEGER NOT NULL,
  content TEXT NOT NULL,
  created_at INTEGER NOT NULL
) STRICT;
`);

const db_ops = {
  insert_comment(albumId, userId, content, createdAt) {
    const stmt = db.prepare(
      `INSERT INTO comments (album_id, user_id, content, created_at)
       VALUES (?, ?, ?, ?) RETURNING id, album_id, user_id, content, created_at;`,
    );
    return stmt.get(albumId, userId, content, createdAt);
  },
  get_comments_by_album(albumId) {
    const stmt = db.prepare(
      `SELECT c.id, c.album_id, c.user_id, c.content, c.created_at, u.username as username
       FROM comments c
       LEFT JOIN fc_users u ON c.user_id = u.user_id
       WHERE c.album_id = ?
       ORDER BY c.created_at DESC;`,
    );
    return stmt.all(albumId);
  },
  get_comment(id) {
    const stmt = db.prepare(
      "SELECT id, album_id, user_id, content, created_at FROM comments WHERE id = ?;",
    );
    return stmt.get(id);
  },
  delete_comment(id) {
    const stmt = db.prepare("DELETE FROM comments WHERE id = ?;");
    return stmt.run(id);
  },
};

function addComment(albumId, userId, content) {
  const now = Date.now();
  return db_ops.insert_comment(albumId, userId, content, now);
}

function getCommentsForAlbum(albumId) {
  return db_ops.get_comments_by_album(albumId);
}

function getComment(id) {
  return db_ops.get_comment(id);
}

function deleteComment(id) {
  return db_ops.delete_comment(id);
}

function canDeleteComment(comment, user) {
  if (comment == null || user == null) return false;
  if (user.is_admin === true) return true;
  return comment.user_id === user.id;
}

export default {
  addComment,
  getCommentsForAlbum,
  getComment,
  deleteComment,
  canDeleteComment,
};