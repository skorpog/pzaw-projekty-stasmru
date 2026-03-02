const { DatabaseSync } = require('node:sqlite');

const db_path = "./database.db";
const db = new DatabaseSync(db_path);

db.exec(
  `CREATE TABLE IF NOT EXISTS albums (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    artist TEXT NOT NULL,
    title TEXT NOT NULL,
    releaseDate TEXT NOT NULL,
    description TEXT NOT NULL,
    totalDuration TEXT NOT NULL,
    spotifyLink TEXT NOT NULL,
    UNIQUE(artist, title)
  ) STRICT;
  CREATE TABLE IF NOT EXISTS songs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    album_id INTEGER NOT NULL REFERENCES albums(id) ON DELETE CASCADE,
    title TEXT NOT NULL
  ) STRICT;`
);

function getAlbumSummaries() {
  const stmt = db.prepare("SELECT id, artist, title, releaseDate, description, totalDuration, spotifyLink FROM albums;");
  return stmt.all();
}

function hasAlbum(albumArtist) {
  const stmt = db.prepare("SELECT id FROM albums WHERE artist = ?;");
  let album = stmt.get(albumArtist);
  return album != null;
}

function hasAlbumByArtistAndTitle(artist, title) {
  const stmt = db.prepare("SELECT id FROM albums WHERE artist = ? AND title = ?;");
  let album = stmt.get(artist, title);
  return album != null;
}

function getAlbum(albumArtist) {
  const stmt = db.prepare("SELECT id, artist, title, releaseDate, description, totalDuration, spotifyLink FROM albums WHERE artist = ?;");
  let album = stmt.get(albumArtist);
  if (album != null) {
    const songStmt = db.prepare("SELECT id, title FROM songs WHERE album_id = ?;");
    album.songs = songStmt.all(album.id);
    return album;
  }
  return null;
}

function getAlbumById(id) {
  const stmt = db.prepare("SELECT id, artist, title, releaseDate, description, totalDuration, spotifyLink FROM albums WHERE id = ?;");
  let album = stmt.get(id);
  if (album != null) {
    const songStmt = db.prepare("SELECT id, title FROM songs WHERE album_id = ?;");
    album.songs = songStmt.all(album.id);
    return album;
  }
  return null;
}

function addAlbum(album) {
  const stmt = db.prepare(`INSERT INTO albums (artist, title, releaseDate, description, totalDuration, spotifyLink)
        VALUES (?, ?, ?, ?, ?, ?) RETURNING id, artist, title, releaseDate, description, totalDuration, spotifyLink;`);
  let result = stmt.get(album.artist, album.title, album.releaseDate, album.description, album.totalDuration, album.spotifyLink);
  const songStmt = db.prepare(`INSERT INTO songs (album_id, title) VALUES (?, ?) RETURNING id, title;`);
  for (let song of album.songs) {
    songStmt.run(result.id, song);
  }
  return result;
}

function updateAlbum(id, album) {
  const stmt = db.prepare(`UPDATE albums SET artist = ?, title = ?, releaseDate = ?, description = ?, totalDuration = ?, spotifyLink = ? WHERE id = ?;`);
  stmt.run(album.artist, album.title, album.releaseDate, album.description, album.totalDuration, album.spotifyLink, id);
  // usuniecie i potem reinsert
  const deleteStmt = db.prepare("DELETE FROM songs WHERE album_id = ?;");
  deleteStmt.run(id);
  const insertStmt = db.prepare(`INSERT INTO songs (album_id, title) VALUES (?, ?) RETURNING id, title;`);
  for (let song of album.songs) {
    insertStmt.run(id, song);
  }
}

function deleteAlbum(id) {
  const stmt = db.prepare("DELETE FROM albums WHERE id = ?;");
  stmt.run(id);
}

function validateAlbumData(album) {
  var errors = [];
  var fields = ["artist", "title", "releaseDate", "description", "totalDuration", "spotifyLink"];
  for (let field of fields) {
    if (!album.hasOwnProperty(field)) errors.push(`Missing field '${field}'`);
    else {
      if (typeof album[field] != "string")
        errors.push(`'${field}' expected to be string`);
      else {
        if (album[field].length < 1 || album[field].length > 500)
          errors.push(`'${field}' expected length: 1-500`);
      }
    }
  }
  if (!album.hasOwnProperty("songs") || !Array.isArray(album.songs)) {
    errors.push("Missing or invalid songs array");
  } else {
    for (let song of album.songs) {
      if (typeof song != "string" || song.length < 1 || song.length > 2000) {
        errors.push("Invalid song title");
      }
    }
  }
  return errors;
}

module.exports = {
  getAlbumSummaries,
  hasAlbum,
  hasAlbumByArtistAndTitle,
  getAlbum,
  getAlbumById,
  addAlbum,
  updateAlbum,
  deleteAlbum,
  validateAlbumData,
};
