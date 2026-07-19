import { createContext, useContext, useState } from "react";

const ThemeContext = createContext();

const ThemeButton = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);

  return (
    <div
      style={{
        backgroundColor: theme === "light" ? "white" : "black",
        color: theme === "light" ? "black" : "white",
        height: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <h1>Toggle Theme</h1>

      <button onClick={toggleTheme}>
        Change to {theme === "light" ? "Dark" : "Light"} Theme
      </button>
    </div>
  );
};

function context() {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    setTheme(theme === "light" ? "dark" : "light");
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <ThemeButton />
    </ThemeContext.Provider>
  );
}

export default context;
