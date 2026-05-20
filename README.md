# Digital Wallet Banking System

A full-stack web application built to simulate a simple digital wallet system. Users can register, start with an initial balance, send coins to other users, and view their transaction history.

## Technology Stack

*   **Frontend:** HTML5, CSS3 (Modern, responsive UI), AngularJS (1.x)
*   **Backend:** Node.js, Express.js
*   **Database:** MongoDB via Mongoose
*   **Authentication:** BCrypt (Password Hashing)

## Features

1.  **User Authentication:**
    *   Registration with automatic initial balance assignment (1000 Coins).
    *   Secure login using hashed passwords.
    *   Session management via `localStorage`.
2.  **Dashboard:**
    *   Real-time view of the current wallet balance.
    *   Quick actions to access Send or History pages.
3.  **Peer-to-Peer Transfers:**
    *   Send coins to any registered user via their email address.
    *   Validation checks to prevent overdrafts (insufficient balance) and self-transfers.
4.  **Transaction History:**
    *   Chronological list of all incoming and outgoing transfers with timestamps.

## Prerequisites

*   Node.js (v18+ recommended)
*   MongoDB installed and running locally, or an Atlas connection string set via `MONGODB_URI`
*   If using Atlas, the recommended way is to create a `.env` file with `MONGODB_URI`.

## Installation & Setup

1.  **Clone or download the repository.**
2.  **Navigate to the project root directory:**
    ```bash
    cd digital-wallet-system
    ```
3.  **Install backend dependencies:**
    ```bash
    npm install
    ```
4.  **Start MongoDB server:** Ensure your local MongoDB instance is running on the default port `27017`, or create a `.env` file with your Atlas connection string.
    *If `MONGODB_URI` is set but fails authentication, the app will automatically try your local MongoDB fallback.*
    *To use the provided Atlas host and username, create a `.env` file like this:*
    ```powershell
    MONGODB_URI=mongodb+srv://tylerriley001_db_user:TaWxade9vS90Sbp1@cluster0.deiwfow.mongodb.net/digital_wallet_db?retryWrites=true&w=majority
    ```
5.  **Start the Express Server:**
    ```bash
    npm start
    ```
    *The server will start on `http://localhost:5000`.*
6.  **Run the Frontend:** Open the `public/index.html` file in your preferred web browser.

## API Endpoints

*   `POST /api/register`: Register a new user (`name`, `email`, `password`).
*   `POST /api/login`: Authenticate an existing user (`email`, `password`).
*   `GET /api/balance/:email`: Fetch the current balance for the given user.
*   `POST /api/sendMoney`: Transfer funds (`senderEmail`, `receiverEmail`, `amount`).
*   `GET /api/transactions/:email`: Retrieve the transaction history for the given user.

## Project Structure

```text
digital-wallet-system/
├── public/                 # AngularJS Frontend files
│   ├── index.html
│   ├── app.js              # Controllers and Routing
│   ├── style.css
│   └── *.html              # Various views (login, dashboard, etc.)
├── server/
│   └── server.js           # Main Express server and API routes
├── models/                 # Mongoose Data Models
│   ├── User.js
│   ├── Wallet.js
│   └── Transaction.js
└── package.json            # Project dependencies
```
"# digital-wallet-system" 
