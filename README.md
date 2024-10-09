# Faculty Evaluation System

## Project Overview

The **Faculty Evaluation System** is designed to facilitate the evaluation of faculty members across various teaching and administrative aspects. It allows for seamless evaluation data management, including features like **session conducted tracking**, **syllabus completion**, **class observations**, **committee participation**, and **research contributions**.

This system supports both **admin** and **faculty** roles, providing tailored dashboards and features to meet their respective needs. Admin users can generate reports, give evaluations, and manage committees, while faculty users can update their teaching records and receive feedback on their performance.

## Authors

-   **Omkar Mandhare**
-   **Kanishka Chordiya**

## Features

-   **Faculty Dashboard**: Manage session records, track syllabus completion, view feedback, and much more.
-   **Admin Dashboard**: Generate evaluation reports, manage committees, and provide assessments.
-   **Authentication**: Secure login system using **JWT** tokens, with different access levels for admin and faculty.
-   **Session Conducted Tracking**: Log details of conducted sessions and compare them with planned sessions.
-   **Syllabus Tracking**: Monitor syllabus completion progress.
-   **Customizable Evaluation Metrics**: Flexibility to add or remove evaluation fields as required by institutional needs.
-   **Responsive Design**: The project is designed to be fully responsive, ensuring usability across various devices.

## Technologies Used

-   **Node.js** with **Express** for the backend server.
-   **MongoDB** with **Mongoose** for database management.
-   **JWT (JSON Web Token)** for authentication.
-   **Zod** for schema validation.
-   **Bcrypt** for secure password hashing.
-   **Nodemon** for development ease.
-   **CORS** and **Cookie Parser** for handling cross-origin requests and cookies.

## Prerequisites

Ensure that the following are installed on your machine:

-   **Node.js** (v14 or higher)
-   **MongoDB** (v4.4 or higher)
-   **NPM** (Node Package Manager) or **Yarn**

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/faculty-evaluation.git
cd faculty-evaluation
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Set up Environment Variables

Create a `.env` file in the root directory and add the following variables:

```bash
PORT=3000
MONGO_URI=your_mongo_db_connection_string
JWT_SECRET=your_jwt_secret
```

### 4. Start the Application

For development mode (with auto-reloading):

```bash
npm run dev
```

For production mode:

```bash
npm start
```

### 5. Access the Application

The server will start at `http://localhost:3000`.

Admins can access the admin dashboard and reports, while faculty members can manage their teaching evaluations and reports.

## API Endpoints

### Authentication

-   **POST /auth/signup** - Create a new account
-   **POST /auth/login** - Login to an account

### Faculty

-   **GET /users/view-subjects** - View subjects assigned to the faculty
-   **POST /users/add-subjects** - Add new subjects
-   **POST /users/update-session-conducted-records** - Update session conducted records
-   **GET /users/search-session-records** - Fetch session records based on month and year

### Admin

-   **GET /admin/generate-report** - Generate monthly or custom reports
-   **POST /admin/add-evaluation** - Submit evaluations on faculty performance

## Folder Structure

```
/faculty-evaluation
│
├── /models        # Mongoose models
├── /routes        # Express routes for various modules
├── /controllers   # Logic for request handling
├── /views         # Frontend HTML, CSS, and client-side JavaScript
├── app.js         # Main server file
├── package.json   # Dependencies and scripts
└── .env.example   # Example environment variables file
```

## Future Enhancements

-   **Automated Report Generation**: Add the ability to schedule automatic report generation and email delivery.
-   **Advanced Analytics**: Provide detailed analytics on faculty performance based on various parameters.
-   **User Notifications**: Implement notifications for users when evaluations are completed or feedback is updated.

## License

This project is licensed under the **ISC License**.

---

Feel free to contribute to the project by raising issues or submitting pull requests.
