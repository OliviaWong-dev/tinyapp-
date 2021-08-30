const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
app.use(bodyParser.urlencoded({ extended: true }));

app.set("view engine", "ejs");
app.use(cookieParser());

const urlDatabase = {
  b2xVn2: "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com",
};

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: "purple-monkey-dinosaur",
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: "dishwasher-funk",
  },
};

function generateRandomString() {
  return Math.random().toString(36).substring(2, 8);
}

// root path send "Hello"
app.get("/", (req, res) => {
  res.send("Hello!");
});

// urlDatabase in JSON
app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

// hello path send "Hello World"
app.get("/hello", (req, res) => {
  res.send("<html><body>Hello <b>World</b></body></html>\n");
});

// urls path to render urls_index
app.get("/urls", (req, res) => {
  const templateVars = { urls: urlDatabase, user: req.cookies["user"] };
  res.render("urls_index", templateVars);
});

// render NEW URL form
app.get("/urls/new", (req, res) => {
  const templateVars = { user: req.cookies["user"] };
  res.render("urls_new", templateVars);
});

// POST NEW form on urls path
app.post("/urls", (req, res) => {
  const shortURL = req.params.shortURL;
  const userSubmittedLongURL = req.body.longURL;
  const generatedShortURL = generateRandomString();
  urlDatabase[generatedShortURL] = userSubmittedLongURL;
  res.redirect(`/urls/${generatedShortURL}`);
});

// shortURL site
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, user: req.cookies["user"] };
  res.render("urls_show", templateVars);
});

// get request to DELETE
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  res.redirect(`${longURL}`);
});

// added DELETE function
app.post("/urls/:shortURL/delete", (req, res) => {
  const shortURL = req.params.shortURL;
  delete urlDatabase[shortURL];
  res.redirect("/urls");
});

// added EDIT function
app.post("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const userSubmittedLongURL = req.body.longURL;
  urlDatabase[shortURL] = userSubmittedLongURL;
  res.redirect("/urls");
});

// added logout function
app.post("/logout", (req, res) => {
  res.clearCookie("username");
  res.redirect("/urls");
});

// track username with cookies
app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  res.redirect("/urls");
});

// GET registration
app.get("/register", (req, res) => {
  res.render("urls_register");
});

// POST registration
app.post("/register", (req, res) => {
  const newUser = {
    id: generateRandomString(),
    email: req.body.email,
    password: req.body.password,
  };
  users.user = newUser;
  res.cookie("user", users.user);
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
