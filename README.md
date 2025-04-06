# Spendify

Your smart personal income tracker – track, budget, and grow financially with ease!

![Image](https://github.com/user-attachments/assets/869b79ad-6b77-4c5d-8c2e-7a1518034f05)

[![Watch the whole demo here:](📼)](https://drive.google.com/file/d/1eYr6fqgbb_ijh8oiBe1wDIGYiyyLY3hf/view?usp=sharing)

## Features

- **User Authentication**

  - Secure sign-up and sign-in
  - Google OAuth integration
  - JWT-based authentication

- **Dashboard Overview**

  - Real-time financial summary
  - Quick access to recent transactions

- **Transaction Management**

  - Add, edit, and delete transactions
  - Categorize transactions (income/expense)
  - Filter transactions by date, category, and payment method
  - Transaction history with detailed view

- **Budget Management**

  - Set monthly budgets
  - Track budget utilization
  - Visual budget progress indicators

- **Analytics Dashboard**

  - Category-wise spending analysis
  - Weekly and monthly reports

- **Profile Management**
  - Customizable categories
  - Payment method management
  - User preferences

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- Appwrite account and project setup

### Installation

1. Clone the repository

```bash
git clone https://github.com/noobk1d/spendify.git
cd spendify
```

2. Install dependencies

```bash
# Install frontend dependencies
cd frontend/spendify
npm install

# Install backend dependencies
cd ../../backend
npm install
```

3. Environment Setup

- Create `.env` files in both frontend and backend directories
- Configure Appwrite credentials and other environment variables

4. Start the application

```bash
# Start backend server
cd backend
npm start

# Start frontend development server
cd frontend/spendify
npm run dev
```

## Project Structure

```
spendify/
├── frontend/
│   └── spendify/
│       ├── src/
│       │   ├── components/
│       │   ├── pages/
│       │   ├── lib/
│       │   └── App.jsx
│       └── package.json
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   └── services/
│   └── package.json
└── README.md
```

<!-- ## API Documentation

### Authentication

- POST `/api/auth/signup` - User registration
- POST `/api/auth/signin` - User login
- POST `/api/auth/google` - Google OAuth authentication

### Transactions -->

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/Feature`)
3. Commit your changes (`git commit -m 'Add some Feature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
