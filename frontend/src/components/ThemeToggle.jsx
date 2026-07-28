import { Moon, Sun } from "lucide-react";
import { useTheme } from "../context/ThemeContext.jsx";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDarkMode = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDarkMode ? "Switch to light mode" : "Switch to dark mode"
      }
      title={
        isDarkMode ? "Switch to light mode" : "Switch to dark mode"
      }
      className="
        flex h-10 w-10 items-center justify-center
        rounded-lg border border-gray-300
        bg-white text-gray-700
        shadow-sm
        transition-all duration-200
        hover:bg-gray-100 hover:shadow
        focus:outline-none focus:ring-2 focus:ring-blue-500
        dark:border-gray-700
        dark:bg-gray-800
        dark:text-gray-200
        dark:hover:bg-gray-700
      "
    >
      {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
}

export default ThemeToggle;