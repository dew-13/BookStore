# API Documentation

## Authentication API

### GET /api/auth/me
- Description: Retrieves the authenticated user's profile information.
- Authentication: Requires valid JWT token in HTTP-only cookie `auth_token`.
- Response:
  - 200 OK: Returns user profile data including id, username, email, and address fields.
  - 401 Unauthorized: If token is missing, invalid, or user not found.

### PUT /api/auth/profile
- Description: Updates the authenticated user's profile details including address.
- Authentication: Requires valid JWT token.
- Request Body (JSON):
  - `username` (string, required)
  - `email` (string, required)
  - `address` (string, optional)
  - `city` (string, optional)
  - `state` (string, optional)
  - `zipCode` (string, optional)
  - `country` (string, optional)
- Response:
  - 200 OK: Returns updated user profile data.
  - 400 Bad Request: If required fields are missing.
  - 500 Internal Server Error: On update failure.

## Orders API

### GET /api/orders?userId={userId}
- Description: Retrieves the order history for the specified user.
- Authentication: Requires valid user session.
- Query Parameters:
  - `userId` (string, required): The ID of the user whose orders are requested.
- Response:
  - 200 OK: Returns list of orders with details including items, shipping address, payment method, and timestamps.
  - 401 Unauthorized: If user is not authenticated.
  - 404 Not Found: If no orders found.

 
