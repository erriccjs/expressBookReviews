const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  //returns boolean
  //write code to check is the username is valid
};

const authenticatedUser = (username, password) => {
  //returns boolean
  //write code to check if username and password match the one we have in records.
};

//only registered users can login
regd_users.post('/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  if (!isValid(username)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  if (!authenticatedUser(username, password)) {
    return res.status(401).json({ message: 'Invalid username or password' });
  }

  const accessToken = jwt.sign({ username }, 'access', { expiresIn: '1h' });

  return res
    .status(200)
    .json({ message: 'Login successful', token: accessToken });
});

// Add a book review
regd_users.put('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const review = req.body.review;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!review) {
    return res.status(400).json({ message: 'Review is required' });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  //Check if the user already reviewed the book
  if (book.reviews[username]) {
    book.reviews[username] = review;
    return res.status(400).json({ message: 'Review updated successfully' });
  } else {
    book.reviews[username] = review;
    return res.status(201).json({ message: 'Review added successfully' });
  }
});

//Delete a book review
regd_users.delete('/auth/review/:isbn', (req, res) => {
  const isbn = req.params.isbn;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  if (book.reviews[username]) {
    delete book.reviews[username];
    return res.status(200).json({ message: 'Review deleted successfully' });
  } else {
    return res.status(404).json({ message: 'Review not found' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
