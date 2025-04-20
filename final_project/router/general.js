const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  if (!(username && password)) {
    return res.status(422).send("username and password must be provided!");
  } else if (isValid(username)) {
    return res.status(403).send("username already registered!");
  } else {
    users.push({ username, password });
    return res.send("registered successfully!")
  }
});

// Get the book list available in the shop
public_users.get('/', function (req, res) {
  new Promise((resolve, reject) => {
    if (!books)
      return reject(new Error("empty books database"));
    return resolve(books);
  })
    .then((books) => res.json(books))
    .catch((err) => res.status(500).send(err.message));
  // return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  new Promise((resolve, reject) => {
    if (!books)
      return reject(new Error("empty books database"));
    return resolve(books);
  })
    .then((books) => {
      const book = books[isbn];
      if (!book)
        return res.status(404).send("Book not found!");
      return res.json(book);
    })
    .catch((err) => res.status(500).send(err.message));
  // return res.send(JSON.stringify(book, null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  new Promise((resolve, reject) => {
    if (!books)
      return reject(new Error("empty books database"));
    return resolve(books);
  })
    .then((books) => {
      const filteredBooks = {};
      let matched = 0;
      for (const [isbn, book] of Object.entries(books)) {
        if (book.author.toLowerCase() === author.toLowerCase()) {
          filteredBooks[isbn] = book;
          matched++;
        }
      }
      return { filteredBooks, matched };
    })
    .then(({ filteredBooks, matched }) => {
      if (matched === 0)
        return res.status(404).send("No books found!");
      return res.json(filteredBooks);
    })
    .catch((err) => res.status(500).send(err.message));
  // return res.send(JSON.stringify(filteredBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  new Promise((resolve, reject) => {
    if (!books)
      return reject(new Error("empty books database"));
    return resolve(books);
  })
    .then((books) => {
      const filteredBooks = {};
      let matched = 0;
      for (const [isbn, book] of Object.entries(books)) {
        if (book.title.toLowerCase() === title.toLowerCase()) {
          filteredBooks[isbn] = book;
          matched++;
        }
      }
      return { filteredBooks, matched };
    })
    .then(({ filteredBooks, matched }) => {
      if (matched === 0)
        return res.status(404).send("No books found!");
      return res.json(filteredBooks);
    })
    .catch((err) => res.status(500).send(err.message));
  // return res.send(JSON.stringify(filteredBooks, null, 4));
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book)
    return res.status(404).send("Book not found!");
  return res.json(book.reviews);
  // return res.send(JSON.stringify(book, null, 4));
});

module.exports.general = public_users;
