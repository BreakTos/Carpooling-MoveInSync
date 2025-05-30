# 🚗 CarPooling System

This repository contains the **frontend and backend** for the CarPooling System — a ride-sharing platform where users can **Create, Find, and Join** rides.

- 🛠 **Backend**: Node.js, Express.js, MongoDB  
- 🎨 **Frontend**: React.js, CSS

---

## 🌐 Deployment

- **Backend**: Hosted on Microsoft Azure VM => [Example route for all registered users](https://tbppp.centralindia.cloudapp.azure.com/auth/alll)
- **Frontend**: Live on Vercel => [Deployment link](https://carpooling-move-in-sync.vercel.app/)

---

## 📹 Demo Video

A quick walkthrough showcasing all the key features of the CarPooling System:

👉 [Watch the Demo](https://drive.google.com/file/d/1DHCRFJVexBzgdCQ_t5UmAKAVSHZFV6G2/view?usp=sharing)

---

## 🧩 Features

- 🔐 **Secure Authentication**  
  User sign-up and login with password hashing using **bcrypt** and authentication via **JWT tokens**.

- 🚘 **Ride Creation**  
  Users can create a ride by specifying details like origin, destination, date, time, available seats, and price.

- 👥 **Join Rides**  
  Users can search and join maximum matching rides with a single click and view their booking status.

- 🧾 **My Rides Dashboard**  
  Personalized dashboard to manage created rides and joined rides.

- 🆘 **Emergency SOS Button**  
  One-click SOS feature to instantly alert emergency contacts in case of danger during a ride.

---

## ⚙️ Setup & Installation

### **1️⃣ Clone the Repository**

```sh
git clone https://github.com/BreakTos/Carpooling-MoveInSync.git
cd Carpooling-MoveInSync
```
### **2️⃣ Install & Run Backend**

Open Terminal 1:

```sh
cd backend
npm install
node index.js
```
### **3️⃣ Install & Run Frontend**

Open Terminal 2:

```sh
cd frontend
npm install
npm run dev
```

The server will be listening on PORT 8080 and frontend on PORT 5173.

---

## 🧠 High-Level Architecture

![System Design](https://github.com/user-attachments/assets/7a1e131f-e30b-4bae-81df-4416593bb394)

---

## 📁 Backend structure

    ├── README.md
    ├── backend/
    │   ├── index.js
    │   ├── package.json
    │   ├── .env
    │   ├── controllers/
    │   │   ├── authController.js
    │   │   ├── chatController.js
    │   │   └── rideController.js
    │   ├── db/
    │   │   └── connectDb.js
    │   ├── models/
    │   │   ├── Chat.js
    │   │   ├── Ride.js
    │   │   └── User.js
    │   └── routes/
    │       ├── authRoutes.js
    │       ├── chatRoutes.js
    │       └── rideRoutes.js



