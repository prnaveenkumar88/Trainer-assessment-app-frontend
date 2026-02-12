import React, { useState } from "react";
import httpClient from "../services/httpClient";
import { saveAuth } from "../utils/auth";

function Auth() {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await httpClient.post("/auth/login", {
        email,
        password
      });

      saveAuth(
        res.data.token,
        res.data.role,
        res.data.email,
        res.data.name
      );

      if (res.data.role === "admin") {
        window.location.href = "/admin";
      } else if (res.data.role === "assessor") {
        window.location.href = "/assessor";
      } else {
        window.location.href = "/trainer";
      }

    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2 className="auth-title">
          Trainer Assessment Login
        </h2>

        <form onSubmit={handleLogin} className="auth-form">

          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            className="input"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button className="btn-primary" type="submit">
            Login
          </button>

          {error && <p className="auth-error">{error}</p>}

        </form>

      </div>

    </div>
  );
}

export default Auth;
