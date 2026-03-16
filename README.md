# 🏋️ Titan Fitness Club — Full Stack Website

> **Pune's #1 Premium Gym Website** | React + Node.js + MongoDB

---

## 📁 Project Structure

```
titan-fitness/
├── frontend/                    ← React App
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx + .css
│   │   │   ├── Footer.jsx + .css
│   │   │   ├── HeroSection.jsx + .css
│   │   │   ├── ProgramCard.jsx + .css
│   │   │   ├── TrainerCard.jsx + .css
│   │   │   ├── MembershipCard.jsx + .css
│   │   │   ├── TestimonialSlider.jsx + .css
│   │   │   ├── GalleryGrid.jsx + .css
│   │   │   ├── BlogCard.jsx + .css
│   │   │   ├── ContactForm.jsx + .css
│   │   │   ├── Loader.jsx + .css
│   │   │   ├── ToastNotification.jsx + .css
│   │   │   └── FloatingButtons.jsx + .css
│   │   ├── pages/
│   │   │   ├── Home.jsx + .css
│   │   │   ├── About.jsx + .css
│   │   │   ├── Programs.jsx
│   │   │   ├── Trainers.jsx
│   │   │   ├── Membership.jsx
│   │   │   ├── Gallery.jsx
│   │   │   ├── Testimonials.jsx
│   │   │   ├── Blog.jsx
│   │   │   ├── Contact.jsx
│   │   │   └── Admin.jsx + .css
│   │   ├── styles/
│   │   │   ├── variables.css
│   │   │   ├── global.css
│   │   │   └── animations.css
│   │   ├── data/
│   │   │   ├── programsData.js
│   │   │   ├── trainersData.js
│   │   │   ├── testimonialsData.js
│   │   │   ├── blogData.js
│   │   │   └── galleryData.js
│   │   ├── context/
│   │   │   └── AppContext.js
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/                     ← Node.js + Express API
│   ├── server.js
│   ├── config/
│   │   └── db.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Program.js
│   │   ├── Trainer.js
│   │   └── index.js  (Blog, Contact, Testimonial, Gallery, Membership)
│   ├── controllers/
│   │   └── mainController.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── programRoutes.js
│   │   ├── trainerRoutes.js
│   │   ├── blogRoutes.js
│   │   ├── contactRoutes.js
│   │   ├── testimonialRoutes.js
│   │   ├── galleryRoutes.js
│   │   └── membershipRoutes.js
│   ├── middleware/
│   │   └── auth.js
│   ├── .env
│   └── package.json
│
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites
- Node.js v18+
- MongoDB (local or Atlas)
- npm or yarn

---

### 1️⃣ Clone / Download

```bash
cd titan-fitness
```

---

### 2️⃣ Backend Setup

```bash
cd backend

# Install dependencies
npm install

# Configure environment variables
# Edit .env file:
MONGO_URI=mongodb://localhost:27017/titanfitness
JWT_SECRET=titan_super_secret_key_2024
JWT_EXPIRE=7d
PORT=5000
CLIENT_URL=http://localhost:3000

# Create admin user (run once)
node -e "
const mongoose = require('mongoose');
const User = require('./models/User');
require('dotenv').config();
mongoose.connect(process.env.MONGO_URI).then(async () => {
  await User.create({ name: 'Admin', email: 'admin@titanfitness.com', password: 'admin123', role: 'admin' });
  console.log('Admin created!');
  process.exit();
});
"

# Start backend
npm run dev     # Development (nodemon)
npm start       # Production
```

Backend runs at: **http://localhost:5000**

---

### 3️⃣ Frontend Setup

```bash
cd frontend

# Install dependencies
npm install

# Start frontend
npm start
```

Frontend runs at: **http://localhost:3000**

---

## 🔑 Admin Login

```
URL:      http://localhost:3000/admin
Email:    admin@titanfitness.com
Password: admin123
```

---

## 🌐 API Endpoints

| Method | Endpoint                    | Description              | Auth     |
|--------|-----------------------------|--------------------------|----------|
| POST   | /api/auth/login             | Admin login              | Public   |
| GET    | /api/auth/me                | Get current user         | 🔒 JWT   |
| GET    | /api/programs               | Get all programs         | Public   |
| POST   | /api/programs               | Add program              | 🔒 Admin |
| PUT    | /api/programs/:id           | Update program           | 🔒 Admin |
| DELETE | /api/programs/:id           | Delete program           | 🔒 Admin |
| GET    | /api/trainers               | Get all trainers         | Public   |
| POST   | /api/trainers               | Add trainer              | 🔒 Admin |
| GET    | /api/blogs                  | Get all blogs            | Public   |
| GET    | /api/blogs/:slug            | Get blog by slug         | Public   |
| POST   | /api/blogs                  | Create blog post         | 🔒 Admin |
| POST   | /api/contacts               | Submit contact form      | Public   |
| GET    | /api/contacts               | View all contacts        | 🔒 Admin |
| GET    | /api/gallery                | Get gallery              | Public   |
| GET    | /api/testimonials           | Get testimonials         | Public   |
| POST   | /api/memberships/enroll     | Enroll member            | Public   |
| GET    | /api/memberships            | View all members         | 🔒 Admin |
| GET    | /api/memberships/stats      | Dashboard stats          | 🔒 Admin |
| GET    | /api/health                 | API health check         | Public   |

---

## 🌍 Production Deployment

### Frontend (Vercel / Netlify)
```bash
cd frontend
npm run build
# Deploy the /build folder
```

### Backend (Railway / Render / VPS)
```bash
cd backend
# Set environment variables on the platform
# Change MONGO_URI to MongoDB Atlas connection string
npm start
```

### MongoDB Atlas
1. Create account at mongodb.com/atlas
2. Create cluster → Get connection string
3. Update `MONGO_URI` in backend `.env`

---

## 📱 Pages

| Page          | Route            | Description                    |
|---------------|-----------------|--------------------------------|
| Home          | /               | Hero, Programs, Trainers, CTA  |
| About         | /about          | Story, Mission, Achievements   |
| Programs      | /programs       | All 6 workout programs         |
| Trainers      | /trainers       | 4 elite trainer profiles       |
| Membership    | /membership     | Basic / Pro / Elite plans      |
| Gallery       | /gallery        | Filter + Lightbox gallery      |
| Testimonials  | /testimonials   | Success stories slider         |
| Blog          | /blog           | Articles with category filter  |
| Contact       | /contact        | Form + Map + Details           |
| Admin         | /admin          | Full CRUD dashboard            |

---

## ✨ Features

- 🔥 Dark theme with fire/orange gradient branding
- ⚡ Scroll reveal animations on all sections
- 📊 Animated number counters
- 💰 Monthly/Yearly pricing toggle
- 🖼 Gallery with filter + lightbox
- 💬 WhatsApp floating button
- 🔔 Toast notification system
- 📱 Fully responsive (mobile/tablet/desktop)
- 🔐 JWT Admin authentication
- 📝 Full CRUD for programs/trainers/blogs
- 🗺 Google Maps embed
- ↑ Scroll to top button
- 🎭 Loading screen animation
- 📅 Class schedule table

---

## 📞 Brand Info

```
Gym Name:  Titan Fitness Club
Location:  FC Road, Shivajinagar, Pune 411005
Phone:     +91 98765 43210
Email:     info@titanfitness.com
Tagline:   Build Strength. Transform Life.
```

---

Built with ❤️ for Titan Fitness Club, Pune 🏋️
