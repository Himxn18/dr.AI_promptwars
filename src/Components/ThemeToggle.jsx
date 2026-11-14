import React from 'react';
import { useTheme } from '../context/ThemeContext';

const ThemeToggle = ({ className = '', showLabel = false }) => {
  const { theme, toggleTheme, isDark } = useTheme();

  return (
    <button
      type="button"
      className={`theme-toggle-btn ${isDark ? 'dark' : 'light'} ${className}`}
      onClick={toggleTheme}
      aria-label={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
      title={`Switch to ${isDark ? 'Light' : 'Dark'} mode`}
    >
      <div className="theme-toggle-track">
        <span className="theme-icon sun" aria-hidden="true">☀️</span>
        <span className="theme-icon moon" aria-hidden="true">🌙</span>
        <div className="theme-toggle-thumb">
          <span className="thumb-icon">{isDark ? '🌙' : '☀️'}</span>
        </div>
      </div>
      {showLabel && (
        <span className="theme-toggle-label">
          {isDark ? 'Dark Mode' : 'Light Mode'}
        </span>
      )}
    </button>
  );
};

export default ThemeToggle;
