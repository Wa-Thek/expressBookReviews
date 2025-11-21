const express = require("express");
const jwt = require("jsonwebtoken");
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [{ username: "Wa-Thek", password: "thepass" }];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
  const userValid = users.filter((el) => el.username === username);
  return userValid.length > 0;
};

const userAuthenticated = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
  const corrAuth = users.filter(
    (el) => el.username === username && el.password === password
  );
  return corrAuth.length > 0;
};

//only registered users can login
regd_users.post("/login", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (!username || !password) {
    return res.status(404).json({ message: "Error occurs while logging in!" });
  }

  if (userAuthenticated(username, password)) {
    let accessToken = jwt.sign({ data: password }, "access", {
      expiresIn: 60 * 60,
    });
    req.session.authorization = { accessToken, username };
    return res.status(200).send("Successfull login!");
  } else {
    return res
      .status(208)
      .json({ message: "Error logging in, check your credentials! " });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  //Write your code here
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.authorization.username;
  console.log("Add review: ", req.params, req.body, req.session);
  if (books[isbn]) {
    let book = books[isbn];
    book.reviews[username] = review;
    return res.status(200).send("Review has been added!");
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} doesn't exist!` });
  }
});

regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.authorization.username;
  if (books[isbn]) {
    let book = books[isbn];
    delete book.reviews[username];
    return res.status(200).send("Reveiw is deleted successfully!");
  } else {
    return res.status(404).json({ message: `ISBN ${isbn} doesn't exist!` });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
