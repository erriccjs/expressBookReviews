const express = require('express');
let books = require('./booksdb.js');
let isValid = require('./auth_users.js').isValid;
let users = require('./auth_users.js').users;
const public_users = express.Router();

public_users.post('/register', (req, res) => {
  const { username, password } = req.body;

  //Check if both username and password are provided
  if (!username || !password) {
    return res
      .status(400)
      .json({ message: 'Username and password are required' });
  }

  //Check if the username is already taken
  const existingUser = users.find((user) => user.username === username);
  if (existingUser) {
    return res.status(400).json({ message: 'Username is already taken' });
  }

  //Register the new user
  users.push({ username, password });
  return res.status(201).json({ message: 'User registered successfully' });
});

// Get the book list available in the shop
public_users.get('/', async function (req, res) {
  try {
    const bookList = await new Promise((resolve) => {
      setTimeout(() => {
        resolve(books);
      }, 1000);
    });
    return res.status(200).send(JSON.stringify(booksList, null, 2));
  } catch (error) {
    return res.status(500).json({ message: 'Error fetching book list' });
  }
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn', function (req, res) {
  // Extract the ISBN (which in your case is a key in the books object)
  let isbn = req.params.isbn;

  // Check if the book exists in the books object using the ISBN as a key
  let book = books[isbn];

  // If book is found, return it as a JSON response
  if (book) {
    return res.status(200).json(book);
  }
  // If the book is not found, return a 404 status with an error message
  else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Get book details based on author
public_users.get('/author/:author', function (req, res) {
  let author = req.params.author.toLowerCase(); // Convert author to lowercase for case-insensitive matching
  let results = [];

  // Iterate through the books object to find matches
  for (let key in books) {
    if (books[key].author.toLowerCase() === author) {
      results.push(books[key]);
    }
  }

  // If we find matching books, return them
  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Get all books based on title
public_users.get('/title/:title', function (req, res) {
  let title = req.params.author.toLowerCase(); // Convert author to lowercase for case-insensitive matching
  let results = [];

  // Iterate through the books object to find matches
  for (let key in books) {
    if (books[key].title.toLowerCase() === title) {
      results.push(books[key]);
    }
  }

  // If we find matching books, return them
  if (results.length > 0) {
    return res.status(200).json(results);
  } else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

//  Get book review
public_users.get('/review/:isbn', function (req, res) {
  // Extract the ISBN from the request parameters
  let isbn = req.params.isbn;

  // Check if the book with the given ISBN exists
  let book = books[isbn];

  // If the book exists, return the reviews
  if (book) {
    return res.status(200).json(book.reviews);
  }
  // If the book is not found, return a 404 status with an error message
  else {
    return res.status(404).json({ message: 'Book not found' });
  }
});

module.exports.general = public_users;
