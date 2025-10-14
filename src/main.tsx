import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Initialize theme on app load
const initTheme = () => {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark" || savedTheme === null) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
};

initTheme();

createRoot(document.getElementById("root")!).render(<App />);
