"use strict";

const ONE_MONTH = 30 * 24 * 60 * 60 * 1000;
const THEME_COOKIE = "app-theme";
const CONSENT_COOKIE = "cookie_consent";
const LAST_VIEWED_COOKIE = "last-viewed-albums";

export function themeToggle(req, res) {
  let theme = req.cookies[THEME_COOKIE];
  if (theme === "dark") {
    theme = "light";
  } else {
    theme = "dark";
  }
  res.cookie(THEME_COOKIE, theme, { maxAge: ONE_MONTH });

  const next = req.query.next || "/";
  res.redirect(next);
}

export function consentToggle(req, res) {
  const accept = req.query.accept === "true";
  res.cookie(CONSENT_COOKIE, accept.toString(), { maxAge: ONE_MONTH });

  const next = req.query.next || "/";
  res.redirect(next);
}

export function getSettings(req) {
  const settings = {
    theme: req.cookies[THEME_COOKIE] || "dark",
    cookie_consent: req.cookies[CONSENT_COOKIE] === "true"
  };
  return settings;
}

export default {
  themeToggle,
  consentToggle,
  getSettings,
};
