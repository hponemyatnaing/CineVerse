import "./Login.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import {
  FaEnvelope,
  FaLock,
  FaEye,
  FaEyeSlash,
  FaGoogle,
} from "react-icons/fa";

import { loginUser } from "../../services/authService";
import { getUserProfile } from "../../services/userService";

function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      setError("Please enter email and password");

      return;
    }

    try {
      setLoading(true);

      setError("");

      const userCredential = await loginUser(email, password);

      const firebaseUser = userCredential.user;

      const profile = await getUserProfile(firebaseUser.uid);

      if (!profile) {
        setError("User profile not found");

        return;
      }

      localStorage.setItem(
        "user",

        JSON.stringify({
          uid: firebaseUser.uid,

          email: firebaseUser.email,

          name: profile.name,

          role: profile.role,
        }),
      );

      if (profile.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }

    {
      loading ? "Signing In..." : "Login";
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-logo">🎬 CineVerse</h1>

        <h2>Welcome Back</h2>

        <p>Login to continue your movie journey.</p>

        <div className="input-group">
          <FaEnvelope className="input-icon" />

          <input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div className="input-group">
          <FaLock className="input-icon" />

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleLogin()}
          />

          <button
            type="button"
            className="eye-btn"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <FaEyeSlash /> : <FaEye />}
          </button>
        </div>

        {error && <p className="login-error">{error}</p>}

        <div className="login-options">
          <label>
            <input type="checkbox" />
            Remember Me
          </label>

          <a href="#">Forgot Password?</a>
        </div>

        <button className="login-btn" onClick={handleLogin} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div className="divider">
          <span>OR</span>
        </div>

        <button className="google-btn">
          <FaGoogle />
          Continue with Google
        </button>

        <p className="register-link">
          Don't have an account?
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
