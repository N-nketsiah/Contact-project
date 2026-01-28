# Contact Manager - Full Stack Application

A modern, production-ready contact management application built with **Spring Boot** (backend) and **React** (frontend).

## 🚀 Tech Stack

### Backend
- **Spring Boot 3.2** - REST API framework
- **Spring Data JPA** - Database ORM
- **H2 Database** - Development database (easily switchable to MySQL/PostgreSQL)
- **Jakarta Validation** - Input validation
- **Lombok** - Code generation
- **Maven** - Build tool

### Frontend
- **React 18** - UI framework
- **Vite** - Build tool
- **Tailwind CSS** - Styling
- **Axios** - HTTP client
- **React Icons** - Icon library

## 📋 Features

✅ **Complete CRUD Operations**
- Create new contacts
- Read/view all contacts
- Update existing contacts
- Delete contacts

✅ **Advanced Functionality**
- Real-time search by name, email, or phone
- Form validation (client & server)
- Error handling and user feedback
- Responsive design
- Beautiful UI with Tailwind CSS

✅ **Professional Backend**
- RESTful API endpoints
- Database persistence
- CORS configuration
- Service layer architecture
- DTO pattern for data transfer

✅ **Production Ready**
- Proper error handling
- Input validation
- Clean code structure
- Separation of concerns (MVC)
- Ready for deployment

## 📁 Project Structure

```
Contact-Project/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/com/contactapp/
│   │   │   │   ├── ContactApiApplication.java
│   │   │   │   ├── controller/
│   │   │   │   │   └── ContactController.java
│   │   │   │   ├── service/
│   │   │   │   │   └── ContactService.java
│   │   │   │   ├── repository/
│   │   │   │   │   └── ContactRepository.java
│   │   │   │   ├── entity/
│   │   │   │   │   └── Contact.java
│   │   │   │   ├── dto/
│   │   │   │   │   └── ContactDTO.java
│   │   │   │   └── config/
│   │   │   │       └── CorsConfig.java
│   │   │   └── resources/
│   │   │       └── application.properties
│   │   └── test/ (Unit tests)
│   └── pom.xml
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── ContactList.jsx
│   │   │   ├── ContactForm.jsx
│   │   │   ├── ContactCard.jsx
│   │   │   └── SearchBar.jsx
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
└── README.md
```

## 🛠️ Setup Instructions

### Prerequisites
- **Java 17+** - [Download](https://www.oracle.com/java/technologies/javase/jdk17-archive-downloads.html)
- **Maven 3.8+** - [Download](https://maven.apache.org/download.cgi)
- **Node.js 16+** - [Download](https://nodejs.org/)

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies and build:
```bash
mvn clean install
```

3. Run the application:
```bash
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**API Endpoints:**
- `GET /api/contacts` - Get all contacts
- `GET /api/contacts/{id}` - Get contact by ID
- `POST /api/contacts` - Create new contact
- `PUT /api/contacts/{id}` - Update contact
- `DELETE /api/contacts/{id}` - Delete contact
- `GET /api/contacts/search?q=term` - Search contacts

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Start development server:
```bash
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📝 API Request/Response Examples

### Create Contact
```bash
POST /api/contacts
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country"
}

Response (201 Created):
{
  "id": 1,
  "name": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St, City, Country",
  "createdAt": "2026-01-28T10:30:00",
  "updatedAt": "2026-01-28T10:30:00"
}
```

### Get All Contacts
```bash
GET /api/contacts

Response (200 OK):
[
  {
    "id": 1,
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, City, Country",
    "createdAt": "2026-01-28T10:30:00",
    "updatedAt": "2026-01-28T10:30:00"
  }
]
```

### Search Contacts
```bash
GET /api/contacts/search?q=john

Response (200 OK):
[
  {
    "id": 1,
    "name": "John Doe",
    ...
  }
]
```

## 🧪 Testing

### Backend Tests
```bash
cd backend
mvn test
```

### Frontend Tests
```bash
cd frontend
npm test
```

## 🐳 Docker Setup (Optional)

Create a `docker-compose.yml` in the root directory:

```yaml
version: '3.8'
services:
  backend:
    build: ./backend
    ports:
      - "8080:8080"
    environment:
      - SPRING_DATASOURCE_URL=jdbc:mysql://db:3306/contactdb
      - SPRING_DATASOURCE_USERNAME=root
      - SPRING_DATASOURCE_PASSWORD=password

  db:
    image: mysql:8.0
    environment:
      - MYSQL_ROOT_PASSWORD=password
      - MYSQL_DATABASE=contactdb
    ports:
      - "3306:3306"

  frontend:
    build: ./frontend
    ports:
      - "5173:5173"
```

Run with: `docker-compose up`

## 📊 Database Schema

### Contacts Table
```sql
CREATE TABLE contacts (
  id BIGINT PRIMARY KEY AUTO_INCREMENT,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL UNIQUE,
  phone VARCHAR(20) NOT NULL,
  address VARCHAR(500),
  created_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

## 🔒 Validation Rules

### Contact Validation
- **Name**: Required, max 255 characters
- **Email**: Required, valid email format, unique
- **Phone**: Required, minimum 10 digits, supports +1-234-567-8900 format
- **Address**: Optional, max 500 characters

## 🚀 Deployment

### Backend (Heroku)
1. Build JAR: `mvn clean package`
2. Deploy: Follow Heroku Spring Boot guidelines

### Frontend (Vercel/Netlify)
1. Build: `npm run build`
2. Deploy the `dist` folder

## 📚 Learning Path

This project demonstrates:
1. **Spring Boot Basics** - Application structure, dependencies
2. **REST API Design** - CRUD operations, HTTP methods
3. **Database ORM** - JPA, entity mapping, relationships
4. **React Fundamentals** - Components, hooks, state management
5. **API Integration** - Axios, async operations
6. **UI/UX** - Responsive design with Tailwind CSS
7. **Form Handling** - Validation, error handling
8. **Best Practices** - Code organization, naming conventions

## 🤝 Contributing

Feel free to fork, modify, and enhance this project for your portfolio!

## 📄 License

This project is open source and available under the MIT License.

---

**Created:** January 2026  
**Version:** 2.0.0 (Full Stack)  
**Status:** Production Ready ✅
