const express = require('express');
const jwt = require('jsonwebtoken');
let books = require('./booksdb.js');
const regd_users = express.Router();

let users = [];

const isValid = (username) => {
  for (let user of users) {
    if (user.username === username) {
      return true;
    }
  }
};

const authenticatedUser = (username, password) => {
  for (let user of users) {
    if (user.username === username && user.password === password) {
      return true;
    }
  }
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
  const newReview = req.body.review;
  const username = req.session.username;

  if (!username) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!newReview) {
    return res.status(400).json({ message: 'Review is required' });
  }

  const book = books[isbn];
  if (!book) {
    return res.status(404).json({ message: 'Book not found' });
  }

  // Initialize the reviews array if it doesn't exist or if it was previously an object
  if (!Array.isArray(book.reviews)) {
    book.reviews = []; // Ensure reviews is an array
  }

  // Check if the user has already reviewed the book
  const existingReviewIndex = book.reviews.findIndex(
    (review) => review.username === username
  );

  if (existingReviewIndex !== -1) {
    // Update the existing review
    book.reviews[existingReviewIndex].review = newReview;
    return res.status(200).json({ message: 'Review updated successfully' });
  } else {
    // Add the new review
    book.reviews.push({ username: username.username, review: newReview });
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

  // Check if reviews is an array and find the index of the review by username
  if (Array.isArray(book.reviews)) {
    const reviewIndex = book.reviews.findIndex(
      (review) => review.username === username.username
    );

    // If the review exists, remove it from the array
    if (reviewIndex !== -1) {
      book.reviews.splice(reviewIndex, 1);
      return res.status(200).json({ message: 'Review deleted successfully' });
    } else {
      return res.status(404).json({ message: 'Review not found' });
    }
  } else {
    return res.status(404).json({ message: 'No reviews found' });
  }
});

module.exports.authenticated = regd_users;
module.exports.isValid = isValid;
module.exports.users = users;
