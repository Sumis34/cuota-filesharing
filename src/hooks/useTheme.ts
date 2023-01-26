import { useEffect, useState } from "react";

const DARK_MODE_KEY = "darkMode";

const useTheme = () => {
  const [darkMode, setDarkMode] = useState<boolean | null>(null);
  const [defaultDark, setDefault] = useState(false);

  useEffect(() => {
    setDefault(
      window.matchMedia &&
        window.matchMedia("(prefers-color-scheme: dark)").matches
    );

    const raw = localStorage.getItem(DARK_MODE_KEY);

    if (!raw) return;

    const dark = JSON.parse(raw);

    setDarkMode(dark);
  }, []);

  return {
    dark: darkMode !== null ? darkMode : defaultDark,
    toggleDark: () => {
      localStorage.setItem(DARK_MODE_KEY, JSON.stringify(!darkMode));
      setDarkMode(!darkMode);
    },
  };
};

export default useTheme;
