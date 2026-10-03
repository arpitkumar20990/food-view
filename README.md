# Food View

Food View is a food discovery app for short food videos. Users can browse reels and food partner stores; food partners can register, manage their profile, and upload videos. Uploaded videos are stored with ImageKit, and Gemini generates their descriptions.

## Features

- User and food partner registration, login, and logout
- JWT authentication stored in cookies
- Food reel feed and food partner store pages
- Food partner profile and video uploads
- MongoDB persistence for users, partners, and food items
- ImageKit video storage and Gemini-generated descriptions

## Stack

- Frontend: React, Vite, React Router, Tailwind CSS, Axios
- Backend: Node.js, Express, Mongoose
- Services: MongoDB, ImageKit, Google Gemini API

## Project Layout

```text
food-view/
|-- backend/
|   |-- server.js
|   |-- package.json
|   `-- src/
|       |-- app.js
|       |-- controllers/
|       |-- db/
|       |-- middlewares/
|       |-- models/
|       |-- routes/
|       `-- services/
`-- frontend/
	|-- index.html
	|-- package.json
	|-- vercel.json
	`-- src/
		|-- App.jsx
		|-- config.js
		|-- Pages/
		|-- Routes/
		|-- assets/
		|-- components/
		`-- hooks/
```

## Prerequisites

- Node.js and npm
- A MongoDB database
- ImageKit credentials for video uploads
- A Google Gemini API key for generated descriptions

## Configuration

Create `backend/.env` for local development:

```env
PORT=3000
MONGODB_URL=your_mongodb_connection_string
JWT_SECRET=your_long_random_secret
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
GEMINI_API_KEY=your_gemini_api_key
FRONTEND_URL=http://localhost:5173
```

`PORT` defaults to `3000`. `FRONTEND_URL` is optional locally; set it to the deployed frontend's origin in production so the backend accepts browser requests from that site. Do not commit `.env` or expose secret values in frontend environment variables.

The frontend uses `http://localhost:3000` when `VITE_API_URL` is not set. For a custom backend URL, set `VITE_API_URL` to the backend origin, without an `/api` suffix. For example:

```env
VITE_API_URL=https://your-backend.example.com
```

## Local Development

Install dependencies in each application directory:

```bash
cd backend
npm install

cd ../frontend
npm install
```

Start the backend from `backend/`:

```bash
npm start
```

Start the frontend from `frontend/` in a second terminal:

```bash
npm run dev
```

The frontend runs at `http://localhost:5173`; the backend defaults to `http://localhost:3000`.

## API Routes

All routes are prefixed by the backend origin and `/api`.

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/user/register` | Register a user |
| `POST` | `/api/auth/user/login` | Log in a user |
| `GET` | `/api/auth/user/logout` | Log out a user |
| `POST` | `/api/auth/food-partner/register` | Register a food partner |
| `POST` | `/api/auth/food-partner/login` | Log in a food partner |
| `GET` | `/api/auth/food-partner/logout` | Log out a food partner |
| `GET` | `/api/food` | Get food items (authenticated user) |
| `POST` | `/api/food` | Upload a food video (authenticated partner; multipart field `video`) |
| `GET` | `/api/food-partner/home` | Get the authenticated partner profile |
| `GET` | `/api/food-partner/:id` | Get a partner store (authenticated user) |

## Deployment

Deploy the frontend and backend as separate applications.

### Frontend

The frontend includes a Vercel rewrite for client-side routes. Set the Vercel project root directory to `frontend`, use `npm run build` as the build command, and `dist` as the output directory. Configure `VITE_API_URL` in the frontend deployment environment with the public backend origin. This variable is embedded during the frontend build, so rebuild after changing it.

### Backend

Deploy `backend/` to a Node.js host. Use `npm install` to install dependencies and `npm start` to start the server. Configure `MONGODB_URL`, `JWT_SECRET`, `IMAGEKIT_PRIVATE_KEY`, and `GEMINI_API_KEY` in the host's environment. Set `FRONTEND_URL` to the deployed frontend origin and use the host-provided `PORT` when available.

The backend root route (`/`) returns `hello world` and can be used as a basic availability check.

## Available Frontend Checks

Run from `frontend/`:

```bash
npm run build
npm run lint
```
