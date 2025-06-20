# ✅ Task To-Do App (React + Firebase)

This is a simple and clean task management application built with **React**, **Firebase** (Firestore & Auth), and **Vite**. Users can add, update, delete, and filter their own tasks securely.

---

## 🚀 Features

- 🔐 Firebase Authentication (per-user task access)
- 📋 Create / Read / Update / Delete Tasks
- 📊 Task sorting & filtering (e.g., by creation date)
- 🎨 Responsive UI with Material UI (MUI)
- ☁️ Firestore integration for real-time updates

---

## 🧰 Tech Stack

- [React](https://reactjs.org/)
- [Vite](https://vitejs.dev/)
- [Firebase (Auth + Firestore)](https://firebase.google.com/)
- [Material UI (MUI)](https://mui.com/)
- [Formik + Yup](https://formik.org/)
- [TanStack React Table](https://tanstack.com/table)

---

## 🔐 Environment Variables

Create a `.env` file in the root of your project with the following values:

VITE_IMAGE_URL = ''
VITE_FIREBASE_API_KEY=AIzaSyB70OpcSkNwLERbgvcUg9spbgUiYiC9Kgs
VITE_FIREBASE_AUTH_DOMAIN=task-todo-bd590.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=task-todo-bd590
VITE_FIREBASE_STORAGE_BUCKET=task-todo-bd590.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=190603439449
VITE_FIREBASE_APP_ID=1:190603439449:web:8f34fff9aceb164329b048
VITE_FIREBASE_MEASUREMENT_ID=G-GFJH22HNME

## 📦 Installation

1. **Clone the repository**

```bash
git clone https://github.com/your-username/task-todo.git
cd task-todo

npm install
npm run dev
