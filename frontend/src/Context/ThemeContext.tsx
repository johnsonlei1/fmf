// src/Context/ThemeContext.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { auth, db } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, setDoc } from "firebase/firestore";

interface ThemeContextType {
  darkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [darkMode, setDarkMode] = useState(true);
  const [userId, setUserId] = useState<string | null>(null);

  // Get darkMode preference from Firestore once authenticated
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setUserId(user.uid);
        const userRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(userRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          console.log("🌙 Fetched dark mode from Firestore:", data.darkMode);
          if (typeof data.darkMode === "boolean") {
            setDarkMode(data.darkMode);
          }
        }
      }
    });
    return () => unsubscribe();
  }, []);

  // Update dark mode on the document body
  useEffect(() => {
    document.body.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const toggleDarkMode = async () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    if (userId) {
      try {
        const userRef = doc(db, "users", userId);
        await setDoc(userRef, { darkMode: newMode }, { merge: true });
        console.log("✅ Saved darkMode to Firestore:", newMode);
      } catch (err) {
        console.error("❌ Failed to save dark mode preference:", err);
      }
    }
  };

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
};
