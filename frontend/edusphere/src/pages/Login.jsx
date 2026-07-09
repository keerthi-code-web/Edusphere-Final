import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from "../services/authService";
import '../styles/Login.css';
import { loginAdmin } from "../services/adminService";


export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  // Always begin this page from the top when navigated to from another page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
const handleSubmit = async (e) => {

    e.preventDefault();

    setError("");

    if (!email || !password) {
        setError("Please fill in all fields.");
        return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
        setError("Please enter a valid email address.");
        return;
    }

    if (password.length < 6) {
        setError("Password must be at least 6 characters.");
        return;
    }

    setIsLoading(true);

    try {

        // -------------------------------
        // Try Student Login First
        // -------------------------------

        const response = await login(email, password);

        localStorage.setItem(
            "token",
            response.data.token
        );

        localStorage.setItem(
            "user",
            JSON.stringify(response.data.user)
        );

        if (response.data.user.profile_completed) {

            navigate("/command-center");

        } else {

            navigate("/onboarding");

        }

    } catch (studentError) {

        try {

            // -------------------------------
            // Student Login Failed
            // Try Admin Login
            // -------------------------------

            const adminResponse = await loginAdmin({

                email,
                password

            });

            localStorage.setItem(
                "adminToken",
                adminResponse.data.token
            );

            navigate("/admin-dashboard");

        } catch (adminError) {

            if (adminError.response) {

                setError(
                    "Invalid Email or Password."
                );

            } else {

                setError(
                    "Server not responding."
                );

            }

        }

    } finally {

        setIsLoading(false);

    }

};
  const footerFeatures = [
    { title: 'Secure & Reliable' },
    { title: 'Track Progress' },
    { title: 'Achieve Goals' },
  ];

  return (
    <div className="login-container">
      <div className="login-wrapper">
        {/* Left Section - Branding */}
        <div className="login-left">
          <div className="branding-section">
            <div className="logo-header">
              <div className="logo">
                <span className="logo-mark-text">E</span>
              </div>
              <h1 className="logo-title">EduSphere</h1>
            </div>
            <p className="tagline">Student Academic Platform</p>
          </div>

          <p className="platform-description">
            Manage tasks, organise resources, plan your studies, prepare for
            exams, and track academic progress — all in one place.
          </p>
        </div>

        {/* Right Section - Login Form */}
        <div className="login-right">
          <div className="form-container">
            <h2 className="form-title">Welcome Back!</h2>
            <p className="form-subtitle">Sign in to continue to EduSphere</p>

            <form onSubmit={handleSubmit} className="login-form">
              {error && <div className="error-message">{error}</div>}

              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  id="password"
                  type="password"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="input-field"
                  required
                />
              </div>

              <button type="submit" className="login-button" disabled={isLoading}>
                {isLoading ? 'Signing in...' : 'Sign In'}
              </button>
            </form>

            {/* Additional Links */}
            <div className="auth-links">
              <span className="auth-links-text">Don't have an account?</span>
              <button
                className="link link-btn-inline"
                onClick={() => navigate('/register')}
              >
                Create Account
              </button>
            </div>

            {/* Footer Features */}
            <div className="footer-features">
              {footerFeatures.map((feature, index) => (
                <div key={index} className="footer-feature-item">
                  <span className="footer-feature-icon">✓</span>
                  <span className="footer-feature-title">{feature.title}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}