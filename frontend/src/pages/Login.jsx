import React, { useState, useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axiosConfig";
import { UserContext } from "../context/UserContext";

export default function Login() {
  const { login } = useContext(UserContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post("/api/auth/login", { email, password });
      // expect { token, user }
      login({ user: res.data.user, token: res.data.token });
      navigate("/");
    } catch (err) {
      console.error(err);
      alert("Login failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <div className="auth-card">
        <header style={{ marginBottom: 12 }}>
          <h2>Welcome back</h2>
          <p className="kicker" style={{ marginTop: 6 }}>
            Sign in to continue to BlogStation
          </p>
        </header>

        <form className="form auth-form" onSubmit={handleSubmit}>
          <div className="field">
            <label>Email</label>
            <input
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="field">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
              {loading ? "Signing in..." : "Sign in"}
            </button>
            <Link
              to="/register"
              className="btn ghost"
              style={{ fontWeight: 600 }}
            >
              Register
            </Link>
          </div>
        </form>
      </div>
    </main>
  );
}
