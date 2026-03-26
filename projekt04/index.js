const express = require("express");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const albums = require("./models/album");

const port = 3000; // nie wiem czemu na 8000 nie działa, ale na 3000 jest ok
const app = express();

const comments = [];
app.set("view engine", "ejs");

app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.use((req, res, next) => {
  const consent = req.cookies.cookie_consent;
  const themeCookie = req.cookies.theme;
  let theme = "dark";

  if (consent === "full" && (themeCookie === "light" || themeCookie === "dark")) {
    theme = themeCookie;
  } else if (consent === "minimal") {
    theme = "dark";
  }

  res.locals.theme = theme;
  res.locals.consent = consent || "none";
  console.log("Middleware: path =", req.path, "method =", req.method, "theme =", theme, "consent =", res.locals.consent);
  next();
});

app.post("/consent", (req, res) => {
  const consent = req.body.consent;

  if (consent === "full") {
    res.cookie("cookie_consent", "full", { maxAge: 365 * 24 * 60 * 60 * 1000 });
    const theme = req.body.theme === "light" ? "light" : "dark";
    res.cookie("theme", theme, { maxAge: 365 * 24 * 60 * 60 * 1000 });
  } else {
    res.cookie("cookie_consent", "minimal", { maxAge: 365 * 24 * 60 * 60 * 1000 });
    res.clearCookie("theme", { path: "/" });
  }

  res.redirect(req.get("Referer") || "/");
});

app.post("/toggle-theme", (req, res) => {
  console.log("Toggle theme called");
  const currentTheme = res.locals.theme;
  const nextTheme = currentTheme === "light" ? "dark" : "light";
  console.log("Toggle theme: current =", currentTheme, "next =", nextTheme, "consent =", res.locals.consent);

  if (res.locals.consent === "full") {
    res.cookie("theme", nextTheme, { maxAge: 365 * 24 * 60 * 60 * 1000 });
  }

  res.redirect(req.get("Referer") || "/");
});

function renderWithDefaults(res, view, data = {}) {
  const theme = res.locals.theme || "dark";
  const consent = res.locals.consent || "none";
  res.render(view, { theme, consent, ...data });
}

function log_request(req, res, next) {
  console.log(`Request ${req.method} ${req.path}`);
  next();
}
app.use(log_request);
app.use(morgan("dev"));

app.get("/", (req, res) => {
  const albumSummaries = albums.getAlbumSummaries();
  renderWithDefaults(res, "home", { albums: albumSummaries });
});

app.get("/album/:id", (req, res) => {
  const album = albums.getAlbumById(req.params.id);
  if (album) {
    const albumComments = comments.filter(c => c.albumId === req.params.id);
    renderWithDefaults(res, "album", { album, comments: albumComments });
  } else {
    res.status(404).send("Album not found");
  }
});

app.get("/about", (req, res) => {
  renderWithDefaults(res, "about");
});

app.get("/add-album", (req, res) => {
  renderWithDefaults(res, "add_album", { errors: [], album: undefined });
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
    renderWithDefaults(res, "edit_album", { album, errors: [] });
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