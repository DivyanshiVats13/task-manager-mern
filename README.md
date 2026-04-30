Task Manager App
A simple task manager I built using the MERN stack. You can create an account, add tasks, set priorities and due dates, and track what's done and what's pending.
What it does

Register / Login with JWT auth
Add, edit, delete tasks
Mark tasks as complete
Filter by status, search by name, sort by date or priority
See stats — total, pending, completed, overdue

Tech used

React (frontend)
Node.js + Express (backend)
MongoDB + Mongoose (database)
JWT + bcryptjs (auth)

Run it locally
bash# clone the repo
git clone https://github.com/DivyanshiVats13/task-manager-mern.git

# backend
cd server
npm install
# create a .env file with MONGO_URI, JWT_SECRET, PORT
npm start

# frontend
cd ../client
npm install
npm start
Live
Backend: https://task-manager-mern-pr2v.onrender.com
Author
Divyanshi Vats — @DivyanshiVats13
