# TechnoHertz LoginLogoutTracker

A full-stack employee login and logout tracking application developed using React.js, Spring Boot, and MySQL. The application enables employees to log in, track sessions, log out, and view session history through a dashboard.

## 🌐 Live Application

- **Frontend:** https://techno-hertz-login-logout-tracker-f.vercel.app
- **Backend:** https://technohertz-loginlogouttracker-1.onrender.com

## 📂 GitHub Repositories

- **Frontend:** https://github.com/MansiNipunge26/TechnoHertz-LoginLogoutTracker-Frontend
- **Backend:** https://github.com/MansiNipunge26/TechnoHertz-LoginLogoutTracker

## ✨ Features

- Employee login and credential validation
- Login session creation and tracking
- Logout functionality and session duration calculation
- Active and completed session status tracking
- Session history retrieval
- Dashboard statistics and tracked time
- REST API integration between frontend and backend
- Cloud deployment and persistent MySQL storage

## 🛠️ Technology Stack

| Technology | Purpose |
|---|---|
| React.js | Frontend development |
| Java 17 | Backend programming |
| Spring Boot | REST API development |
| Spring Data JPA and Hibernate | Database operations |
| MySQL | Relational database |
| Maven | Backend build management |
| HTML and CSS | UI structure and styling |
| Git and GitHub | Version control |
| Vercel | Frontend hosting |
| Render | Backend hosting |
| Aiven | Cloud MySQL database |

## 🏗️ Architecture

```text
Employee
   |
   v
React.js Frontend (Vercel)
   |
   | REST API
   v
Spring Boot Backend (Render)
   |
   v
Spring Data JPA / Hibernate
   |
   v
MySQL Database (Aiven)
```

### Application Workflow

1. The employee enters login credentials.
2. The React frontend sends the login request to the backend.
3. Spring Boot validates the credentials and checks the session status.
4. A successful login creates a session record in MySQL.
5. The dashboard displays session statistics and history.
6. Logout updates the session status and records the session duration.

## 🔌 REST API Endpoints

Backend base URL:

```text
https://technohertz-loginlogouttracker-1.onrender.com
```

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/login` | Validates credentials and creates a login session |
| POST | `/api/auth/logout/{sessionId}` | Logs out the specified session |
| GET | `/api/auth/history/{userId}` | Retrieves a user's session history |

### Login API

```http
POST /api/auth/login
```

Parameters: `username`, `password`.

The current backend accepts these as request parameters.

### Logout API

```http
POST /api/auth/logout/{sessionId}
```

Replace `{sessionId}` with the session ID to close.

### Session History API

```http
GET /api/auth/history/{userId}
```

Replace `{userId}` with the employee's database ID.

## 💻 Local Setup

### Prerequisites

- Java JDK 17
- Node.js and npm
- MySQL
- Git
- Visual Studio Code
- Maven or the project's Maven Wrapper

### 1. Clone the Frontend

```bash
git clone https://github.com/MansiNipunge26/TechnoHertz-LoginLogoutTracker-Frontend.git
cd TechnoHertz-LoginLogoutTracker-Frontend
npm install
npm run dev
```

Open the local URL shown in the terminal, usually `http://localhost:5173`.

### 2. Clone the Backend

Open another terminal:

```bash
git clone https://github.com/MansiNipunge26/TechnoHertz-LoginLogoutTracker.git
cd TechnoHertz-LoginLogoutTracker
```

Configure the database connection in `application.properties` or the deployment environment:

```properties
spring.datasource.url=${DB_URL}
spring.datasource.username=${DB_USERNAME}
spring.datasource.password=${DB_PASSWORD}
```

Set these environment variables to match your database configuration.

Run the backend with Maven:

```bash
mvn spring-boot:run
```

The backend normally runs at `http://localhost:8080`.

## ☁️ Deployment

- **Frontend:** Deployed on Vercel.
- **Backend:** Deployed on Render.
- **Database:** Hosted on Aiven MySQL.

The deployed frontend uses a Vercel rewrite to forward `/api` requests to the backend.

## 📸 Screenshots

Add actual application screenshots in a `screenshots` folder at the repository root.

### Login Page

![Login Page](screenshots/login-page.png)

### Employee Dashboard

![Employee Dashboard](screenshots/dashboard.png)

### Session History

![Session History](screenshots/session-history.png)

Replace these placeholder image paths with your actual screenshot files.

## 🔒 Security

- Keep database credentials in environment variables.
- Never commit passwords or secrets to GitHub.
- Validate credentials on the backend.
- Use HTTPS for deployed application traffic.
- Review password storage and authentication practices before production use.

## 🚀 Future Enhancements

- Employee and administrator roles
- Search and filtering for session history
- Exportable attendance reports
- Improved authentication and password security
- Automated testing and continuous integration

## 👩‍💻 Author

**Mansi Nipunge**

MCA — Computer Applications

- GitHub: https://github.com/MansiNipunge26
- LinkedIn: https://www.linkedin.com/in/mansi-nipunge-5aa361376/

## 📄 License

Created for educational, portfolio, and project demonstration purposes. Add a license file if you intend to distribute the project under specific licensing terms.
