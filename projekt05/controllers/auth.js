import userModel from "../models/user.js";
import sessionModel from "../models/session.js";

function getFormData(req, fields) {
  const data = {};
  for (let field of fields) {
    data[field.name] = req.body[field.name] || "";
  }
  return data;
}

function validateForm(data, fields) {
  const errors = {};
  for (let field of fields) {
    const value = data[field.name];
    if (field.required && (!value || typeof value !== "string" || value.trim().length === 0)) {
      errors[field.name] = "Pole jest wymagane";
      continue;
    }
    if (field.min_length && value.length < field.min_length) {
      errors[field.name] = `Pole musi zawierać minimum ${field.min_length} znaków`;
    }
    if (field.max_length && value.length > field.max_length) {
      errors[field.name] = `Pole może zawierać maksymalnie ${field.max_length} znaków`;
    }
    if (field.must_match && value !== data[field.must_match]) {
      errors[field.name] = `Zawartość musi się zgadzać z polem ${field.must_match}`;
    }
  }
  return errors;
}

function signup_get(req, res) {
  const form = {
    data: {},
    fields: signup_form_fields,
    errors: {},
    action: "/auth/signup",
    method: "POST",
  };
  res.render("auth_signup", { title: "Rejestracja", form });
}

async function signup_post(req, res) {
  const form = {
    data: getFormData(req, signup_form_fields),
    fields: signup_form_fields,
    errors: {},
    action: "/auth/signup",
    method: "POST",
  };

  form.errors = validateForm(form.data, form.fields);

  if (Object.keys(form.errors).length === 0) {
    const user = await userModel.createUser(form.data.username, form.data.password);
    if (user != null) {
      sessionModel.createSession(user.id, res);
      res.redirect("/");
      return;
    }
    form.errors.username = "Użytkownik o podanej nazwie już istnieje";
  }

  res.render("auth_signup", { title: "Rejestracja", form });
}

function login_get(req, res) {
  let nextUrl = req.query.next || "";
  const form = {
    data: {},
    fields: login_form_fields,
    errors: {},
    action: `/auth/login${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ""}`,
    method: "POST",
  };
  res.render("auth_login", { title: "Logowanie", form, nextUrl });
}

async function login_post(req, res) {
  const nextUrl = req.query.next || "/";
  const form = {
    data: getFormData(req, login_form_fields),
    fields: login_form_fields,
    errors: {},
    action: `/auth/login${nextUrl ? `?next=${encodeURIComponent(nextUrl)}` : ""}`,
    method: "POST",
  };

  form.errors = validateForm(form.data, form.fields);
  console.log("[AUTH] Login attempt - username:", form.data.username, "errors:", form.errors);
  
  if (Object.keys(form.errors).length === 0) {
    const user_id = await userModel.validatePassword(form.data.username, form.data.password);
    console.log("[AUTH] Password validation result - user_id:", user_id);
    
    if (user_id != null) {
      console.log("[AUTH] Creating session for user_id:", user_id);
      sessionModel.createSession(user_id, res);
      res.redirect(nextUrl);
      return;
    }
    form.errors.username = "Niepoprawna nazwa użytkownika lub hasło";
  }

  res.render("auth_login", { title: "Logowanie", form, nextUrl });
}

function logout(req, res) {
  sessionModel.deleteSession(res);
  res.redirect("/");
}

export default {
  signup_get,
  signup_post,
  login_get,
  login_post,
  logout,
  login_required: sessionModel.loginRequired,
};

const login_form_fields = [
  { name: "username", display_name: "Nazwa użytkownika", type: "text", min_length: 3, max_length: 25, required: true },
  { name: "password", display_name: "Hasło", type: "password", min_length: 8, required: true },
];

const signup_form_fields = [
  { name: "username", display_name: "Nazwa użytkownika", type: "text", min_length: 3, max_length: 25, required: true },
  { name: "password", display_name: "Hasło", type: "password", min_length: 8, required: true },
  { name: "password_confirm", display_name: "Powtórz hasło", type: "password", min_length: 8, required: true, must_match: "password" },
];