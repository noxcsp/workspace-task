# Task Manager

A modern, full-stack Task Management application designed with a sleek, responsive user interface and robust database integration.

## Project Structure

* **`backend/`**: Express API server with MongoDB/Mongoose models, task routes, and controllers.
* **`frontend/`**: React application powered by Vite, Tailwind CSS, and styled with Shadcn UI components.

---

## Prerequisites

* **Node.js**: Ensure you have Node.js (v18.x or later recommended) installed.
* **npm**: Node Package Manager (comes bundled with Node.js).
* **MongoDB**: A MongoDB instance (local or Mongo Atlas) for backend data storage.

---

## Setup & Installation

### 1. Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   * Create a `.env` file in the `backend/` directory:
     ```env
     PORT=5000
     NODE_ENV=development
     MONGO_URI=your_mongodb_connection_string
     ```

### 2. Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd ../frontend
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Configure Environment Variables:
   * Create a `.env` file in the `frontend/` directory (you can copy `.env.example`):
     ```env
     VITE_API_BASE_URL=http://localhost:5000/api/tasks
     ```

---

## Running the Application

To run the full stack, you need to start both the backend and frontend servers:

### Start the Backend Server
* Navigate to the `backend/` folder and run:
  ```bash
  nodemon server.js
  ```
  *(Launches the Express server with Nodemon on port `5000`)*

### Start the Frontend Server
* Navigate to the `frontend/` folder and run:
  ```bash
  npm run dev
  ```
  *(Launches the Vite dev server at `http://localhost:5173`)*

---

## Core Dependencies

### Backend
* **Express**: Fast, minimalist web framework for Node.js.
* **Mongoose**: MongoDB object modeling tool.
* **Cors**: Middleware to enable Cross-Origin Resource Sharing.
* **Dotenv**: Zero-dependency module that loads environment variables from a `.env` file.
* **Nodemon** *(Dev)*: Automatically restarts the server on code changes.

### Frontend
* **React 19 & Vite**: Fast build tool and modern frontend library.
* **Tailwind CSS**: Utility-first CSS framework.
* **Shadcn UI**: Beautiful, accessible, and customizable UI components.
* **Lucide React**: Clean and modern vector icon library.
* **Sonner**: Elegant, responsive toast notifications.
