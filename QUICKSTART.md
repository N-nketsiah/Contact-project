# Quick Start Guide

## 🚀 Get Up & Running in 5 Minutes

### Terminal 1: Start Backend
```bash
cd /Users/juliustawiah/Downloads/Contact-Project/backend
mvn spring-boot:run
```
Wait for: `Started ContactApiApplication`

### Terminal 2: Start Frontend
```bash
cd /Users/juliustawiah/Downloads/Contact-Project/frontend
npm install  # First time only
npm run dev
```

### Open in Browser
Visit: `http://localhost:5173`

---

## 📋 What You Have

### ✅ Backend (Spring Boot)
- REST API running on `http://localhost:8080/api`
- H2 Database (in-memory)
- CORS enabled for frontend
- Full CRUD operations
- Search functionality

### ✅ Frontend (React + Tailwind)
- Beautiful responsive UI
- Form validation
- Real-time search
- API integration
- Error handling

---

## 🔧 Common Commands

### Backend
```bash
cd backend

# Clean build
mvn clean install

# Run with debug
mvn spring-boot:run

# Run tests
mvn test

# Build JAR
mvn clean package
```

### Frontend
```bash
cd frontend

# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm preview
```

---

## 🗄️ Database

Currently using **H2 Database** (in-memory).

To switch to **MySQL**:

1. Install MySQL locally
2. Create database: `CREATE DATABASE contactdb;`
3. Update `backend/src/main/resources/application.properties`:

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/contactdb
spring.datasource.driverClassName=com.mysql.cj.jdbc.Driver
spring.datasource.username=root
spring.datasource.password=your_password
spring.jpa.database-platform=org.hibernate.dialect.MySQL8Dialect
spring.jpa.hibernate.ddl-auto=update
```

4. Data will persist between app restarts

---

## 🎯 Portfolio Tips

This project demonstrates:
- ✅ Full-stack web development
- ✅ REST API design
- ✅ Database management
- ✅ React component structure
- ✅ State management
- ✅ Form validation
- ✅ Error handling
- ✅ Responsive UI design

**Perfect for internship applications!** 🚀

---

## 📞 API Testing

Use **Postman** or **curl**:

```bash
# Get all contacts
curl http://localhost:8080/api/contacts

# Create contact
curl -X POST http://localhost:8080/api/contacts \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Jane Doe",
    "email": "jane@example.com",
    "phone": "1234567890",
    "address": "456 Oak Ave"
  }'

# Search
curl http://localhost:8080/api/contacts/search?q=jane
```

---

## 🆘 Troubleshooting

### Port 8080 already in use
```bash
# Kill process on port 8080
lsof -ti:8080 | xargs kill -9
```

### Frontend can't connect to backend
- Check backend is running on `http://localhost:8080`
- Check CORS is enabled in `CorsConfig.java`
- Check browser console for errors

### Maven build fails
```bash
mvn clean
mvn install
```

---

## 📂 Next Steps

1. **Add Authentication** - Spring Security + JWT
2. **Add Database** - Switch to MySQL/PostgreSQL
3. **Deploy** - Heroku (backend), Vercel (frontend)
4. **Add Tests** - JUnit 5 for backend, Jest for frontend
5. **Add Features** - Categories, tags, export to CSV

---

Good luck! 🎉
