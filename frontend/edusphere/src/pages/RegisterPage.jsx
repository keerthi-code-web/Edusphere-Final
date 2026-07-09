import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../services/authService";
import "../styles/RegisterPage.css";

const RegisterPage = () => {
  const navigate = useNavigate();

  // Always begin this page from the top when navigated to from another page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    agreeTerms: false,
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = "First name is required.";
    if (!formData.lastName.trim()) newErrors.lastName = "Last name is required.";
    if (!formData.email.trim()) {
      newErrors.email = "Email is required.";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Enter a valid email address.";
    }
    if (!formData.password) {
      newErrors.password = "Password is required.";
    } else if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters.";
    }
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Please confirm your password.";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }
    if (!formData.agreeTerms) newErrors.agreeTerms = "You must agree to the terms.";
    return newErrors;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
   try {

    const response = await register({

        first_name: formData.firstName,
        last_name: formData.lastName,
        email: formData.email,
        password: formData.password

    });

    alert(response.data.message);

    navigate("/login");

} catch (error) {

    if (error.response) {

        setErrors({
            general: error.response.data.message
        });

    } else {

        setErrors({
            general: "Server not responding."
        });

    }

}
  };

  const getPasswordStrength = () => {
    const p = formData.password;
    if (!p) return null;
    let score = 0;
    if (p.length >= 8) score++;
    if (/[A-Z]/.test(p)) score++;
    if (/[0-9]/.test(p)) score++;
    if (/[^A-Za-z0-9]/.test(p)) score++;
    if (score <= 1) return { label: "Weak", level: 1, color: "#ef4444" };
    if (score === 2) return { label: "Fair", level: 2, color: "#f59e0b" };
    if (score === 3) return { label: "Good", level: 3, color: "#3b82f6" };
    return { label: "Strong", level: 4, color: "#16a34a" };
  };

  const strength = getPasswordStrength();

  return (
    <div className="register-root">
      {/* Sidebar */}
      <div className="register-sidebar">
        <div className="sidebar-inner">
          <button className="sidebar-logo" onClick={() => navigate("/")}>
            <span className="logo-mark">E</span>
            <span className="logo-text">EduSphere</span>
          </button>
          <div className="sidebar-content">
            <h2 className="sidebar-headline">Your academic platform, all in one place</h2>
            <p className="sidebar-sub">
              EduSphere is a student-centric platform that brings together
              study planning, resource management, exam preparation, and
              progress tracking — so you can focus on what matters most:
              learning.
            </p>
          </div>
          <div className="sidebar-quote">
            <p className="quote-text">
              EduSphere is built for students who want structure, clarity, and
              a smarter way to manage their academic journey.
            </p>
            <div className="quote-author">
              <div className="author-avatar">ES</div>
              <div>
                <div className="author-name">EduSphere</div>
                <div className="author-role">Student Academic Platform</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Form Panel */}
      <div className="register-panel">
        <div className="register-form-wrap">
          <div className="form-header">
            <h1 className="form-title">Create your account</h1>
            <p className="form-sub">
              Already have an account?{" "}
              <button className="link-btn" onClick={() => navigate("/login")}>
                Sign in
              </button>
            </p>
          </div>

          <form className="register-form" onSubmit={handleSubmit} noValidate>
           {errors.general && (
    <div className="error-msg">
        {errors.general}
    </div>
)}
            {/* Name Row */}
            <div className="form-row">
              <div className="form-group">
                <label className="form-label">First Name</label>
                <input
                  className={`form-input ${errors.firstName ? "input-error" : ""}`}
                  type="text"
                  name="firstName"
                  placeholder="Arjun"
                  value={formData.firstName}
                  onChange={handleChange}
                  autoComplete="given-name"
                />
                {errors.firstName && (
                  <span className="error-msg">{errors.firstName}</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Last Name</label>
                <input
                  className={`form-input ${errors.lastName ? "input-error" : ""}`}
                  type="text"
                  name="lastName"
                  placeholder="Singh"
                  value={formData.lastName}
                  onChange={handleChange}
                  autoComplete="family-name"
                />
                {errors.lastName && (
                  <span className="error-msg">{errors.lastName}</span>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <div className="input-wrapper">
                <span className="input-icon">✉️</span>
                <input
                  className={`form-input input-with-icon ${errors.email ? "input-error" : ""}`}
                  type="email"
                  name="email"
                  placeholder="arjun@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  autoComplete="email"
                />
              </div>
              {errors.email && (
                <span className="error-msg">{errors.email}</span>
              )}
            </div>

            {/* Password */}
            <div className="form-group">
              <label className="form-label">Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  className={`form-input input-with-icon ${errors.password ? "input-error" : ""}`}
                  type={showPassword ? "text" : "password"}
                  name="password"
                  placeholder="Min. 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label="Toggle password visibility"
                >
                  {showPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {formData.password && strength && (
                <div className="password-strength">
                  <div className="strength-bars">
                    {[1, 2, 3, 4].map((n) => (
                      <div
                        key={n}
                        className="strength-bar"
                        style={{
                          background:
                            n <= strength.level ? strength.color : "#e2e8f0",
                        }}
                      />
                    ))}
                  </div>
                  <span
                    className="strength-label"
                    style={{ color: strength.color }}
                  >
                    {strength.label}
                  </span>
                </div>
              )}
              {errors.password && (
                <span className="error-msg">{errors.password}</span>
              )}
            </div>

            {/* Confirm Password */}
            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <div className="input-wrapper">
                <span className="input-icon">🔒</span>
                <input
                  className={`form-input input-with-icon ${errors.confirmPassword ? "input-error" : ""}`}
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  className="input-toggle"
                  onClick={() => setShowConfirmPassword((v) => !v)}
                  aria-label="Toggle confirm password visibility"
                >
                  {showConfirmPassword ? "🙈" : "👁️"}
                </button>
              </div>
              {errors.confirmPassword && (
                <span className="error-msg">{errors.confirmPassword}</span>
              )}
            </div>

            {/* Terms */}
            <div className="form-group">
              <label className={`checkbox-label ${errors.agreeTerms ? "checkbox-error" : ""}`}>
                <input
                  type="checkbox"
                  name="agreeTerms"
                  className="checkbox-input"
                  checked={formData.agreeTerms}
                  onChange={handleChange}
                />
                <span className="checkbox-custom" />
                <span className="checkbox-text">
                  I agree to the{" "}
                  <span className="link-inline">Terms of Service</span> and{" "}
                  <span className="link-inline">Privacy Policy</span>
                </span>
              </label>
              {errors.agreeTerms && (
                <span className="error-msg">{errors.agreeTerms}</span>
              )}
            </div>

            <button type="submit" className="btn-submit">
              Create Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;