# ClientFlow - Client Meeting Management System

A modern, full-stack web application for managing clients and meetings with a beautiful glassmorphic UI design.

## Quick Links
- **GitHub Repository**: https://github.com/Huzaifababar007/client-meeting-app
- **Live Demo**: Coming soon on Netlify

## 🚀 Core Features

### Client Management
- ✅ Add, edit, and delete clients
- ✅ View detailed client information
- ✅ Search and filter clients
- ✅ Export client data to CSV
- ✅ Meeting count and last meeting tracking

### Meeting Management
- ✅ Schedule meetings with clients
- ✅ Edit and delete meetings
- ✅ View meeting history
- ✅ Meeting details and notes
- ✅ Date and time management

### User Authentication
- ✅ User registration and login
- ✅ JWT token-based authentication
- ✅ Password reset functionality
- ✅ Protected routes
- ✅ User profile management

### Dashboard & Analytics
- ✅ Overview of clients and meetings
- ✅ Quick statistics
- ✅ Recent activity tracking
- ✅ Responsive design

## 🎨 Bonus Features

### Modern UI/UX
- ✅ Glassmorphic design
- ✅ Responsive layout
- ✅ Dark theme
- ✅ Smooth animations
- ✅ Professional styling

### Advanced Functionality
- ✅ Real-time search
- ✅ Data export (CSV)
- ✅ Profile picture upload
- ✅ Settings persistence
- ✅ Meeting statistics

## 🛠️ Tech Stack

### Frontend
- **React 18** - Modern UI library
- **Vite** - Fast build tool
- **React Router DOM** - Client-side routing
- **Axios** - HTTP client
- **Tailwind CSS** - Utility-first CSS framework

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB ODM
- **JWT** - Authentication
- **bcryptjs** - Password hashing

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Git

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone https://github.com/Huzaifababar007/client-meeting-app.git
cd client-meeting-app
```

### 2. Install Dependencies
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 3. Environment Setup
Create `.env` file in the `backend` directory:
```env
MONGODB_URI=mongodb://localhost:27017/client-meeting-app
JWT_SECRET=your-secret-key-here
PORT=5000
```

### 4. Database Setup
```bash
cd backend
npm run seed
```

### 5. Run the Application
```bash
# Terminal 1: Start backend
cd backend
npm run dev

# Terminal 2: Start frontend
npm run dev
```

## 👤 Demo Credentials
- **Email**: demo@example.com
- **Password**: demo123

## 📁 Project Structure
```
client-meeting-app/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── context/
│   └── utils/
├── backend/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   └── seeders/
└── public/
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update profile
- `POST /api/auth/forgot-password` - Password reset

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create client
- `GET /api/clients/:id` - Get client by ID
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Meetings
- `GET /api/meetings` - Get all meetings
- `POST /api/meetings` - Create meeting
- `GET /api/meetings/:id` - Get meeting by ID
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting

## 🔐 Security Features
- JWT token authentication
- Password hashing with bcrypt
- Protected API routes
- Input validation
- CORS configuration

## 🎨 UI/UX Features
- Glassmorphic design elements
- Responsive mobile-first design
- Smooth transitions and animations
- Intuitive navigation
- Professional color scheme

## 🚀 Deployment
- Frontend: Netlify (recommended)
- Backend: Render, Railway, or Heroku
- Database: MongoDB Atlas

## 🤝 Contributing
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📞 Support
For support or questions, please open an issue on GitHub.

---

**Built with ❤️ by Huzaifa Babar**
