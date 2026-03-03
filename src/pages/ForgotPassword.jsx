import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import httpClient from "../services/httpClient";
import brandLogo from "../assets/branding/omotec-logo.gif";

function ForgotPassword() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [step, setStep] = useState("request");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleRequestOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const normalizedEmail = email.trim().toLowerCase();
    if (!normalizedEmail) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    try {
      const res = await httpClient.post("/auth/forgot-password/request", {
        email: normalizedEmail
      });

      setEmail(normalizedEmail);
      setStep("verify");
      setOtp("");
      setResetToken("");
      setMessage(
        res?.data?.message ||
          "If an account exists for this email, an OTP has been sent."
      );
    } catch (err) {
      const apiMessage =
        err?.response?.data?.message || "Unable to send OTP right now";
      const details = err?.response?.data?.error || "";
      setError(details ? `${apiMessage}: ${details}` : apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    const normalizedOtp = otp.trim();
    if (!normalizedOtp) {
      setError("OTP is required");
      return;
    }

    setLoading(true);
    try {
      const res = await httpClient.post("/auth/forgot-password/verify", {
        email: email.trim().toLowerCase(),
        otp: normalizedOtp
      });

      const token = res?.data?.resetToken;
      if (!token) {
        setError("Invalid verify response from server");
        return;
      }

      setResetToken(token);
      setStep("reset");
      setMessage(res?.data?.message || "OTP verified. Set your new password.");
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to verify OTP right now"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");

    if (!resetToken) {
      setError("Please verify OTP before changing password");
      setStep("verify");
      return;
    }

    if (!newPassword) {
      setError("New password is required");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const res = await httpClient.post("/auth/forgot-password/reset", {
        email: email.trim().toLowerCase(),
        resetToken,
        newPassword
      });

      setStep("done");
      setMessage(
        res?.data?.message ||
          "Password updated successfully. Please login with your new password."
      );
    } catch (err) {
      setError(
        err?.response?.data?.message || "Unable to reset password right now"
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

      <div className="auth-card">
        <h2 className="auth-title">
          Forgot Password
        </h2>

        {step === "request" && (
          <form onSubmit={handleRequestOtp} className="auth-form">
            <p className="auth-note">
              Enter your registered email to receive an OTP.
            </p>

            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Sending OTP..." : "Send OTP"}
            </button>
          </form>
        )}

        {step === "verify" && (
          <form onSubmit={handleVerifyOtp} className="auth-form">
            <p className="auth-note">
              Enter the OTP sent to <strong>{email}</strong>.
            </p>

            <input
              className="input"
              type="text"
              inputMode="numeric"
              maxLength={6}
              placeholder="6-digit OTP"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Verifying..." : "Verify OTP"}
            </button>

            <button
              type="button"
              className="btn-link"
              onClick={() => setStep("request")}
              disabled={loading}
            >
              Resend OTP
            </button>
          </form>
        )}

        {step === "reset" && (
          <form onSubmit={handleResetPassword} className="auth-form">
            <p className="auth-note">
              OTP verified for <strong>{email}</strong>. Set your new password.
            </p>

            <input
              className="input"
              type="password"
              placeholder="New password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />

            <input
              className="input"
              type="password"
              placeholder="Confirm new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <button className="btn-primary" type="submit" disabled={loading}>
              {loading ? "Updating Password..." : "Reset Password"}
            </button>

            <button
              type="button"
              className="btn-link"
              onClick={() => setStep("verify")}
              disabled={loading}
            >
              Back to OTP verification
            </button>
          </form>
        )}

        {step === "done" && (
          <div className="auth-form">
            <button
              type="button"
              className="btn-primary"
              onClick={() => navigate("/", { replace: true })}
            >
              Back To Login
            </button>
          </div>
        )}

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

export default ForgotPassword;
