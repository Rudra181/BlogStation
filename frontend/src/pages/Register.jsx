import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";

export default function Register() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/api/auth/register", { username, email, password });
      alert("Registered. Please login.");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Registration failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <header style={{ marginBottom: 12 }}>
          <h2>Create account</h2>
          <p className="kicker" style={{ marginTop: 6 }}>
            Join BlogStation — share your ideas
          </p>
        </header>

        <form className="form auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Username</label>
            <input
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Your display name"
              required
            />
          </div>

          <div className="field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Choose a secure password"
              required
            />
          </div>

          <div
            style={{
              display: "flex",
              gap: 8,
              alignItems: "center",
              justifyContent: "space-between",
              marginTop: 6,
            }}
          >
            <button type="submit" className="btn" disabled={loading}>
              {loading ? "Creating..." : "Create account"}
            </button>
            <Link
              to="/login"
              className="btn ghost"
              style={{ fontWeight: 600 }}
            >
              Already have an account?
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
