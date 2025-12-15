const express = require("express");
const morgan = require("morgan");
const albums = require("./models/album");

const port = 8000;
const app = express();

const comments = [];
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));

function log_request(req, res, next) {
  console.log(`Request ${req.method} ${req.path}`);
  next();
}
app.use(log_request);
app.use(morgan("dev"));

app.get("/", (req, res) => {
  const albumSummaries = albums.getAlbumSummaries();
  res.render("home", { albums: albumSummaries });
});

app.get("/album/:id", (req, res) => {
  const album = albums.getAlbumById(req.params.id);
  if (album) {
    const albumComments = comments.filter(c => c.albumId === req.params.id);
    res.render("album", { album, comments: albumComments });
  } else {
    res.status(404).send("Album not found");
  }
});

app.get("/about", (req, res) => {
  res.render("about");
});

app.get("/add-album", (req, res) => {
  res.render("add_album", { errors: [], album: undefined });
});

app.post("/add-album", (req, res) => {
  const { artist, title, releaseDate, description, totalDuration, spotifyLink, songs } = req.body;
  const albumData = {
    artist,
    title,
    releaseDate,
    description,
    totalDuration,
    spotifyLink,
    songs: songs.split(',').map(s => s.trim())
  };
  const errors = albums.validateAlbumData(albumData);
  if (albums.hasAlbumByArtistAndTitle(albumData.artist, albumData.title)) {
    errors.push("An album with this title already exists for this artist.");
  }
  if (errors.length > 0) {
    res.render("add_album", { errors, album: albumData });
  } else {
    albums.addAlbum(albumData);
    res.redirect("/");
  }
});

app.get("/edit-album/:id", (req, res) => {
  const album = albums.getAlbumById(req.params.id);
  if (album) {
    res.render("edit_album", { album, errors: [] });
  } else {
    res.status(404).send("Album not found");
  }
});

app.post("/edit-album/:id", (req, res) => {
  const { artist, title, releaseDate, description, totalDuration, spotifyLink, songs } = req.body;
  const albumData = {
    artist,
    title,
    releaseDate,
    description,
    totalDuration,
    spotifyLink,
    songs: songs.split(',').map(s => s.trim())
  };
  const errors = albums.validateAlbumData(albumData);
  if (errors.length > 0) {
    res.render("edit_album", { errors, album: { ...albumData, id: req.params.id } });
  } else {
    albums.updateAlbum(req.params.id, albumData);
    res.redirect("/");
  }
});

app.post("/delete-album/:id", (req, res) => {
  albums.deleteAlbum(req.params.id);
  res.redirect("/");
});

app.post("/add-comment", (req, res) => {
  const { albumId, comment } = req.body;
  if (comment && comment.trim()) {
    comments.push({
      albumId,
      comment: comment.trim(),
      date: new Date().toISOString()
    });
  }
  res.redirect(`/album/${albumId}`);
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});