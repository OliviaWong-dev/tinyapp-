const { urlDatabase } = require("./constants");
const bcrypt = require("bcrypt");

const users = {
  aJ48lW: {
    id: "aJ48lW",
    email: "a@a.com",
    password: bcrypt.hashSync("111", 10),
  },
  user2RandomID: {
    id: "user2RandomID",
    email: "b@b.com",
    password: bcrypt.hashSync("123", 10),
  },
};

const generateRandomString = function () {
  return Math.random().toString(36).substring(2, 8);
};

const emailTaken = function (userSubmittedEmail, database) {
  for (user in users) {
    if (users[user].email === userSubmittedEmail) {
      return users[user];
    }
  }
  return false;
};

const urlsForUser = function (id, database) {
  let userURL = {};
  for (url in urlDatabase) {
    if (urlDatabase[url].userID === id) {
      userURL[url] = urlDatabase[url];
    }
  }
  return userURL;
};

module.exports = { generateRandomString, emailTaken, urlsForUser };
