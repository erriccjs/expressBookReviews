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
public_users.get('/isbn/:isbn', async function (req, res) {
  // Extract the ISBN (which in your case is a key in the books object)
  let isbn = req.params.isbn;

  try {
    const bookDetails = await new Promise((resolve, reject) => {
      const book = books[isbn];
      if (book) {
        resolve(book);
      } else {
        reject(new Error('Book not found'));
      }
    });
    return res.status(200).send(JSON.stringify(bookDetails, null, 2));
  } catch (error) {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Get book details based on author
public_users.get('/author/:author', async function (req, res) {
  let author = req.params.author; // Convert author to lowercase for case-insensitive matching
  let results = [];

  try {
    const matchingBooks = await new Promise((resolve, reject) => {
      for (let key in books) {
        if (books[key].author.toLowerCase() === author.toLowerCase()) {
          results.push(books[key]);
        }
      }
      if (results.length > 0) {
        resolve(results);
      } else {
        reject(new Error('Book not found'));
      }
    });
    return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
  } catch (error) {
    return res.status(404).json({ message: 'Book not found' });
  }
});

// Get all books based on title
public_users.get('/title/:title', async function (req, res) {
  let title = req.params.title; // Convert author to lowercase for case-insensitive matching
  let results = [];

  try {
    const matchingBooks = await new Promise((resolve, reject) => {
      for (let key in books) {
        if (books[key].title.toLowerCase() === title.toLowerCase()) {
          results.push(books[key]);
        }
      }
      if (results.length > 0) {
        resolve(results);
      } else {
        reject(new Error('Book not found'));
      }
    });
    return res.status(200).send(JSON.stringify(matchingBooks, null, 2));
  } catch (error) {
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
