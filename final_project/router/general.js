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
  return res.json(books);
  // return res.send(JSON.stringify(books, null, 4));
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (!book)
    return res.status(404).send("Book not found!");
  return res.json(book);
  // return res.send(JSON.stringify(book, null, 4));
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  const author = req.params.author;
  const filteredBooks = {};
  let matched = 0;
  for (const [isbn, book] of Object.entries(books)) {
    if (book.author.toLowerCase() === author.toLowerCase()) {
      filteredBooks[isbn] = book;
      matched++;
    }
  }
  if (matched === 0)
    return res.status(404).send("No books found!");
  return res.json(filteredBooks);
  // return res.send(JSON.stringify(filteredBooks, null, 4));
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  const title = req.params.title;
  const filteredBooks = {};
  let matched = 0;
  for (const [isbn, book] of Object.entries(books)) {
    if (book.title.toLowerCase() === title.toLowerCase()) {
      filteredBooks[isbn] = book;
      matched++;
    }
  }
  if (matched === 0)
    return res.status(404).send("No books found!");
  return res.json(filteredBooks);
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
