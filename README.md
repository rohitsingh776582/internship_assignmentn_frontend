#  Frontend — Task Manager

React + Vite + Tailwind CSS v4 frontend for the Task Manager application.

---

##  Tech Stack

| Package | Version |
|---------|---------|
| React | 19 |
| Vite | 8 |
| Tailwind CSS | v4 |
| React Router DOM | v7 |
| Axios | v1 |
| Lucide React | v1 |

---

## Folder Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── public/
│   │   │   ├── LoginPage.jsx       # Login form with admin toggle
│   │   │   └── SignupPage.jsx      # Signup form
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx       # Protected & public routes
│   │   └── TaskDashboard/
│   │       └── TaskDashboard.jsx   # Main dashboard with full CRUD
│   ├── App.jsx
│   ├── App.css                     # Tailwind v4 import
│   └── main.jsx
├── .env
├── index.html
├── vite.config.js
└── package.json
```

---

##  Setup

### 1. Install dependencies

```bash
cd frontend
npm install
```

### 2. Create `.env` file

```env
VITE_API_BASE_URL=http://localhost:3000/api
```

### 3. Run development server

```bash
npm run dev
```

Runs on: `http://localhost:5173`

---

##  Pages

### `/login` — Login Page
- Email & password login
- Toggle to show **Admin Secret Code** field for admin login
- Saves JWT token and user info to `localStorage` on success
- Link to Signup page

### `/signup` — Signup Page
- Full name, email, password fields
- Redirects to `/login` after successful registration

### `/dashboard` — Task Dashboard *(Protected)*
- Redirects to `/login` if no token found
- Full task management UI

---

##  Dashboard Features

- **Fetch Tasks** — Loads all user tasks from API on mount
- **Create Task** — Modal form to add new task
- **Edit Task** — Modal form pre-filled with existing task data
- **Delete Task** — Confirm before deleting
- **Toggle Status** — Click circle icon to mark Pending / Completed
- **Search** — Real-time search by task title
- **Filter** — Dropdown to filter All / Pending / Completed
- **Logout** — Clears localStorage and redirects to login

---

##  Auth Flow

```
User visits /dashboard
      ↓
Token in localStorage?
   YES → Show Dashboard
   NO  → Redirect to /login
```

Token is sent with every API request as:
```
Authorization: Bearer <token>
```

---

##  Theme

All UI uses red theme color `#C83733` — buttons, borders, focus rings, badges, sidebar.

---

##  Build for Production

```bash
npm run build
```

Output goes to `dist/` folder.
