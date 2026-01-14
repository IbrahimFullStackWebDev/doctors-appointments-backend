# 🩺 Doctor Appointment Booking System - Frontend

- This is the robust and scalable Server-Side of the Prescripto platform. It handles complex business logic, secure authentication, and real-time data management for patients, doctors, and admins.

## 🚀 Tech Stack (2026 Standards)

- **Runtime:** Node.js(v24+)
- **Language:** TypeScript (Strict Mode)
- **Framework:** Express.js
- **Database:** PostgreSQL via **Supabase**
- **Authentication:** Custom JWT-based Auth with **Bcrypt** hashing
- **Storage:** Supabase Buckets (for profile & medical assets)

## 🛠️ Key Backend Responsibilities

- Secure Authentication: Dedicated logic for 3 types of users (Admin, Doctor, Patient) with custom encryption.

- Appointment Logic: Prevents double-booking and manages slot availability.

- Role-Based Access Control (RBAC): Middlewares to ensure only Admins can add doctors and only Doctors can see their earnings.

- Data Integrity: Structured PostgreSQL schemas with relational foreign keys.

## 🗄️ Database Schema

The database consists of 3 main tables within the `public` schema:

- **Users**: Stores patient profiles.
- **Doctors**: Stores medical professional details and encrypted credentials.
- **Appointments**: A junction table connecting Users and Doctors with status tracking (Cancelled, Completed, Paid).

## 📂 Project Structure (Clean Architecture)

**Plaintext**

```text
src/
├── config/ # Database & Cloud connections
├── controllers/ # Business logic (The "Brain")
├── routes/ # API Endpoint definitions
├── middlewares/ # Security & File processing
├── types/ # Shared TypeScript interfaces
└── server.ts # Main entry point
```

## ⚙️ How to Setup

1. **Clone the repository:**

```bash
  git clone https://github.com/IbrahimFullStackWebDev/doctors-appointments-backend.git
```

2. **Install dependencies:**

```bash
  npm install
```

3. **Configure Environment Variables: Create a .env file and add::**

```Code snippet
  SB_URL=your_supabase_url
  SB_SECRET_KEY=your_supabase_secret_key
  PORT=4000
```

4. **Launch for Development:**

```bash
   npm run server
```

5. **🤝 Linked Repository:**

- You can find the Frontend of this project here:https://github.com/IbrahimFullStackWebDev/doctors-appointments-frontend.git
