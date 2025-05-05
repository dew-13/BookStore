# Online Bookshop App

## Overview
A JSON-based web application for an online bookshop with user authentication, book browsing via Google Books API, shopping cart, and checkout features.

## Tech Stack
- Frontend: HTML5, CSS3, JS
- Backend: Node.js + Express.js
- Database: MySQL
- Auth: JWT
- External API: Google Books API

## Setup Instructions
1. Clone the repo
2. Configure `.env` in `/backend`
3. Run `npm install` in `/backend`
4. Create the MySQL database using `database/schema.sql`
5. Start the backend with `npm start`
6. Open `frontend/index.html` in a browser

## API Endpoints
| Endpoint | Method | Description |
|---------|--------|-------------|
| `/api/users/register` | POST | User registration |
| `/api/users/login` | POST | User login |
| `/api/books/search?q=term` | GET | Book search via Google Books |
| `/api/cart` | GET | Get user's cart |
| `/api/cart/add` | POST | Add to cart |
| `/api/cart/:id` | DELETE | Remove from cart |
| `/api/order/checkout` | POST | Place order |

## Security
- JWT for user sessions
- Bcrypt password hashing
- Input validation on frontend and backend



User (Browser)
│
├── HTML/JS frontend (AJAX)
│
├── Express.js API (Node.js)
│   ├── /users/login
│   ├── /books/search
│   ├── /cart
│   └── /order/checkout
│
└── MySQL Database
    ├── users
    ├── books
    ├── cart
    └── orders
