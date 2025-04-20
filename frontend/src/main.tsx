import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import Login from "./Login.tsx";
import Signup from "./Signup.tsx";
import Profile from "./Profile.tsx";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { initializeApp } from "firebase/app";
import { ThemeProvider } from "./Context/ThemeContext.tsx"; // Import ThemeProvider

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/Login" />} />
          <Route path="/Signup" element={<Signup />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/Profile" element={<Profile />} />
          <Route path="/app" element={<App />} />
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </ThemeProvider>
  </StrictMode>
);
