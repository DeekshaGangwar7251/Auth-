# Auth App

This is a simple authentication backend project I built while learning the MERN stack.  
It includes user signup, login, and role-based access using JWT.

## Features

- Signup & Login system  
- Password hashing using bcrypt  
- JWT authentication  
- Protected routes for Admin and Student  

## Tech Used

Node.js, Express.js, MongoDB, JWT, bcrypt

## How to Run

1. Clone the repo  
2. Run `npm install`  
3. Create a `.env` file and add:

DATABASE_URL=your_mongodb_url  
JWT_SECRET=your_secret  
PORT=4000  

4. Run `npm start`

## Routes

POST /signup  
POST /login  
GET /student  
GET /admin  

Made by Deeksha while learning backend development.

