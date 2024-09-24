const express = require('express');
const jwt = require('jsonwebtoken');
let books = require("./booksdb.js");
const regd_users = express.Router();

let users = [];

const isValid = (username)=>{ //returns boolean
//write code to check is the username is valid
}

const authenticatedUser = (username,password)=>{ 
  const user = users.find(u => u.username === username && u.password === password);
  return user !== undefined;
}

//only registered users can login
regd_users.post("/login", (req,res) => {
  const { username, password } = req.body;

  if (!username || !password) {
      return res.status(400).json({ message: "Username and password are required" });
  }

  if (authenticatedUser(username, password)) {
      let accessToken = jwt.sign({ data: username }, 'access', { expiresIn: '1h' });
      req.session.authorization = {
          accessToken
      };
      return res.status(200).json({ message: "Login successful" });
  } else {
      return res.status(403).json({ message: "Invalid username or password" });
  }
});

// Add a book review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.user.data;

  if (!books[isbn]) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (!review) {
    return res.status(400).json({ message: "Review content is required" });
  }
// Add or modify review
  books[isbn].reviews[username] = review;
  return res.status(200).json({ message: "Review added/updated successfully" });
});
regd_users.delete("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const username = req.user.data;  // Getting username from the JWT token

  if (!books[isbn]) {
      return res.status(404).json({ message: "Book not found" });
  }

  if (!books[isbn].reviews[username]) {
      return res.status(404).json({ message: "Review not found" });
  }

  // Delete the review
  delete books[isbn].reviews[username];
  return res.status(200).json({ message: "Review deleted successfully" });
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
