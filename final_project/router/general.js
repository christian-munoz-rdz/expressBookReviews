const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

// Helper function to get books using Promise
const getBooks = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(books);
      } catch (error) {
        reject(error);
      }
    }, 100); // Simulate async operation with small delay
  });
};

// Helper function to get book by ISBN using Promise
const getBookByISBN = (isbn) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        if (books[isbn]) {
          resolve(books[isbn]);
        } else {
          reject(new Error("Book not found"));
        }
      } catch (error) {
        reject(error);
      }
    }, 100); // Simulate async operation with small delay
  });
};

// Helper function to get books by author using Promise
const getBooksByAuthor = (author) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let booksByAuthor = {};
        
        // Get all the keys for the 'books' object
        let bookKeys = Object.keys(books);
        
        // Iterate through the 'books' array & check if the author matches
        bookKeys.forEach(key => {
          if (books[key].author === author) {
            booksByAuthor[key] = books[key];
          }
        });
        
        // Check if any books were found
        if (Object.keys(booksByAuthor).length > 0) {
          resolve(booksByAuthor);
        } else {
          reject(new Error("No books found for this author"));
        }
      } catch (error) {
        reject(error);
      }
    }, 100); // Simulate async operation with small delay
  });
};

// Helper function to get books by title using Promise
const getBooksByTitle = (title) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        let booksByTitle = {};
        
        // Get all the keys for the 'books' object
        let bookKeys = Object.keys(books);
        
        // Iterate through the 'books' array & check if the title matches
        bookKeys.forEach(key => {
          if (books[key].title === title) {
            booksByTitle[key] = books[key];
          }
        });
        
        // Check if any books were found
        if (Object.keys(booksByTitle).length > 0) {
          resolve(booksByTitle);
        } else {
          reject(new Error("No books found with this title"));
        }
      } catch (error) {
        reject(error);
      }
    }, 100); // Simulate async operation with small delay
  });
};


public_users.post("/register", (req,res) => {
  //Write your code here
  const username = req.body.username;
  const password = req.body.password;
  
  // Check if username and password are provided
  if (!username) {
    return res.status(400).json({message: "Username is required"});
  }
  
  if (!password) {
    return res.status(400).json({message: "Password is required"});
  }
  
  // Check if username already exists
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  
  // Register the new user
  users.push({username: username, password: password});
  return res.status(201).json({message: "User registered successfully"});
});

// Get the book list available in the shop using async-await
public_users.get('/', async function (req, res) {
  //Write your code here
  try {
    const allBooks = await getBooks();
    res.send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({message: "Error fetching books", error: error.message});
  }
});

// Alternative implementation using Promise callbacks (.then/.catch)
/*
public_users.get('/', function (req, res) {
  //Write your code here
  getBooks()
    .then(allBooks => {
      res.send(JSON.stringify(allBooks, null, 4));
    })
    .catch(error => {
      res.status(500).json({message: "Error fetching books", error: error.message});
    });
});
*/

// Get book details based on ISBN using async-await
public_users.get('/isbn/:isbn', async function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  try {
    const book = await getBookByISBN(isbn);
    res.send(JSON.stringify(book, null, 4));
  } catch (error) {
    if (error.message === "Book not found") {
      return res.status(404).json({message: "Book not found"});
    } else {
      return res.status(500).json({message: "Error fetching book", error: error.message});
    }
  }
});

// Alternative implementation using Promise callbacks (.then/.catch)
/*
public_users.get('/isbn/:isbn', function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  getBookByISBN(isbn)
    .then(book => {
      res.send(JSON.stringify(book, null, 4));
    })
    .catch(error => {
      if (error.message === "Book not found") {
        return res.status(404).json({message: "Book not found"});
      } else {
        return res.status(500).json({message: "Error fetching book", error: error.message});
      }
    });
});
*/
  
// Get book details based on author using async-await
public_users.get('/author/:author', async function (req, res) {
  //Write your code here
  const author = req.params.author;
  
  try {
    const booksByAuthor = await getBooksByAuthor(author);
    res.send(JSON.stringify(booksByAuthor, null, 4));
  } catch (error) {
    if (error.message === "No books found for this author") {
      return res.status(404).json({message: "No books found for this author"});
    } else {
      return res.status(500).json({message: "Error fetching books by author", error: error.message});
    }
  }
});

// Alternative implementation using Promise callbacks (.then/.catch)
/*
public_users.get('/author/:author', function (req, res) {
  //Write your code here
  const author = req.params.author;
  
  getBooksByAuthor(author)
    .then(booksByAuthor => {
      res.send(JSON.stringify(booksByAuthor, null, 4));
    })
    .catch(error => {
      if (error.message === "No books found for this author") {
        return res.status(404).json({message: "No books found for this author"});
      } else {
        return res.status(500).json({message: "Error fetching books by author", error: error.message});
      }
    });
});
*/

// Get all books based on title using async-await
public_users.get('/title/:title', async function (req, res) {
  //Write your code here
  const title = req.params.title;
  
  try {
    const booksByTitle = await getBooksByTitle(title);
    res.send(JSON.stringify(booksByTitle, null, 4));
  } catch (error) {
    if (error.message === "No books found with this title") {
      return res.status(404).json({message: "No books found with this title"});
    } else {
      return res.status(500).json({message: "Error fetching books by title", error: error.message});
    }
  }
});

// Alternative implementation using Promise callbacks (.then/.catch)
/*
public_users.get('/title/:title', function (req, res) {
  //Write your code here
  const title = req.params.title;
  
  getBooksByTitle(title)
    .then(booksByTitle => {
      res.send(JSON.stringify(booksByTitle, null, 4));
    })
    .catch(error => {
      if (error.message === "No books found with this title") {
        return res.status(404).json({message: "No books found with this title"});
      } else {
        return res.status(500).json({message: "Error fetching books by title", error: error.message});
      }
    });
});
*/

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn;
  
  // Check if book exists
  if (books[isbn]) {
    // Get the book reviews based on ISBN
    res.send(JSON.stringify(books[isbn].reviews, null, 4));
  } else {
    return res.status(404).json({message: "Book not found"});
  }
});

module.exports.general = public_users;
