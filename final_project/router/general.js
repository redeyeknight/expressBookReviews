const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  //Write your code here
  return res.status(300).json({message: "Yet to be implemented"});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  //Write your code here
  return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
    res.status(200).json(book);
  }
  else {
    return res.status(404).json({message: "Book not found"});
   }  
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  const author = req.params.author.toLowerCase();
  const foundBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
  if (foundBooks.length > 0) {
    res.status(200).json(foundBooks);
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }

});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title.toLowerCase();
  const foundBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);
  if (foundBooks.length > 0) {
      res.status(200).json(foundBooks);
  } else {
      res.status(404).json({message: "No books found with this title"});
  }
});


//  Get book review

public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
      res.status(200).json(book.reviews);
  } else {
      res.status(404).json({message: "Book not found"});
  }
});
// register
public_users.get('/register',function (req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({message : "Username and password required"});
  }
  if (users.some(user => user.username === username)) {
    return res.status(400).json({message : "Username already exists"});
  }
  users.push({ username, password });
  return res.status(200).json({message : "User registered successfully" });
});

module.exports.general = public_users;
