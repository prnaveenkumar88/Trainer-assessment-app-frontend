import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../services/httpClient";
import { saveAuth } from "../utils/auth";
import { normalizeLoginPayload } from "../utils/normalize";
import brandLogo from "../assets/branding/omotec-logo.gif";

function Auth() {
  const navigate = useNavigate();

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

      const loginData = normalizeLoginPayload(res.data);
      if (!loginData) {
        setError("Invalid login response from server");
        return;
      }

      saveAuth(
        loginData.token,
        loginData.role,
        loginData.email || email,
        loginData.name
      );

      if (loginData.role === "admin") {
        navigate("/admin", { replace: true });
      } else if (loginData.role === "assessor") {
        navigate("/assessor", { replace: true });
      } else {
        navigate("/trainer", { replace: true });
      }

    } catch {
      setError("Invalid email or password");
    }
  };

  return (
    <div className="auth-container">
      <img
        src={brandLogo}
        alt="OMOTEC Learn Tech For Future"
        className="auth-brand-logo"
      />

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
