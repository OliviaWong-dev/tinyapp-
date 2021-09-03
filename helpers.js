const { urlDatabase } = require("./constants");
const bcrypt = require("bcrypt");

const generateRandomString = function () {
  return Math.random().toString(36).substring(2, 8);
};

const getUserByEmail = function (userSubmittedEmail, users) {
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

module.exports = { generateRandomString, getUserByEmail, urlsForUser };
