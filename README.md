# DryFruit Junction - MERN Stack E-Commerce Website

## 📝 Project Description

DryFruit Junction is a MERN stack e-commerce platform specializing in premium dry fruit sweets handmade in Jodhpur, Rajasthan. The website showcases authentic Indian mithai like Kaju Katli and Panch Mewa Chakki, offering a modern twist to traditional recipes with pure ingredients and no preservatives.

## ✨ Key Features

- **Product Showcase**: Display premium dry fruit sweets with detailed descriptions
- **User Authentication**: Secure login/signup system for customers
- **Shopping Cart**: Persistent cart functionality
- **Order Management**: Track order history and status
- **Admin Dashboard**: Manage products, orders, and users
- **Responsive Design**: Mobile-friendly interface

## 🛠️ Tech Stack

### Frontend
- **React** (v19) with Vite
- **Tailwind CSS** for styling
- **React Router** (v7) for navigation
- **React Hot Toast** for notifications
- **Chart.js** for analytics in admin panel
- **Lucide React** for icons

### Backend
- **Node.js** with Express.js
- **MongoDB** with Mongoose ODM
- **JWT** for authentication
- **Multer** for image uploads
- **Cloudinary** for image storage
- **Express Rate Limit** for API security

## 🚀 Installation

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas account or local MongoDB installation
- Cloudinary account (for image storage)

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file in the `config` folder with the following variables:
   ```
   NODE_ENV=development
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   JWT_EXPIRE=30d
   CLOUDINARY_CLOUD_NAME=your_cloudinary_name
   CLOUDINARY_API_KEY=your_cloudinary_key
   CLOUDINARY_API_SECRET=your_cloudinary_secret
   ```

4. Start the server:
   ```bash
   npm run dev
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd client
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

## 🌐 Environment Variables

Both frontend and backend require specific environment variables to function properly. Refer to the respective `.env` files in each directory for required variables.

## 📂 Project Structure

```
dryfruit-junction/
├── client/                  # Frontend React application
│   ├── public/              # Static assets
│   ├── src/                 # React source code
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx          # Main app component
│   │   └── main.jsx         # Entry point
│   ├── .env                 # Frontend environment variables
│   └── vite.config.js       # Vite configuration
│
├── server/                  # Backend Node.js application
│   ├── config/              # Configuration files
│   ├── controllers/         # Route controllers
│   ├── middlewares/         # Custom middlewares
│   ├── models/              # MongoDB models
│   ├── routes/              # API routes
│   ├── .env                 # Backend environment variables
│   └── server.js            # Server entry point
│
└── README.md                # Project documentation
```

## 🧪 Testing

To run linting checks:
```bash
npm run lint
```

## 🌟 Deployment

### Backend Deployment
1. Set `NODE_ENV=production` in your `.env` file
2. Deploy to your preferred hosting service (Render, Railway, etc.)

### Frontend Deployment
1. Build the production bundle:
   ```bash
   npm run build
   ```
2. Deploy the `dist` folder to Netlify, Vercel, or similar services

## 🤝 Contributing

Contributions are welcome! Please follow these steps:
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License.

## 📧 Contact

For inquiries, please contact [roshansuthar2023@gmail.com](mailto:roshansuthar2023@gmail.com)

---

**DryFruit Junction** - Bringing tradition to your doorstep, one sweet at a time. 🪔✨