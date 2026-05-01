# 📋 Task Manager App

A simple task manager I built using the MERN stack. You can create an account, add tasks, set priorities and due dates, and track what's done and what's pending.

## 🚀 Live Demo

**➡️ [Click here to view the live app](https://task-manager-mern-pr2v.onrender.com)**

> *Note: The app is hosted on Render's free tier, so it may take ~30 seconds to wake up on first visit.*

## ✨ What it does

- Register / Login with JWT auth
- Add, edit, delete tasks
- Mark tasks as complete
- Filter by status, search by name, sort by date or priority
- See stats — total, pending, completed, overdue

## 🛠 Tech used

- **React** (frontend)
- **Node.js + Express** (backend)
- **MongoDB + Mongoose** (database)
- **JWT + bcryptjs** (auth)
- **Tailwind CSS** (styling)
- **Render** (deployment)

## 📦 Run it locally

```bash
# clone the repo
git clone https://github.com/DivyanshiVats13/task-manager-mern.git

# backend
cd server
npm install
# create a .env file with MONGO_URI, JWT_SECRET, PORT
npm start

# frontend
cd ../client
npm install
npm run dev
```

## 👩‍💻 Author

**Divyanshi Vats** — [@DivyanshiVats13](https://github.com/DivyanshiVats13)
