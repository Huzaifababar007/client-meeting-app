# Client Meeting Management Application

A full-stack web application for managing clients and their meetings with real-time authentication and comprehensive CRUD operations.

## 🔗 Quick Links

- **🌐 Live Demo**: [Coming Soon - Deploy to Vercel/Netlify]
- **📁 Repository**: https://github.com/Huzaifababar007/client-meeting-app
- **📋 Requirements**: All core + bonus features implemented

## 🚀 Features

### Core Features
- **🔐 Authentication System**
  - User registration and login
  - JWT token-based authentication
  - Protected routes
  - User profile management

- **👥 Client Management**
  - Create, Read, Update, Delete clients
  - Client details: name, email, company, phone
  - Client list with meeting counts and last meeting dates
  - Search and filter clients
  - CSV export functionality

- **📅 Meeting Management**
  - Create, Read, Update, Delete meetings
  - Meeting details: title, datetime, location, notes
  - Meetings belong to specific clients
  - Add/edit meetings directly from client detail pages
  - Upcoming meetings display

- **📊 Dashboard**
  - Real-time statistics
  - Quick actions
  - Recent activity tracking
  - Enhanced home page with comprehensive overview

### Bonus Features
- **🔍 Search & Filter**: Real-time client search by name, email, or company
- **📊 CSV Export**: Export client data with meeting information
- **🌱 Demo Data**: Seeder script for testing with sample data
- **⚡ Performance**: All GET queries optimized for sub-1-second response times
- **🎨 Modern UI**: Responsive design with Tailwind CSS and glassmorphic effects

## 🛠️ Tech Stack

### Frontend
- **React 18** with Vite
- **React Router DOM** for navigation
- **Tailwind CSS** for styling
- **Axios** for API calls
- **Context API** for state management

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **bcryptjs** for password hashing
- **CORS** enabled

## 📋 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or cloud instance)
- npm or yarn package manager

## 🚀 Installation & Setup

### 1. Clone the Repository
```bash
git clone <your-repo-url>
cd client-meeting-app
```

### 2. Backend Setup
```bash
cd backend
npm install
```

### 3. Environment Configuration
Create a `.env` file in the backend directory:
```env
MONGODB_URI=mongodb://localhost:27017/client-meeting-app
JWT_SECRET=your-secret-key-here
PORT=5000
```

### 4. Frontend Setup
```bash
cd ../
npm install
```

### 5. Database Setup
```bash
cd backend
npm run seed
```

### 6. Start the Application

#### Start Backend (Terminal 1)
```bash
cd backend
npm run dev
```

#### Start Frontend (Terminal 2)
```bash
npm run dev
```

The application will be available at:
- Frontend: http://localhost:5173
- Backend API: http://localhost:5000

## 👤 Demo Credentials

After running the seeder, you can login with:
- **Email**: demo@example.com
- **Password**: demo123

## 📁 Project Structure

```
client-meeting-app/
├── src/
│   ├── components/
│   │   └── ProtectedRoute.jsx
│   ├── context/
│   │   └── AuthContext.jsx
│   ├── pages/
│   │   ├── Login.jsx
│   │   ├── Signup.jsx
│   │   ├── Dashboard.jsx
│   │   ├── ClientDetail.jsx
│   │   ├── AddClient.jsx
│   │   ├── EditClient.jsx
│   │   ├── AddMeeting.jsx
│   │   ├── EditMeeting.jsx
│   │   └── ForgetPassword.jsx
│   ├── services/
│   │   ├── api.js
│   │   └── authService.js
│   └── utils/
│       └── formatDate.js
├── backend/
│   ├── models/
│   │   ├── Client.js
│   │   ├── Meeting.js
│   │   └── User.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── clientRoutes.js
│   │   └── meetingRoutes.js
│   ├── seeders/
│   │   └── seedData.js
│   └── server.js
└── README.md
```

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile
- `PUT /api/auth/profile` - Update user profile
- `POST /api/auth/forgot-password` - Request password reset
- `POST /api/auth/reset-password` - Reset password

### Clients
- `GET /api/clients` - Get all clients
- `POST /api/clients` - Create new client
- `GET /api/clients/:id` - Get client by ID
- `PUT /api/clients/:id` - Update client
- `DELETE /api/clients/:id` - Delete client

### Meetings
- `GET /api/meetings` - Get all meetings
- `POST /api/meetings` - Create new meeting
- `GET /api/meetings/:id` - Get meeting by ID
- `PUT /api/meetings/:id` - Update meeting
- `DELETE /api/meetings/:id` - Delete meeting

## 🎯 Key Features Implementation

### 1. Client List with Meeting Information
- Shows number of meetings per client
- Displays last meeting date
- Real-time filtering and search

### 2. Meeting Management from Client Pages
- Add meetings directly from client detail page
- Edit meetings with proper navigation
- Meeting list sorted by date

### 3. Search and Filter
- Real-time search across client name, email, and company
- Instant filtering without page reload

### 4. CSV Export
- Export client data with meeting counts
- Includes last meeting dates
- Properly formatted CSV file

### 5. Performance Optimization
- Efficient database queries
- Optimized React rendering
- Sub-1-second response times for all GET requests

## 🔒 Security Features

- Password hashing with bcrypt
- JWT token authentication
- Protected API routes
- Input validation and sanitization
- CORS configuration

## 🎨 UI/UX Features

- Responsive design for all devices
- Glassmorphic design elements
- Smooth animations and transitions
- Intuitive navigation
- Loading states and error handling
- Real-time feedback

## 🚀 Deployment

### Backend Deployment
1. Set up MongoDB Atlas or local MongoDB
2. Configure environment variables
3. Deploy to Heroku, Vercel, or similar platform

### Frontend Deployment
1. Build the application: `npm run build`
2. Deploy to Vercel, Netlify, or similar platform
3. Configure environment variables for API endpoints

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📝 License

This project is licensed under the MIT License.

## 🆘 Support

For support and questions, please open an issue in the GitHub repository.

---

**Built with ❤️ using React, Node.js, and MongoDB**
