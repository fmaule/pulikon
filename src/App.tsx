import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [greeting, setGreeting] = useState("Hello, World!");

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleGreetingChange = () => {
    const greetings = [
      "Hello, World!",
      "Welcome to React + Vite!",
      "Greetings from Pulikon!",
      "Nice to meet you!",
    ];
    const randomGreeting =
      greetings[Math.floor(Math.random() * greetings.length)];
    setGreeting(randomGreeting);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>{greeting}</h1>
        <p className="subtitle">Built with React + Vite + TypeScript + Biome</p>

        <div className="time-display">
          <h2>Current Time</h2>
          <p className="time">
            {currentTime.toLocaleDateString()}{" "}
            {currentTime.toLocaleTimeString()}
          </p>
        </div>

        <button
          type="button"
          onClick={handleGreetingChange}
          className="greeting-button"
        >
          Change Greeting
        </button>

        <div className="features">
          <h3>Features Demonstrated:</h3>
          <ul>
            <li>React Hooks (useState, useEffect)</li>
            <li>Real-time updates</li>
            <li>Interactive components</li>
            <li>TypeScript integration</li>
            <li>Biome linting & formatting</li>
          </ul>
        </div>
      </header>
    </div>
  );
}

export default App;
