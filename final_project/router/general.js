const express = require("express");
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const userExist = (username) => {
  let equalName = users.filter((user) => {
    return user.username === username;
  });
  if (equalName.length > 0) {
    return true;
  } else {
    return false;
  }
};

public_users.post("/register", (req, res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;

  if (username && password) {
    if (!userExist(username)) {
      users.push({ username: username, password: password });
      return res.status(200).json({ message: "The user is registered" });
    } else {
      return res.status(404).json({ message: "This user exists !" });
    }
  }

  return res.status(404).json({ message: "Can't register the user!" });
});

// Get the book list available in the shop
public_users.get("/", function (req, res) {
  //Write your code here
  res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get("/isbn/:isbn", function (req, res) {
  //Write your code here
  let ISBN = req.params.isbn;
  res.send(books[ISBN]);
});

// Get book details based on author
public_users.get("/author/:author", function (req, res) {
  //Write your code here
  let authBook = [];
  for (const [key, values] of Object.entries(books)) {
    const book = Object.entries(values);
    for (let i = 0; i < book.length; i++) {
      if (book[i][0] == "author" && book[i][1] == req.params.author) {
        authBook.push(books[key]);
      }
    }
  }
  if (authBook.length == 0) {
    return res.status(300).json({ message: "The author does not exist!" });
  }
  res.send(authBook);
});

// Get all books based on title
public_users.get("/title/:title", function (req, res) {
  //Write your code here
  let bookTitle = [];
  for (const [key, values] of Object.entries(books)) {
    const book = Object.entries(values);
    for (let i = 0; i < book.length; i++) {
      if (book[i][0] == "title" && book[i][1] == req.params.title) {
        bookTitle.push(books[key]);
      }
    }
  }
  if (bookTitle.length == 0) {
    return res.status(300).json({ message: "The title does not exist!" });
  }
  res.send(bookTitle);
});

//  Get book review
public_users.get("/review/:isbn", function (req, res) {
  //Write your code here
  let ISBN = req.params.isbn;
  res.send(books[ISBN].reviews);
});

//Task 10 getting all books.
const getAvailableBooksList = () => {
  return new Promise((resolve, reject) => {
    resolve(books);
  });
};

public_users.get("/", function (req, res) {
  getAvailableBooksList().then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  );
});

//Task 11 search by ISBN.
const getBookFromISBN = (isbn) => {
  let book_ = books[isbn];
  return new Promise((resolve, reject) => {
    if (book_) {
      resolve(book_);
    } else {
      reject("book not found!");
    }
  });
};

public_users.get("/isbn/:isbn", function (req, res) {
  const isbn = req.params.isbn;
  getBookFromISBN(isbn).then(
    (bk) => res.send(JSON.stringify(bk, null, 4)),
    (error) => res.send(error)
  );
});

//Task 12 search by author.

const getBookFromAuthor = (author) => {
  let data = [];
  return new Promise((resolve, reject) => {
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.author === author) {
        output.push(book_);
      }
    }
    resolve(data);
  });
};

public_users.get("/author/:author", function (req, res) {
  const author = req.params.author;
  getBookFromAuthor(author).then((result) =>
    res.send(JSON.stringify(result, null, 4))
  );
});

//Task 13 rsearch by title.

const getBookFromTitle = (title) => {
  let data = [];
  return new Promise((resolve, reject) => {
    for (var isbn in books) {
      let book_ = books[isbn];
      if (book_.title === title) {
        output.push(book_);
      }
    }
    resolve(data);
  });
};

public_users.get("/title/:title", function (req, res) {
  const title = req.params.title;
  getBookFromTitle(title).then((result) =>
    res.send(JSON.stringify(result, null, 4))
  );
});

module.exports.general = public_users;
