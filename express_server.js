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
  const templateVars = { urls: urlDatabase, username: req.cookies["username"] };
  res.render("urls_index", templateVars);
});

// render NEW URL form
app.get("/urls/new", (req, res) => {
  const templateVars = { username: req.cookies["username"] };
  res.render("urls_new", templateVars);
});

// POST NEW form on urls path
app.post("/urls", (req, res) => {
  const shortURL = req.params.shortURL;
  const userSubmittedLongURL = req.body.longURL; // Log the POST request body to the console
  const generatedShortURL = generateRandomString();
  urlDatabase[generatedShortURL] = userSubmittedLongURL;
  res.redirect(`/urls/${generatedShortURL}`); // Respond with 'Ok' (we will replace this)
});

// shortURL site
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL];
  const templateVars = { shortURL, longURL, username: req.cookies["username"] };
  res.render("urls_show", templateVars);
});

// get request to DELTE
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
  console.log(urlDatabase[shortURL]);
  res.redirect("/urls");
});

// track username with cookies
app.post("/login", (req, res) => {
  const username = req.body.username;
  res.cookie("username", username);
  const templateVars = {
    username: req.cookies["username"],
  };
  res.redirect("/urls");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});
