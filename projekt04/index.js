import 'dotenv/config';
import express from "express";
import cookieParser from "cookie-parser";
import morgan from "morgan";
import albums from "./models/album.js";
import userModel from "./models/user.js";
import commentsModel from "./models/comment.js";
import sessionModel from "./models/session.js";
import auth from "./controllers/auth.js";

const port = 3000; // nie wiem czemu na 8000 nie działa, ale na 3000 jest ok
const app = express();

app.set("view engine", "ejs");

const COOKIE_SECRET = process.env.SECRET || "default-secret";
app.use(express.static("public"));
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser(COOKIE_SECRET));
app.use(sessionModel.sessionHandler);

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
  res.locals.user = res.locals.user || null;
  console.log("Middleware: path =", req.path, "method =", req.method, "theme =", theme, "consent =", res.locals.consent, "user =", res.locals.user ? res.locals.user.username : "anon");
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
  const currentTheme = res.locals.theme;
  const nextTheme = currentTheme === "light" ? "dark" : "light";

  if (res.locals.consent === "full") {
    res.cookie("theme", nextTheme, { maxAge: 365 * 24 * 60 * 60 * 1000 });
  }

  res.redirect(req.get("Referer") || "/");
});

function renderWithDefaults(res, view, data = {}) {
  const theme = res.locals.theme || "dark";
  const consent = res.locals.consent || "none";
  res.render(view, { theme, consent, user: res.locals.user, ...data });
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
    const albumComments = commentsModel.getCommentsForAlbum(req.params.id);
    renderWithDefaults(res, "album", { album, comments: albumComments });
  } else {
    res.status(404).send("Album not found");
  }
});

app.get("/about", (req, res) => {
  renderWithDefaults(res, "about");
});

app.get("/add-album", auth.login_required, (req, res) => {
  const user = res.locals.user;
  if (!user || !user.is_admin) {
    res.status(403).send("Tylko admin może dodawać albumy");
    return;
  }
  renderWithDefaults(res, "add_album", { errors: [], album: undefined });
});

app.post("/add-album", auth.login_required, (req, res) => {
  const user = res.locals.user;
  if (!user.is_admin) {
    res.status(403).send("Tylko admin może dodawać albumy");
    return;
  }

  const { artist, title, releaseDate, description, totalDuration, spotifyLink, songs } = req.body;
  const albumData = {
    artist,
    title,
    releaseDate,
    description,
    totalDuration,
    spotifyLink,
    songs: songs.split(",").map((s) => s.trim()),
  };
  const errors = albums.validateAlbumData(albumData);
  if (albums.hasAlbumByArtistAndTitle(albumData.artist, albumData.title)) {
    errors.push("An album with this title already exists for this artist.");
  }
  if (errors.length > 0) {
    renderWithDefaults(res, "add_album", { errors, album: albumData });
    return;
  }

  albums.addAlbum(albumData, null);
  res.redirect("/");
});

app.get("/edit-album/:id", auth.login_required, (req, res) => {
  const user = res.locals.user;
  if (!user.is_admin) {
    res.status(403).send("Tylko admin może edytować albumy");
    return;
  }

  const album = albums.getAlbumById(req.params.id);
  if (!album) {
    res.status(404).send("Album not found");
    return;
  }

  renderWithDefaults(res, "edit_album", { album, errors: [] });
});

app.post("/edit-album/:id", auth.login_required, (req, res) => {
  const user = res.locals.user;
  if (!user.is_admin) {
    res.status(403).send("Tylko admin może edytować albumy");
    return;
  }

  const album = albums.getAlbumById(req.params.id);
  if (!album) {
    res.status(404).send("Album not found");
    return;
  }

  const { artist, title, releaseDate, description, totalDuration, spotifyLink, songs } = req.body;
  const albumData = {
    artist,
    title,
    releaseDate,
    description,
    totalDuration,
    spotifyLink,
    songs: songs.split(",").map((s) => s.trim()),
  };
  const errors = albums.validateAlbumData(albumData);
  if (errors.length > 0) {
    renderWithDefaults(res, "edit_album", { errors, album: { ...albumData, id: req.params.id } });
    return;
  }

  albums.updateAlbum(req.params.id, albumData);
  res.redirect("/");
});

app.post("/delete-album/:id", auth.login_required, (req, res) => {
  const user = res.locals.user;
  if (!user.is_admin) {
    res.status(403).send("Tylko admin może usuwać albumy");
    return;
  }

  const album = albums.getAlbumById(req.params.id);
  if (!album) {
    res.status(404).send("Album not found");
    return;
  }

  albums.deleteAlbum(req.params.id);
  res.redirect("/");
});

app.post("/add-comment", auth.login_required, (req, res) => {
  const { albumId, comment } = req.body;
  if (!comment || comment.trim().length === 0) {
    res.redirect(`/album/${albumId}`);
    return;
  }

  commentsModel.addComment(albumId, res.locals.user.id, comment.trim());
  res.redirect(`/album/${albumId}`);
});

app.post("/delete-comment/:commentId", auth.login_required, (req, res) => {
  const comment = commentsModel.getComment(req.params.commentId);
  if (!comment) {
    res.status(404).send("Komentarz nie znaleziony");
    return;
  }

  const user = res.locals.user;
  if (!commentsModel.canDeleteComment(comment, user)) {
    res.status(403).send("Brak uprawnień do usuwania komentarza");
    return;
  }

  commentsModel.deleteComment(req.params.commentId);
  res.redirect(`/album/${comment.album_id}`);
});

// Auth routes
app.get("/auth/signup", auth.signup_get);
app.post("/auth/signup", auth.signup_post);
app.get("/auth/login", auth.login_get);
app.post("/auth/login", auth.login_post);
app.get("/auth/logout", auth.logout);

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});