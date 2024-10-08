const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

const axios = require('axios');
// register
public_users.post('/register',function (req, res) {
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

// Get the book list available in the shop
public_users.get('/',async (req, res) => {
  try {
    return res.status(200).json(books);
  } catch (error) {
  return res.status(500).json({message: "Error fetching books", error })
}

});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',async (req, res) => {
  const isbn = req.params.isbn;
  try {
  const book = books[isbn];
  if (book) {
    return res.status(200).json(book);
  } else {
    return res.status(404).json({message: "Book not found"});
   } 
  } catch(error) { 
      return res.status(500).json({ message: "Error fetching books by ISBN", error });
   }
 });
  
// Get book details based on author
public_users.get('/author/:author',async (req, res) => {
  try {
  const author = req.params.author.toLowerCase();
  const foundBooks = Object.values(books).filter(book => book.author.toLowerCase() === author);
  if (foundBooks.length > 0) {
    res.status(200).json(foundBooks);
  } else {
    return res.status(404).json({message: "No books found by this author"});
  }
} catch (error){
  return res.status(500).json({ message: "Error fetching books by Author", error });

}

});

// Get all books based on title
public_users.get('/title/:title',async (req, res) => {
  try {
  const title = req.params.title.toLowerCase();
  const foundBooks = Object.values(books).filter(book => book.title.toLowerCase() === title);
  if (foundBooks.length > 0) {
      res.status(200).json(foundBooks);
  } else {
      return res.status(404).json({message: "No books found with this title"});
  }
 } catch (error) {
  return res.status(500).json({message: "Error fetching Title", error});
 }

});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  const isbn = req.params.isbn;
  const book = books[isbn];
  if (book) {
     return res.status(200).json(book.reviews);
  } else {
     return res.status(404).json({message: "Book not found"});
  }
});


module.exports.general = public_users;
