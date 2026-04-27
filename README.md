# Secure Blog Management System 📚

A full-stack MERN application with secure authentication, role-based access control, and comprehensive blog management features.

## ✨ Features

- **User Authentication**: JWT-based auth with secure password hashing (bcrypt)
- **Role-Based Access Control**: Admin, Editor, and User roles
- **Blog Management**: Full CRUD operations for blog posts
- **Comments System**: Nested comments on blog posts
- **Image Upload**: Cloudinary integration for media management
- **Security**: Helmet.js, CORS, rate limiting, XSS protection, NoSQL injection prevention
- **API Documentation**: Swagger UI at `/api/docs`
- **Responsive Design**: Mobile-first Tailwind CSS frontend
- **Modern Tooling**: Vite for fast development, React 18, Express.js

## 🛠️ Tech Stack

### Backend
- **Framework**: Express.js 4.18
- **Database**: MongoDB with Mongoose
- **Authentication**: JWT (jsonwebtoken)
- **Security**: Helmet.js, CORS, express-mongo-sanitize, hpp, xss-clean
- **Validation**: express-validator
- **File Upload**: Multer + Cloudinary
- **Logging**: Winston
- **Rate Limiting**: express-rate-limit
- **API Docs**: Swagger UI

### Frontend
- **Library**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **State Management**: Zustand
- **HTTP Client**: Axios with interceptors
- **Data Fetching**: TanStack React Query
- **Styling**: Tailwind CSS
- **Notifications**: React Hot Toast
- **Rich Text**: React Quill

## 📁 Project Structure

```
Final-Year-Project/
├── backend/
│   ├── src/
│   │   ├── app.js                 # Express app setup
│   │   ├── server.js              # Server entry point
│   │   ├── config/
│   │   │   ├── database.js        # MongoDB connection
│   │   │   └── cloudinary.js      # Image upload config
│   │   ├── controllers/           # Business logic
│   │   ├── models/                # Mongoose schemas
│   │   ├── routes/                # API routes
│   │   ├── middleware/            # Auth, validation, error handling
│   │   └── utils/                 # Helpers & utilities
│   ├── swagger.yaml               # API documentation
│   └── package.json
│
├── frontend/
│   ├── src/
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React entry point
│   │   ├── api/
│   │   │   ├── axiosClient.js     # HTTP client with interceptors
│   │   │   └── services.js        # API service functions
│   │   ├── components/            # Reusable React components
│   │   ├── pages/                 # Page components
│   │   ├── store/                 # Zustand stores
│   │   ├── hooks/                 # Custom React hooks
│   │   └── index.css              # Global styles
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
├── README.md                      # This file
├── SETUP_GUIDE.md                 # Step-by-step setup
├── ERROR_ANALYSIS.md              # Technical analysis
└── package.json                   # Root package config
```

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm
- MongoDB (local or Atlas)
- Cloudinary account (for image uploads)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/ShahZaib03-co/Final-Year-Project
cd Final-Year-Project

# 2. Install dependencies for both frontend and backend
npm run install-all

# 3. Setup environment files
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env

# 4. Configure your .env files
# Edit backend/.env with MongoDB URI, JWT secrets, etc.
# Edit frontend/.env with API URL

# 5. Start MongoDB (if running locally)
mongod

# 6. Start development server
npm run dev

# Frontend: http://localhost:5173
# Backend API: http://localhost:5000
# Swagger Docs: http://localhost:5000/api/docs
```

## 🔐 Security Features

✅ **Authentication & Authorization**
- JWT tokens with refresh mechanism
- Bcrypt password hashing (12 rounds)
- Role-based access control (RBAC)

✅ **Request Security**
- Helmet.js security headers
- CORS configuration with whitelist
- Express rate limiting
- Request size limits

✅ **Data Protection**
- MongoDB injection prevention (mongo-sanitize)
- XSS attack prevention
- HTTP Parameter Pollution (HPP) protection
- Input validation and sanitization

✅ **Cookie Security**
- HttpOnly flag enabled
- Secure flag (HTTPS in production)
- SameSite protection

## 📊 API Endpoints

### Authentication
```
POST   /api/auth/register           # Register new user
POST   /api/auth/login              # User login
POST   /api/auth/logout             # User logout
POST   /api/auth/refresh            # Refresh JWT token
```

### Blogs
```
GET    /api/blogs                   # Get all blogs (paginated)
GET    /api/blogs/:id               # Get single blog
POST   /api/blogs                   # Create blog (authenticated)
PUT    /api/blogs/:id               # Update blog (owner/admin)
DELETE /api/blogs/:id               # Delete blog (owner/admin)
```

### Comments
```
POST   /api/comments                # Create comment
PUT    /api/comments/:id            # Update comment (owner)
DELETE /api/comments/:id            # Delete comment (owner/admin)
```

### Users (Admin Only)
```
GET    /api/users/admin/stats       # Get platform statistics
GET    /api/users                   # Get all users (pagination)
PUT    /api/users/:id               # Update user (admin)
DELETE /api/users/:id               # Delete user (admin)
GET    /api/users/:id               # Get user profile
```

## 🧪 Testing Examples

### Register User
```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "user@example.com",
    "password": "SecurePass123!",
    "name": "John Doe"
  }'
```

### Create Blog Post
```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog",
    "content": "This is my blog post",
    "excerpt": "Short description"
  }'
```

## 📚 Documentation

- **[SETUP_GUIDE.md](./SETUP_GUIDE.md)** - Step-by-step setup instructions
- **[ERROR_ANALYSIS.md](./ERROR_ANALYSIS.md)** - Technical analysis and fixes
- **API Docs** - Available at http://localhost:5000/api/docs (Swagger UI)

## ❓ FAQ

**Q: How do I reset my password?**
A: Contact an administrator. Password reset functionality can be added via forgot-password endpoint.

**Q: Can I customize the styling?**
A: Yes! Edit `frontend/src/index.css` or modify Tailwind config in `tailwind.config.js`.

**Q: How do I deploy this?**
A: See deployment section in SETUP_GUIDE.md for cloud hosting options.

**Q: How do I add more roles?**
A: Modify the User model's role enum and add corresponding middleware in `auth.js`.

## 🐛 Known Issues & Limitations

- File uploads limited to 10MB (configurable in Multer)
- Cloudinary account required for production image uploads
- Rate limiting is global (can be made user-specific)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 👤 Author

**Zain's Final Year Project**
- GitHub: [@ShahZaib03-co](https://github.com/ShahZaib03-co)

## 🙏 Acknowledgments

- Express.js community
- MongoDB documentation
- React ecosystem
- All open-source contributors

---

**Status**: ✅ Production Ready | **Last Updated**: April 27, 2026 | **Version**: 1.0.0
