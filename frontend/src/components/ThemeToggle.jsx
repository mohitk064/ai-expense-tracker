import { useTheme } from "../context/ThemeContext.jsx";

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  const isDarkMode = theme === "dark";

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={
        isDarkMode
          ? "Switch to light mode"
          : "Switch to dark mode"
      }
      className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-semibold text-gray-700 transition hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-200 dark:hover:bg-gray-700"
    >
      <span aria-hidden="true">
        {isDarkMode ? "☀️" : "🌙"}
      </span>

      <span>
        {isDarkMode ? "Light" : "Dark"}
      </span>
    </button>
  );
}

export default ThemeToggle;