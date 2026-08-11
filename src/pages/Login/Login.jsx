import "./Login.css";

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { FaEnvelope, FaLock, FaEye, FaEyeSlash } from "react-icons/fa";

import * as Yup from "yup";

import { loginUser, resetUserPassword } from "../../services/authService";

import { getUserProfile } from "../../services/userService";

function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const loginSchema = Yup.object({
    email: Yup.string()
      .trim()
      .email("Please enter a valid email address")
      .required("Email is required"),

    password: Yup.string()
      .required("Password is required")
      .min(6, "Password must be at least 6 characters"),
  });

  const handleLogin = async (e) => {
    if (e) {
      e.preventDefault();
    }

    setError("");

    try {
      await loginSchema.validate(
        {
          email,
          password,
        },
        {
          abortEarly: true,
        },
      );

      setLoading(true);

      const userCredential = await loginUser(email.trim(), password);

      const firebaseUser = userCredential.user;

      const profile = await getUserProfile(firebaseUser.uid);

      if (!profile) {
        setError("User profile not found.");
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
      console.log("Login Error:", error);

      if (error.name === "ValidationError") {
        setError(error.message);
        return;
      }

      switch (error.code) {
        case "auth/invalid-credential":
          setError("Invalid email or password.");
          break;

        case "auth/user-not-found":
          setError("User account not found.");
          break;

        case "auth/wrong-password":
          setError("Incorrect password.");
          break;

        case "auth/invalid-email":
          setError("Invalid email address.");
          break;

        case "auth/too-many-requests":
          setError("Too many login attempts. Please try again later.");
          break;

        default:
          setError(error.message || "Login failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    setError("");

    const resetEmail = email.trim();

    if (!resetEmail) {
      setError("Please enter your email address first.");
      return;
    }

    try {
      setLoading(true);

      await resetUserPassword(resetEmail);

      alert("Password reset email sent successfully. Please check your email.");
    } catch (error) {
      console.log("Forgot Password Error:", error);

      switch (error.code) {
        case "auth/invalid-email":
          setError("Please enter a valid email address.");
          break;

        case "auth/user-not-found":
          setError("No account found with this email address.");
          break;

        case "auth/too-many-requests":
          setError("Too many requests. Please try again later.");
          break;

        default:
          setError(error.message || "Unable to send password reset email.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (setter) => (e) => {
    setter(e.target.value);

    if (error) {
      setError("");
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">🎬 MoraView</div>

        <h2>Welcome Back</h2>

        <p className="login-subtitle">Login to continue your movie journey.</p>

        <form onSubmit={handleLogin}>
          <div className="input-group">
            <FaEnvelope className="input-icon" />

            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={handleInputChange(setEmail)}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="input-group">
            <FaLock className="input-icon" />

            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={handleInputChange(setPassword)}
              disabled={loading}
              autoComplete="current-password"
            />

            <button
              type="button"
              className="eye-btn"
              onClick={() => setShowPassword((prev) => !prev)}
              disabled={loading}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>

          {error && <div className="login-error">{error}</div>}

          <div className="login-options">
            <label>
              <input type="checkbox" disabled={loading} />
              <span>Remember Me</span>
            </label>

            <button
              type="button"
              className="forgot-password"
              onClick={handleForgotPassword}
              disabled={loading}
            >
              Forgot Password?
            </button>
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="register-link">
          Don't have an account?
          <Link to="/register">Register</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
