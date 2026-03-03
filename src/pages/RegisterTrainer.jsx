import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../services/httpClient";
import brandLogo from "../assets/branding/omotec-logo.gif";

function RegisterTrainer() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [department, setDepartment] = useState("");
  const [branch, setBranch] = useState("");
  const [dateOfJoining, setDateOfJoining] = useState("");
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await httpClient.post("/auth/register-trainer", {
        name: name.trim(),
        email: email.trim().toLowerCase(),
        password,
        department: department.trim(),
        branch: branch.trim(),
        date_of_joining: dateOfJoining || null
      });

      setMessage(
        res?.data?.message ||
          "Trainer registered successfully. Please login."
      );
      setName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setDepartment("");
      setBranch("");
      setDateOfJoining("");
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Unable to register trainer right now"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <img
        src={brandLogo}
        alt="OMOTEC Learn Tech For Future"
        className="auth-brand-logo"
      />

      <div className="auth-card auth-card-wide">
        <h2 className="auth-title">Register Trainer</h2>

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            className="input"
            type="text"
            placeholder="Full name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            required
          />

          <input
            className="input"
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            maxLength={100}
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

          <input
            className="input"
            type="password"
            placeholder="Confirm password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />

          <input
            className="input"
            type="text"
            placeholder="Department (optional)"
            value={department}
            onChange={(e) => setDepartment(e.target.value)}
            maxLength={50}
          />

          <input
            className="input"
            type="text"
            placeholder="Branch (optional)"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
            maxLength={50}
          />

          <label className="auth-date-label" htmlFor="doj">
            Date of joining (optional)
          </label>
          <input
            id="doj"
            className="input"
            type="date"
            value={dateOfJoining}
            onChange={(e) => setDateOfJoining(e.target.value)}
          />

          <button className="btn-primary" type="submit" disabled={loading}>
            {loading ? "Registering..." : "Register Trainer"}
          </button>
        </form>

        {message && <p className="auth-message">{message}</p>}
        {error && <p className="auth-error">{error}</p>}

        <button
          type="button"
          className="btn-link auth-back-link"
          onClick={() => navigate("/", { replace: true })}
        >
          Back to login
        </button>
      </div>
    </div>
  );
}

export default RegisterTrainer;
