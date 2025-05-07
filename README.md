# Online Bookshop App

## Overview
A JSON-based web application for an online bookshop with user authentication, book browsing via Google Books API, shopping cart, and checkout features.

## Tech Stack
- Frontend: HTML5, CSS3, JS
- Backend: Node.js + Express.js
- Database: MySQL
- Auth: JWT
- External API: Google Books API

# Setup Instructions

1. Install dependencies:
   ```
   npm install
   ```

2. Set environment variables in `.env` file, including:
   - `JWT_SECRET` for token signing.
   - Database connection string.

3. Run Prisma migrations and generate client:
   ```
   npx prisma migrate dev
   npx prisma generate
   ```

4. Start the development server:
   ```
   npm run dev
   ```



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

# Notes

- All API routes use Next.js API route conventions.
- Authentication is handled via JWT tokens stored in HTTP-only cookies.
- Profile updates validate required fields and update the database accordingly.
- Order history is fetched securely for the authenticated user.


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
    ├── orderitems
    ├── cart
    └── orders
