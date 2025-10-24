# BlogStation

BlogStation is a full-stack blogging platform where users can share ideas, tutorials, and stories. It features user authentication, post creation/management, and admin capabilities to manage all content.

---

## Features

* User authentication: Sign up, login, logout.
* Create, edit, and delete posts.
* Admin can edit or delete any post.
* View posts by any user.
* Responsive design.
* Dark and light mode support.
* Interactive UI with post cards and author links.

---

## Tech Stack

### Frontend
* **React.js**
* **React Router**
* **Axios** for API calls
* **CSS** (custom styling)

### Backend
* **Node.js & Express.js**
* **MongoDB + Mongoose**
* **JWT** for authentication

### Deployment
* **Backend:** Render
* **Frontend:** Vercel

---

## Live Demo

* **Frontend:** [BlogStation Frontend on Vercel](https://blog-station-seven.vercel.app/)
* **Backend API:** [BlogStation Backend on Render](https://blogstation-asjs.onrender.com)

---

## Getting Started (Local Setup)

### Backend

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Install dependencies:
    ```bash
    yarn install
    # or npm install
    ```
3.  Create a **.env** file with the following environment variables:
    ```ini
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret_key
    PORT=5000
    ```
4.  Start the backend server:
    ```bash
    yarn start
    # or npm start
    ```
    The backend runs at `http://localhost:5000`.

### Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    yarn install
    # or npm install
    ```
3.  Update Axios configuration (`src/api/axiosConfig.js`) to point to your local backend URL:
    ```javascript
    const baseURL = "http://localhost:5000";
    ```
4.  Start the frontend server:
    ```bash
    yarn start
    # or npm start
    ```
    The frontend runs at `http://localhost:3000`.

---

## API Endpoints

| Method | Endpoint | Description | Authentication |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/posts` | Retrieve all posts. | None |
| **GET** | `/api/posts/:id` | Retrieve a single post. | None |
| **POST** | `/api/posts` | Create a new post. | Required |
| **PUT** | `/api/posts/:id` | Update a post. | Required (Owner/Admin) |
| **DELETE** | `/api/posts/:id` | Delete a post. | Required (Owner/Admin) |
| **GET** | `/api/posts/user/:userId` | Get all posts by a user. | None |
| **POST** | `/auth/register` | Register a new user. | None |
| **POST** | `/auth/login` | Login and receive JWT token. | None |

---

## Environment Variables

* **MONGO\_URI**: MongoDB connection string.
* **JWT\_SECRET**: Secret key for JWT.
* **PORT**: Backend server port.

---

## Author

* Rudra — [GitHub Profile](https://github.com/Rudra181)