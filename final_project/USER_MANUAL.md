# Express Book Reviews - User Manual

## Table of Contents
1. [Getting Started](#getting-started)
2. [API Endpoints Overview](#api-endpoints-overview)
3. [Public Endpoints](#public-endpoints)
4. [User Authentication](#user-authentication)
5. [Protected Endpoints](#protected-endpoints)
6. [Error Handling](#error-handling)
7. [Testing with Postman](#testing-with-postman)
8. [Sample Workflows](#sample-workflows)

---

## Getting Started

### Prerequisites
- Node.js installed on your system
- npm or yarn package manager
- API testing tool (Postman recommended)

### Installation & Setup
1. Navigate to the project directory:
   ```bash
   cd final_project
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the server:
   ```bash
   node index.js
   ```

4. Server will run on `http://localhost:3000` (or the port specified in PORT environment variable)

---

## API Endpoints Overview

### Public Endpoints (No Authentication Required)
- `GET /` - Get all books (async implementation)
- `GET /isbn/:isbn` - Get book by ISBN (async implementation)
- `GET /author/:author` - Get books by author (async implementation)
- `GET /title/:title` - Get books by title (async implementation)
- `GET /review/:isbn` - Get book reviews
- `POST /register` - Register new user

### Authentication Endpoints
- `POST /customer/login` - User login

### Protected Endpoints (Authentication Required)
- `PUT /customer/auth/review/:isbn` - Add/modify book review
- `DELETE /customer/auth/review/:isbn` - Delete book review

---

## Public Endpoints

### 1. Get All Books
**Endpoint:** `GET /`
**Description:** Retrieve all books available in the shop

**Request:**
```http
GET http://localhost:3000/
```

**Response:**
```json
{
    "1": {
        "author": "Chinua Achebe",
        "title": "Things Fall Apart",
        "reviews": {}
    },
    "2": {
        "author": "Hans Christian Andersen",
        "title": "Fairy tales",
        "reviews": {}
    },
    ...
}
```

### 2. Get Book by ISBN
**Endpoint:** `GET /isbn/:isbn`
**Description:** Get details of a specific book by its ISBN

**Request:**
```http
GET http://localhost:3000/isbn/1
```

**Response:**
```json
{
    "author": "Chinua Achebe",
    "title": "Things Fall Apart",
    "reviews": {}
}
```

**Error Response:**
```json
{
    "message": "Book not found"
}
```

### 3. Get Books by Author
**Endpoint:** `GET /author/:author`
**Description:** Get all books by a specific author

**Request:**
```http
GET http://localhost:3000/author/Jane Austen
```

**Response:**
```json
{
    "8": {
        "author": "Jane Austen",
        "title": "Pride and Prejudice",
        "reviews": {}
    }
}
```

### 4. Get Books by Title
**Endpoint:** `GET /title/:title`
**Description:** Get all books matching a specific title

**Request:**
```http
GET http://localhost:3000/title/Things Fall Apart
```

**Response:**
```json
{
    "1": {
        "author": "Chinua Achebe",
        "title": "Things Fall Apart",
        "reviews": {}
    }
}
```

### 5. Get Book Reviews
**Endpoint:** `GET /review/:isbn`
**Description:** Get all reviews for a specific book

**Request:**
```http
GET http://localhost:3000/review/1
```

**Response:**
```json
{
    "user1": "Great book!",
    "user2": "Amazing story!"
}
```

### 6. User Registration
**Endpoint:** `POST /register`
**Description:** Register a new user

**Request:**
```http
POST http://localhost:3000/register
Content-Type: application/json

{
    "username": "john_doe",
    "password": "secure123"
}
```

**Success Response:**
```json
{
    "message": "User registered successfully"
}
```

**Error Responses:**
```json
{
    "message": "Username is required"
}
```
```json
{
    "message": "Password is required"
}
```
```json
{
    "message": "Username already exists"
}
```

---

## User Authentication

### User Login
**Endpoint:** `POST /customer/login`
**Description:** Login with registered credentials

**Request:**
```http
POST http://localhost:3000/customer/login
Content-Type: application/json

{
    "username": "john_doe",
    "password": "secure123"
}
```

**Success Response:**
```json
{
    "message": "User successfully logged in"
}
```

**Error Responses:**
```json
{
    "message": "Invalid username or password"
}
```

**Important Notes:**
- Successful login creates a JWT token stored in the session
- The session is required for accessing protected endpoints
- JWT token expires after 1 hour

---

## Protected Endpoints

### 1. Add/Modify Book Review
**Endpoint:** `PUT /customer/auth/review/:isbn`
**Description:** Add a new review or modify existing review for a book

**Request:**
```http
PUT http://localhost:3000/customer/auth/review/1?review=This is an amazing book!
```

**Success Response:**
```json
{
    "message": "Review added/modified successfully"
}
```

**Behavior:**
- If user has no previous review: Creates new review
- If user has existing review: Modifies existing review
- Each user can have only one review per book

### 2. Delete Book Review
**Endpoint:** `DELETE /customer/auth/review/:isbn`
**Description:** Delete your own review for a book

**Request:**
```http
DELETE http://localhost:3000/customer/auth/review/1
```

**Success Response:**
```json
{
    "message": "Review deleted successfully"
}
```

**Error Response:**
```json
{
    "message": "Review not found for this user"
}
```

**Important Notes:**
- Users can only delete their own reviews
- Cannot delete other users' reviews
- Must be authenticated to access this endpoint

---

## Error Handling

### Authentication Errors
- **403 Forbidden:** "User not logged in" or "User not authenticated"
- **401 Unauthorized:** Invalid credentials during login
- **400 Bad Request:** Missing required fields

### Resource Errors
- **404 Not Found:** Book not found, review not found
- **409 Conflict:** Username already exists during registration

### Validation Errors
- **400 Bad Request:** Missing username, password, or review content

---

## Testing with Postman

### Setup
1. Download and install Postman
2. Create a new collection for "Express Book Reviews"
3. Set base URL as: `http://localhost:3000`

### Authentication Flow
1. **Register User:**
   - POST `/register`
   - Body: `{"username": "testuser", "password": "testpass"}`

2. **Login User:**
   - POST `/customer/login`
   - Body: `{"username": "testuser", "password": "testpass"}`
   - **Important:** Enable "Send cookies" in Postman settings

3. **Access Protected Routes:**
   - Use same Postman session after login
   - Cookies will be automatically sent

### Testing Protected Routes
- Ensure you're logged in first
- Keep the same Postman session active
- If you get 403 errors, re-login

---

## Sample Workflows

### Workflow 1: Browse Books
1. `GET /` - See all available books
2. `GET /isbn/1` - Get details of book #1
3. `GET /author/Jane Austen` - Find all books by Jane Austen
4. `GET /review/1` - Check reviews for book #1

### Workflow 2: User Registration & Login
1. `POST /register` - Create new account
2. `POST /customer/login` - Login with credentials
3. `PUT /customer/auth/review/1?review=Great book!` - Add review
4. `GET /review/1` - Verify review was added

### Workflow 3: Review Management
1. Login to your account
2. `PUT /customer/auth/review/1?review=Amazing story!` - Add review
3. `PUT /customer/auth/review/1?review=Updated: Incredible book!` - Modify review
4. `DELETE /customer/auth/review/1` - Delete review
5. `GET /review/1` - Verify review was deleted

---

## Asynchronous Implementation

### Enhanced Features
The application now includes **asynchronous implementations** for the main book browsing endpoints:

- **GET /**: Uses Promise-based async operations for retrieving all books
- **GET /isbn/:isbn**: Async book lookup by ISBN with enhanced error handling
- **GET /author/:author**: Async author search with Promise callbacks
- **GET /title/:title**: Async title search with improved performance

### Technical Benefits
- **Non-blocking operations**: Improved server performance
- **Better error handling**: Comprehensive error catching and reporting
- **Scalability**: Ready for external API integration
- **Modern JavaScript**: Uses async/await and Promise patterns

### For Developers
These endpoints maintain the same API interface but now use:
- **Async-await pattern** for clean, readable code
- **Promise callbacks** (.then/.catch) as alternative implementations
- **Simulated delays** to demonstrate async behavior
- **Enhanced error responses** with proper HTTP status codes

---

## Book Database

The application includes 10 pre-loaded books:
1. "Things Fall Apart" by Chinua Achebe
2. "Fairy tales" by Hans Christian Andersen
3. "The Divine Comedy" by Dante Alighieri
4. "The Epic Of Gilgamesh" by Unknown
5. "The Book Of Job" by Unknown
6. "One Thousand and One Nights" by Unknown
7. "Njál's Saga" by Unknown
8. "Pride and Prejudice" by Jane Austen
9. "Le Père Goriot" by Honoré de Balzac
10. "Molloy, Malone Dies, The Unnamable, the trilogy" by Samuel Beckett

---

## Troubleshooting

### Common Issues
1. **Server not starting:** Check if port 5000 is available
2. **Authentication errors:** Ensure cookies are enabled in your client
3. **Book not found:** Use valid ISBN numbers (1-10)
4. **Review operations fail:** Make sure you're logged in and using the correct session

### Debug Tips
- Check server console for error messages
- Verify request headers include cookies for protected routes
- Ensure JSON format is correct for POST requests
- Use exact author/title names for search endpoints

---

*This manual covers all implemented features. For additional support, check the server console logs for detailed error messages.* 