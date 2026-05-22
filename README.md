# PayWave 💸
### Full Stack Fintech Web App — Peer-to-Peer Digital Wallet

[![Live Demo](https://img.shields.io/badge/Live%20Demo-paywave--wallet.vercel.app-blue?style=for-the-badge&logo=vercel)](https://paywave-wallet.vercel.app)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Aaryankacha/digital-wallet-banking-app)

---

## 🚀 Live Demo

👉 **[https://paywave-wallet.vercel.app](https://paywave-wallet.vercel.app)**

> Test credentials — register a new account or use:
> - Email: `test@paywave.com` | Password: `test1234`

---

## 📌 About

PayWave is a full-stack digital wallet application simulating real-world fintech flows like GPay and Paytm. Users can register, send money peer-to-peer, scan QR codes, view transaction history, and track spending via an analytics dashboard — all in real time.

---

## ✨ Features

- 🔐 **JWT Authentication** — Secure login and registration with bcrypt password hashing
- 💸 **P2P Transfers** — Send coins instantly to any registered user via email
- 📷 **QR Code Payments** — Generate and scan QR codes for fast transfers
- 📊 **Spending Analytics** — Category-wise breakdown of transactions with charts
- 🕓 **Transaction History** — Full chronological log of all incoming and outgoing transfers
- 🌓 **Dark Mode** — Full dark/light theme support
- 📱 **Responsive UI** — Works on mobile and desktop

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React, Tailwind CSS, Recharts, QRCode.react |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas (Mongoose) |
| Auth | JWT, bcryptjs |
| Deployment | Vercel (Frontend) · Railway (Backend) |

---

## 📁 Project Structure

```
paywave/
├── client/                 # React frontend (Vite)
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Route-level pages
│   │   ├── services/       # Axios API calls
│   │   ├── context/        # Auth context
│   │   └── hooks/          # Custom React hooks
│   └── vite.config.js
│
└── server/                 # Node.js backend
    ├── models/             # Mongoose schemas (User, Wallet, Transaction)
    ├── server.js           # Express server + API routes
    └── package.json
```

---

## 🔌 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/register` | Register new user + create wallet |
| POST | `/api/login` | Authenticate user |
| GET | `/api/balance/:email` | Get wallet balance |
| POST | `/api/sendMoney` | Transfer funds between users |
| GET | `/api/transactions/:email` | Get transaction history |

---

## ⚙️ Local Setup

### Prerequisites
- Node.js v18+
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the repo
```bash
git clone https://github.com/Aaryankacha/digital-wallet-banking-app.git
cd digital-wallet-banking-app
```

### 2. Setup Backend
```bash
cd server
npm install
```

Create a `.env` file inside `server/`:
```env
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Start the backend:
```bash
node server.js
```

### 3. Setup Frontend
```bash
cd client
npm install
```

Create a `.env` file inside `client/`:
```env
VITE_API_URL=http://localhost:5000
```

Start the frontend:
```bash
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 Deployment

| Service | Platform | URL |
|---|---|---|
| Frontend | Vercel | [paywave-wallet.vercel.app](https://paywave-wallet.vercel.app/login) |
| Backend | Railway | Auto-deployed from GitHub |
| Database | MongoDB Atlas | Cloud hosted |

---

## 🔒 Security Features

- Passwords hashed with **bcrypt** (salt rounds: 10)
- **JWT tokens** for stateless authentication
- **CORS** restricted to production frontend URL
- Environment variables for all secrets — never committed to Git

---

## 👨‍💻 Author

**Aryan Kacha**
- 📧 aryannkacha@gmail.com
- 🔗 [LinkedIn](https://linkedin.com/in/aaryankacha)
- 💻 [GitHub](https://github.com/Aaryankacha)
- 🌐 [Portfolio](https://yourportfolio.com)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
