# 🚀 5-Minute Setup Guide

Get your Secure Blog Management System up and running in 5 minutes!

## 📋 Prerequisites Checklist

Before starting, ensure you have:
- [ ] Node.js v16+ installed (`node --version`)
- [ ] npm v8+ installed (`npm --version`)
- [ ] MongoDB account (local or [MongoDB Atlas](https://www.mongodb.com/cloud/atlas))
- [ ] Cloudinary account (free tier at [cloudinary.com](https://cloudinary.com))
- [ ] Git installed

---

## ⚡ 5-Minute Setup

### Step 1: Clone & Install (2 minutes)

```bash
# Clone the project
git clone https://github.com/ShahZaib03-co/Final-Year-Project
cd Final-Year-Project

# Install all dependencies
npm run install-all

# This will:
# - Install root dependencies
# - Install backend dependencies (backend/src)
# - Install frontend dependencies (frontend/src)
```

### Step 2: Configure Environment (2 minutes)

```bash
# Copy environment templates
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

#### Backend Configuration (`backend/.env`)

```env
# Server
PORT=5000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/blog-system
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-system

# JWT
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars-long
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars-long
JWT_ACCESS_EXPIRE=15m
JWT_REFRESH_EXPIRE=7d

# Cloudinary
CLOUDINARY_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret

# CORS
CLIENT_URL=http://localhost:5173

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# Security
COOKIE_SECRET=your-cookie-secret-min-32-chars-long
```

#### Frontend Configuration (`frontend/.env`)

```env
VITE_API_URL=http://localhost:5000
VITE_ENV=development
```

### Step 3: Start Development (1 minute)

```bash
# Make sure MongoDB is running!
# Terminal 1: Start MongoDB (if running locally)
mongod

# Terminal 2: Start both backend and frontend
npm run dev

# Frontend will be available at: http://localhost:5173
# Backend API at: http://localhost:5000
# API Docs at: http://localhost:5000/api/docs
```

---

## 🗄️ MongoDB Setup

### Option A: Local MongoDB

```bash
# macOS (with Homebrew)
brew services start mongodb-community

# Windows
# Download from: https://docs.mongodb.com/manual/tutorial/install-mongodb-on-windows/
# Or use Chocolatey: choco install mongodb

# Linux (Ubuntu/Debian)
sudo systemctl start mongod
```

### Option B: MongoDB Atlas (Cloud)

1. Create account at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Click "Connect" and get connection string
4. Replace in `backend/.env`:
   ```
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/blog-system
   ```

---

## 🖼️ Cloudinary Setup

1. Sign up at [cloudinary.com](https://cloudinary.com)
2. Go to Dashboard → Settings
3. Copy these values to `backend/.env`:
   - `CLOUDINARY_NAME` (Cloud name)
   - `CLOUDINARY_API_KEY` (API Key)
   - `CLOUDINARY_API_SECRET` (API Secret)

---

## ✅ Verify Installation

### Test Backend

```bash
# Should return 200 OK
curl http://localhost:5000/health

# Should return JSON with API info
curl http://localhost:5000

# Should show Swagger UI
# Visit: http://localhost:5000/api/docs
```

### Test Frontend

```bash
# Visit in browser
http://localhost:5173

# You should see:
# - Navigation bar
# - Blog listing page
# - Login/Register links
```

---

## 🧪 Test a Complete Flow

### 1. Register a New Account

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!",
    "name": "Test User"
  }'
```

### 2. Login

```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "TestPass123!"
  }'
```

Copy the `accessToken` from response.

### 3. Create a Blog Post

```bash
curl -X POST http://localhost:5000/api/blogs \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "My First Blog",
    "content": "This is my first blog post!",
    "excerpt": "Introduction to blogging"
  }'
```

---

## 🚀 Available Scripts

### Root Level

```bash
npm run install-all        # Install all dependencies
npm run dev                # Start both backend and frontend
npm run backend            # Start only backend
npm run frontend           # Start only frontend
```

### Backend (`backend/src`)

```bash
npm run dev                # Start with nodemon (auto-reload)
npm start                  # Start normally
npm run lint               # Run linter (if configured)
npm test                   # Run tests (if configured)
```

### Frontend (`frontend/src`)

```bash
npm run dev                # Start Vite dev server
npm run build              # Build for production
npm run preview            # Preview production build
```

---

## 🐛 Troubleshooting

### "Port 5000 already in use"

```bash
# Find and kill the process using port 5000
# macOS/Linux
lsof -i :5000
kill -9 <PID>

# Windows PowerShell
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess
```

### "Cannot connect to MongoDB"

```bash
# Check MongoDB is running
mongod

# Verify connection string in .env
# Test connection:
mongo "mongodb://localhost:27017"
```

### "CORS error in frontend"

- Ensure `CLIENT_URL` in `backend/.env` matches your frontend URL
- Default: `http://localhost:5173`

### "Cloudinary upload fails"

- Verify credentials in `backend/.env`
- Ensure API Key and Secret are correct
- Check Cloudinary dashboard for active account

### "Module not found errors"

```bash
# Clear and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Do the same for backend and frontend
cd backend/src && npm install
cd ../../frontend/src && npm install
```

---

## 📚 Project Structure Quick Reference

```
blog-system/
├── backend/src/          # Express.js REST API
│   ├── app.js           # Express app configuration
│   ├── server.js        # Server entry point
│   ├── controllers/     # Business logic
│   ├── models/          # Mongoose schemas
│   ├── routes/          # API endpoints
│   └── middleware/      # Auth, validation, errors
│
├── frontend/src/        # React + Vite frontend
│   ├── pages/           # Page components
│   ├── components/      # Reusable components
│   ├── api/             # API client
│   ├── store/           # Zustand state
│   └── App.jsx          # Root component
│
└── package.json         # Root npm config
```

---

## 🌐 Deployment

### Deploy Backend to Heroku

```bash
heroku create your-app-name
git push heroku main
heroku config:set JWT_ACCESS_SECRET="your-secret"
```

### Deploy Frontend to Vercel

```bash
npm install -g vercel
vercel
```

See [README.md](./README.md) for detailed deployment guides.

---

## 🆘 Getting Help

- **API Documentation**: Visit http://localhost:5000/api/docs
- **GitHub Issues**: [Create an issue](https://github.com/ShahZaib03-co/Final-Year-Project/issues)
- **Check ERROR_ANALYSIS.md**: Common issues and solutions

---

## ✅ Next Steps

1. ✅ Setup complete!
2. 📖 Read [README.md](./README.md) for features overview
3. 🔍 Explore API at http://localhost:5000/api/docs
4. 🛠️ Start building and customizing!

---

**Happy coding! 🎉**
