import React from "react";
import Map from "../pages/map/Map";
import { createRoot } from "react-dom/client";
import Login from "../pages/login/Login";
import "./app.css";

function App() {
  return (
    <div>
      {/* <Login /> */}
      <Map />
    </div>
  );
}

export default App;

const container = document.getElementById("app");
const root = createRoot(container);
root.render(<App tab="home" />);
