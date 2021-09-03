const express = require("express");
const app = express();
const PORT = 8080; //default port 8080
const bodyParser = require("body-parser");
const cookieSession = require("cookie-session");
app.use(bodyParser.urlencoded({ extended: true }));
const {
  generateRandomString,
  emailTaken,
  urlsForUser,
  getUserByEmail,
} = require("./helpers.js");
const { urlDatabase } = require("./constants");

const bcrypt = require("bcrypt");

app.set("view engine", "ejs");
app.use(
  cookieSession({
    name: "session",
    keys: ["key1", "key2"],
  })
);

const users = {
  userRandomID: {
    id: "userRandomID",
    email: "user@example.com",
    password: bcrypt.hashSync("purple-monkey-dinosaur", 10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "user2@example.com",
    password: bcrypt.hashSync("dishwasher-funk", 10),
  },
};

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
  const userID = req.session.user_id;
  const urls = urlsForUser(userID);

  const templateVars = {
    urls,
    user: users[userID],
  };
  res.render("urls_index", templateVars);
});

// render NEW URL form
app.get("/urls/new", (req, res) => {
  const templateVars = { user: users[req.session.user_id] };
  res.render("urls_new", templateVars);
});

// POST NEW form on urls path
app.post("/urls", (req, res) => {
  // const shortURL = req.params.shortURL;
  const userSubmittedLongURL = req.body.longURL;
  const generatedShortURL = generateRandomString();
  urlDatabase[generatedShortURL] = {
    longURL: userSubmittedLongURL,
    userID: req.session.user_id,
  };
  res.redirect(`/urls/${generatedShortURL}`);
});

// shortURL site
app.get("/urls/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  console.log(shortURL, urlDatabase);
  const longURL = urlDatabase[shortURL].longURL;
  const templateVars = { shortURL, longURL, user: users[req.session.user_id] };
  res.render("urls_show", templateVars);
});

//
app.get("/u/:shortURL", (req, res) => {
  const shortURL = req.params.shortURL;
  const longURL = urlDatabase[shortURL].longURL;
  res.redirect(longURL);
});

// added DELETE function
app.post("/urls/:shortURL/delete", (req, res) => {
  if (req.session.user_id) {
    const shortURL = req.params.shortURL;
    delete urlDatabase[shortURL];
  }
  res.redirect("/urls");
});

// added EDIT function
app.post("/urls/:shortURL", (req, res) => {
  if (req.session.user_id) {
    const shortURL = req.params.shortURL;
    const userSubmittedLongURL = req.body.longURL;
    urlDatabase[shortURL].longURL = userSubmittedLongURL;
  }
  res.redirect("/urls");
});

// added logout function
app.post("/logout", (req, res) => {
  req.session = null;
  res.redirect("/urls");
});

// track with cookies
app.post("/login", (req, res) => {
  const password = req.body.password;
  const email = req.body.email;
  if (!email || !password) {
    return res.status(403).send("Email or password cannot be empty");
  }

  const user = getUserByEmail(email, users);
  if (!user) {
    return res.status(403).send("Invalid Email");
  }

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(403).send("Invalid Password");
  }

  req.session.user_id = user.id;
  res.redirect("/urls");
});

// GET registration
app.get("/register", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render("urls_register", templateVars);
});

// POST registration
app.post("/register", (req, res) => {
  const user = {
    id: generateRandomString(),
    email: req.body.email,
    password: bcrypt.hashSync(req.body.password, 10),
  };
  if (req.body.email === "" || req.body.password === "") {
    res.send(400);
  } else if (getUserByEmail(req.body.email)) {
    res.send(400);
  } else {
    users[user.id] = user;
    req.session.user_id = user.id;
    res.redirect("/urls");
  }
});

// GET login paths
app.get("/login", (req, res) => {
  const templateVars = {
    user: users[req.session.user_id],
  };
  res.render("urls_login", templateVars);
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

module.exports = { users };
