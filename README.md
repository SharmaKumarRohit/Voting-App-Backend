# Voting Application Backend

A RESTful backend for a voting application where users can signup using their Aadhaar number, view candidates, and cast a single vote. The system ensures one vote per user and provides live vote counts sorted by total vote count. An admin role manages candidates but is not allowed to vote.

---

## 🚀 Features

### User Features

- User registration (Sign Up)
- User login (Aadhaar number + password)
- View list of candidates
- User can cast vote (only once) if user role voter
- View live vote counts (sorted by highest vote count)
- View profile information
- Change password

### Admin Features

- Create new candidate
- Update existing candidate
- Delete candidate
- Admin cannot vote

---

## 🔐 Authentication & Authorization Rules

- Users must sign up using a valid Aadhaar card number.
- Login requires Aadhaar number and password.
- Each user can vote only once if user role voter.
- After voting, the user cannot vote again.
- Admin is restricted from voting.
- Only admin can manage candidates.

---

## 🔑 JWT Authentication

This project uses JSON Web Token (JWT) based authentication for securing protected routes.

### Authentication Flow

1. User logs in with Aadhaar card number and password.
2. Server validates credentials.
3. If valid, server generates a JWT token.
4. Token is sent back to the client.
5. Client must include the token in the `Authorization` header:

   `Authorization: Bearer <token>`

6. Middleware verifies the token before allowing access to protected routes.

### Protected Routes

- `/candidate` (Admin actions)
- `/candidate/vote/:candidateId` (User action)
- `/user/profile`
- `/user/profile/password`

### Token Payload

- userId

---

## API Routes

### 1️⃣ User Authentication

| Method | Route          | Description                                 |
| ------ | -------------- | ------------------------------------------- |
| POST   | `/user/signup` | Create a new user                           |
| POST   | `/user/login`  | Login with Aadhaar card number and password |

---

### 2️⃣ Voting

| Method | Route                          | Description                                      |
| ------ | ------------------------------ | ------------------------------------------------ |
| POST   | `/candidate/vote/:candidateId` | Vote for a specific candidate                    |
| GET    | `/candidate/vote/count`        | Get candidates sorted by vote count (descending) |
| GET    | `/candidate`                   | Get list of candidates                           |

---

### 3️⃣ User Profile

| Method | Route                    | Description                  |
| ------ | ------------------------ | ---------------------------- |
| GET    | `/user/profile`          | Get logged-in user's profile |
| PUT    | `/user/profile/password` | Change user password         |

---

### 4️⃣ Admin Candidate Management

| Method | Route                     | Description          |
| ------ | ------------------------- | -------------------- |
| POST   | `/candidate`              | Create new candidate |
| PUT    | `/candidate/:candidateId` | Update candidate     |
| DELETE | `/candidate/:candidateId` | Delete candidate     |

---

## Data Model Overview

### User

- name
- age
- email
- mobile
- address
- aadharCardNumber (unique)
- password (hashed)
- role ("user" or "admin")
- isVoted (true or false)

### Candidate

- name
- party
- age
- votes ([user: objectId, votedAt: Date.now()])
- voteCount (default: 0)

---

## ⚙️ Voting Logic Rules

1. User must be authenticated.
2. Admin cannot vote.
3. If `isVoted` is true, voting request is rejected.
4. When user votes:
   - Candidate voteCount increments by 1.
   - User `isVoted` becomes true.

## Usage and Installation

### Clone the Repository

```bash
git clone https://github.com/SharmaKumarRohit/Voting-App-Backend.git
cd Voting-App-Backend
```

### Create a `.env` file on backend root folder and add:

```bash
PORT=4000
MONGO_URL=mongodb+srv://<db_user>:<db_password>@cluster0.wgvhanf.mongodb.net/voting
SECRET_KEY=z8PZh9eDLTDuteqzffXc8DnnpUcZtyrwNUyGKAUVEMG
```

### Start backend server:

```bash
npm run dev
```
