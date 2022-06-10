import React from "react";
import "./login.css";

function Login() {
  return (
    <div className="container">
      <p>Welcome Admin </p>
      <form className="form">
        <input className="username-input" placeholder="username" />
        <input
          className="password-input"
          type="password"
          placeholder="password"
        />
        <input type="submit" className="submit-btn" value="login" />
      </form>
    </div>
  );
}

export default Login;
