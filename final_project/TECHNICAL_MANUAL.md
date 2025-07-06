# Express Book Reviews - Technical Manual

## Table of Contents
1. [Architecture Overview](#architecture-overview)
2. [Project Structure](#project-structure)
3. [Dependencies & Setup](#dependencies--setup)
4. [Core Implementations](#core-implementations)
5. [Asynchronous Programming](#asynchronous-programming)
6. [Authentication & Security](#authentication--security)
7. [Error Handling](#error-handling)
8. [Database Operations](#database-operations)
9. [Code Examples](#code-examples)
10. [Best Practices](#best-practices)
11. [Testing & Debugging](#testing--debugging)
12. [Performance Considerations](#performance-considerations)

---

## Architecture Overview

### Application Structure
```
Express Book Reviews API
├── Authentication Layer (JWT + Sessions)
├── Public Routes (No Auth Required)
├── Protected Routes (Auth Required)
├── Database Layer (In-memory books object)
└── Error Handling Layer
```

### Key Components
- **Express.js**: Web application framework
- **JWT**: JSON Web Token for authentication
- **Express-Session**: Session management
- **Axios**: HTTP client for async operations
- **In-memory Database**: Simple object-based storage

---

## Project Structure

```
final_project/
├── index.js                 # Main application entry point
├── package.json            # Dependencies and scripts
├── router/
│   ├── general.js          # Public routes (books, registration)
│   ├── auth_users.js       # Protected routes (login, reviews)
│   └── booksdb.js          # Book database
├── USER_MANUAL.md          # User documentation
└── TECHNICAL_MANUAL.md     # This technical guide
```

### File Responsibilities

#### `index.js`
- Express app initialization
- Middleware setup
- Session configuration
- JWT authentication middleware
- Route mounting
- Server startup

#### `router/general.js`
- Public endpoints (no authentication required)
- Book browsing functionality
- User registration
- Async implementations for book operations

#### `router/auth_users.js`
- Protected endpoints (authentication required)
- User login/logout
- Review management (CRUD operations)
- Helper functions for user validation

#### `router/booksdb.js`
- Static book database
- 10 pre-loaded books with structure: `{author, title, reviews}`

---

## Dependencies & Setup

### Core Dependencies
```json
{
  "express": "^4.18.1",           // Web framework
  "express-session": "^1.17.3",   // Session management
  "jsonwebtoken": "^8.5.1",       // JWT authentication
  "axios": "^1.x.x",              // HTTP client for async operations
  "nodemon": "^2.0.19"            // Development server
}
```

### Installation
```bash
npm install express express-session jsonwebtoken axios
npm install --save-dev nodemon
```

### Environment Setup
```javascript
const PORT = process.env.PORT || 3000;
const JWT_SECRET = 'access';
const SESSION_SECRET = 'fingerprint_customer';
```

---

## Core Implementations

### 1. Express App Setup
```javascript
const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session');
const app = express();

// Middleware
app.use(express.json());
app.use("/customer", session({
  secret: "fingerprint_customer",
  resave: true,
  saveUninitialized: true
}));
```

### 2. Authentication Middleware
```javascript
app.use("/customer/auth/*", function auth(req, res, next) {
  if (req.session.authorization) {
    token = req.session.authorization['accessToken'];
    jwt.verify(token, "access", (err, user) => {
      if (!err) {
        req.user = user;
        next();
      } else {
        return res.status(403).json({message: "User not authenticated"});
      }
    });
  } else {
    return res.status(403).json({message: "User not logged in"});
  }
});
```

### 3. Route Mounting
```javascript
app.use("/customer", customer_routes);
app.use("/", genl_routes);
```

---

## Asynchronous Programming

### Promise-Based Helper Functions

#### Get All Books (Async)
```javascript
const getBooks = () => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        resolve(books);
      } catch (error) {
        reject(error);
      }
    }, 100);
  });
};
```

#### Get Book by ISBN (Async)
```javascript
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
    }, 100);
  });
};
```

### Async-Await Implementation
```javascript
// GET all books using async-await
public_users.get('/', async function (req, res) {
  try {
    const allBooks = await getBooks();
    res.send(JSON.stringify(allBooks, null, 4));
  } catch (error) {
    res.status(500).json({
      message: "Error fetching books",
      error: error.message
    });
  }
});
```

### Promise Callbacks Alternative
```javascript
// GET all books using Promise callbacks
public_users.get('/', function (req, res) {
  getBooks()
    .then(allBooks => {
      res.send(JSON.stringify(allBooks, null, 4));
    })
    .catch(error => {
      res.status(500).json({
        message: "Error fetching books",
        error: error.message
      });
    });
});
```

---

## Authentication & Security

### User Registration Flow
```javascript
public_users.post("/register", (req, res) => {
  const { username, password } = req.body;
  
  // Input validation
  if (!username) {
    return res.status(400).json({message: "Username is required"});
  }
  
  if (!password) {
    return res.status(400).json({message: "Password is required"});
  }
  
  // Check for existing user
  if (users.find(user => user.username === username)) {
    return res.status(409).json({message: "Username already exists"});
  }
  
  // Register new user
  users.push({username, password});
  return res.status(201).json({message: "User registered successfully"});
});
```

### User Login Flow
```javascript
regd_users.post("/login", (req, res) => {
  const { username, password } = req.body;
  
  // Validate credentials
  if (authenticatedUser(username, password)) {
    // Create JWT token
    let accessToken = jwt.sign({
      data: username
    }, 'access', { expiresIn: '1h' });
    
    // Save in session
    req.session.authorization = {
      accessToken, username
    };
    
    return res.status(200).json({message: "User successfully logged in"});
  } else {
    return res.status(401).json({message: "Invalid username or password"});
  }
});
```

### Helper Functions
```javascript
// Check if username exists
const isValid = (username) => {
  return users.some(user => user.username === username);
};

// Authenticate user credentials
const authenticatedUser = (username, password) => {
  let validUser = users.find(user => 
    user.username === username && user.password === password
  );
  return validUser !== undefined;
};
```

---

## Error Handling

### HTTP Status Codes Used
- **200**: Success
- **201**: Created (successful registration)
- **400**: Bad Request (missing required fields)
- **401**: Unauthorized (invalid credentials)
- **403**: Forbidden (not authenticated)
- **404**: Not Found (resource doesn't exist)
- **409**: Conflict (username already exists)
- **500**: Internal Server Error

### Error Response Format
```javascript
// Consistent error response structure
{
  "message": "Error description",
  "error": "Detailed error message (optional)"
}
```

### Try-Catch Pattern
```javascript
try {
  const result = await asyncOperation();
  res.send(JSON.stringify(result, null, 4));
} catch (error) {
  if (error.message === "Specific error") {
    return res.status(404).json({message: "Resource not found"});
  } else {
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
}
```

---

## Database Operations

### Book Database Structure
```javascript
let books = {
  1: {
    "author": "Chinua Achebe",
    "title": "Things Fall Apart",
    "reviews": {
      "username1": "Great book!",
      "username2": "Amazing story!"
    }
  },
  // ... more books
};
```

### User Database Structure
```javascript
let users = [
  {
    "username": "user1",
    "password": "password123"
  },
  // ... more users
];
```

### CRUD Operations

#### Create (Add Review)
```javascript
books[isbn].reviews[username] = review;
```

#### Read (Get Book)
```javascript
const book = books[isbn];
```

#### Update (Modify Review)
```javascript
books[isbn].reviews[username] = newReview;
```

#### Delete (Remove Review)
```javascript
delete books[isbn].reviews[username];
```

---

## Code Examples

### Complete Route Implementation
```javascript
// Get books by author with full error handling
public_users.get('/author/:author', async function (req, res) {
  const author = req.params.author;
  
  try {
    const booksByAuthor = await getBooksByAuthor(author);
    res.send(JSON.stringify(booksByAuthor, null, 4));
  } catch (error) {
    if (error.message === "No books found for this author") {
      return res.status(404).json({
        message: "No books found for this author"
      });
    } else {
      return res.status(500).json({
        message: "Error fetching books by author",
        error: error.message
      });
    }
  }
});
```

### Review Management
```javascript
// Add/Modify Review
regd_users.put("/auth/review/:isbn", (req, res) => {
  const isbn = req.params.isbn;
  const review = req.query.review;
  const username = req.session.authorization.username;
  
  if (!review) {
    return res.status(400).json({message: "Review is required"});
  }
  
  if (!books[isbn]) {
    return res.status(404).json({message: "Book not found"});
  }
  
  books[isbn].reviews[username] = review;
  return res.status(200).json({message: "Review added/modified successfully"});
});
```

---

## Best Practices

### 1. Code Organization
- **Modular routing**: Separate routes into logical files
- **Helper functions**: Extract reusable logic
- **Clear naming**: Use descriptive variable and function names
- **Comments**: Document complex logic

### 2. Error Handling
- **Consistent responses**: Use standard error formats
- **Proper status codes**: Return appropriate HTTP codes
- **Validation**: Check all inputs before processing
- **Logging**: Console.log errors for debugging

### 3. Security
- **Input validation**: Sanitize all user inputs
- **Authentication**: Protect sensitive endpoints
- **Session management**: Secure session configuration
- **JWT expiration**: Set reasonable token lifetimes

### 4. Async Programming
- **Use async/await**: For better readability
- **Error handling**: Always use try-catch with async/await
- **Promise chains**: Use .then/.catch for complex flows
- **Avoid callback hell**: Use Promises or async/await

### 5. Database Operations
- **Validation**: Check if records exist before operations
- **Error handling**: Handle database errors gracefully
- **Data consistency**: Ensure operations don't corrupt data
- **Performance**: Minimize database operations

---

## Testing & Debugging

### Manual Testing with Postman
```javascript
// Test sequence for book operations
1. GET /                     // Get all books
2. GET /isbn/1              // Get specific book
3. GET /author/Jane Austen  // Get books by author
4. GET /title/Book Title    // Get books by title
5. GET /review/1            // Get reviews for book
```

### Authentication Testing
```javascript
// Test authentication flow
1. POST /register           // Register new user
2. POST /customer/login     // Login user
3. PUT /customer/auth/review/1?review=Great!  // Add review
4. DELETE /customer/auth/review/1            // Delete review
```

### Debug Techniques
```javascript
// Add logging for debugging
console.log('Request parameters:', req.params);
console.log('Request body:', req.body);
console.log('Session data:', req.session);
console.log('Books data:', books);
```

### Common Issues & Solutions

**Issue**: 403 Forbidden on protected routes
**Solution**: Ensure user is logged in and session contains authorization

**Issue**: Books not found
**Solution**: Check ISBN values (1-10) and exact author/title matching

**Issue**: Reviews not saving
**Solution**: Verify user authentication and book existence

---

## Performance Considerations

### Async Operations
- **Non-blocking**: Async operations don't block event loop
- **Concurrent requests**: Multiple requests can be processed simultaneously
- **Memory usage**: Promises use memory until resolved
- **Error propagation**: Errors in async operations need proper handling

### Session Management
- **Memory storage**: Sessions stored in memory (not production-ready)
- **Cleanup**: Sessions should be cleaned up periodically
- **Security**: Session secrets should be environment variables

### Database Optimization
- **In-memory**: Current implementation uses in-memory storage
- **Indexing**: For real databases, create indexes on frequently queried fields
- **Connection pooling**: Use connection pools for database connections
- **Caching**: Implement caching for frequently accessed data

---

## Deployment Considerations

### Environment Variables
```javascript
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET || 'access';
const SESSION_SECRET = process.env.SESSION_SECRET || 'fingerprint_customer';
```

### Production Checklist
- [ ] Use environment variables for secrets
- [ ] Implement proper database (MongoDB, PostgreSQL, etc.)
- [ ] Add request logging
- [ ] Implement rate limiting
- [ ] Use HTTPS in production
- [ ] Add input sanitization
- [ ] Implement proper session store (Redis, etc.)
- [ ] Add monitoring and health checks

---

## Future Enhancements

### Potential Improvements
1. **Real Database**: Replace in-memory storage with MongoDB/PostgreSQL
2. **Password Hashing**: Use bcrypt for password security
3. **Input Validation**: Add schema validation (Joi, express-validator)
4. **API Documentation**: Generate OpenAPI/Swagger documentation
5. **Unit Tests**: Add comprehensive test suite
6. **Logging**: Implement structured logging (Winston)
7. **Caching**: Add Redis for caching
8. **Rate Limiting**: Implement request throttling
9. **CORS**: Add Cross-Origin Resource Sharing support
10. **Pagination**: Add pagination for large result sets

### Scaling Considerations
- **Load balancing**: Multiple server instances
- **Database sharding**: For large datasets
- **CDN**: For static assets
- **Microservices**: Break into smaller services
- **Container deployment**: Docker/Kubernetes

---

*This technical manual provides comprehensive coverage of all implementations in the Express Book Reviews API. For specific usage instructions, refer to the USER_MANUAL.md.* 