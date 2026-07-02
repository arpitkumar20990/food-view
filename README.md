# Food View

Food View is a full-stack food discovery app where users can browse short food reels and food partners can register, log in, upload reels, and manage their store profile.

## Features

- User registration and login
- Food partner registration and login
- Browse food reels on the home page
- Visit a food partner store profile
- Food partners can upload food items/reels
- JWT-based authentication with cookies
- MongoDB storage for users, food partners, and food items

## Tech Stack

### Frontend
- React
- Vite
- React Router DOM
- Tailwind CSS
- Axios

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT
- Cookie-parser
- ImageKit for file upload/storage

## Project Structure

```text
food-view/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── db/
│   │   ├── middlewares/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── services/
│   │   └── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── Pages/
│   │   ├── Routes/
│   │   └── main.jsx
│   ├── index.html
│   └── package.json
└── Readme.md
```

## Prerequisites

Before running the project, make sure you have:

- Node.js installed
- npm installed
- MongoDB running or a MongoDB connection URL available
- ImageKit credentials if file uploads are enabled

## Environment Variables

Create a `.env` file inside the backend folder with values like:

```env
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

## Installation

### 1. Install backend dependencies

```bash
cd backend
npm install
```

### 2. Install frontend dependencies

```bash
cd ../frontend
npm install
```

## Running the Project

### Start the backend

```bash
cd backend
node server.js
```

The backend will run on:

```text
http://localhost:3000
```

### Start the frontend

```bash
cd frontend
npm run dev
```

The frontend will run on:

```text
http://localhost:5173
```

## Usage

- Open the frontend in your browser.
- Register as a user or food partner.
- Users can browse reels and visit food partner stores.
- Food partners can upload food items and manage their profile.

## Notes

- The frontend is configured to communicate with the backend at `http://localhost:3000`.
- Make sure the backend is running before using the app.
- If uploads are not working, confirm your ImageKit environment variables are set correctly.
