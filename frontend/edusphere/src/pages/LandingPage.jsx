import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/LandingPage.css";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: "🧠",
      title: "Knowledge Vault",
      description: "Organize academic resources, notes, and study materials in one structured library.",
    },
    {
      icon: "🗺️",
      title: "StudyPath",
      description: "Personal weekly learning planner tailored to your subjects and academic goals.",
    },
    {
      icon: "🚀",
      title: "Mission Control",
      description: "Academic tasks, reminders, and deadlines — all tracked in one place.",
    },
    {
      icon: "⚡",
      title: "RapidPrep",
      description: "Quick exam preparation using important questions and previous year papers.",
    },
    {
      icon: "📊",
      title: "ProgressIQ",
      description: "Activity-based academic progress tracking to keep you on course.",
    },
    {
      icon: "⚙️",
      title: "Command Center",
      description: "Student dashboard and quick access hub for everything in EduSphere.",
    },
  ];

  const benefits = [
    { icon: "📚", label: "All resources in one place" },
    { icon: "🗓️", label: "Structured weekly planning" },
    { icon: "🎯", label: "Goal-oriented study tracking" },
    { icon: "📝", label: "Exam prep made simple" },
  ];

  return (
    <div className="landing-root">
      {/* NAV */}
      <nav className="landing-nav">
        <div className="nav-inner">
          <div className="nav-logo">
            <span className="logo-mark">E</span>
            <span className="logo-text">EduSphere</span>
          </div>
          <div className="nav-links">
            <a href="#features" className="nav-link">Features</a>
            <a href="#benefits" className="nav-link">Why EduSphere</a>
            <a href="#cta" className="nav-link">Get Started</a>
          </div>
          <div className="nav-actions">
            <button className="btn-ghost" onClick={() => navigate("/login")}>
              Sign In
            </button>
            <button className="btn-primary" onClick={() => navigate("/register")}>
              Get Started
            </button>
          </div>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-inner">
          <div className="hero-content">
            <span className="hero-eyebrow">Your Student Academic Platform</span>
            <h1 className="hero-headline">
              Learn Smarter.<br />
              <span className="headline-accent">Achieve More.</span>
            </h1>
            <p className="hero-sub">
              EduSphere brings together your study tools, weekly planner, exam
              prep, and academic tracking — everything a student needs in one
              unified platform.
            </p>
            <div className="hero-cta-row">
              <button
                className="btn-primary btn-lg"
                onClick={() => navigate("/register")}
              >
                Get Started
              </button>
              <button
                className="btn-outline btn-lg"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          </div>

          <div className="hero-illustration">
            <div className="illustration-card card-main">
              <div className="illus-bar">
                <span className="illus-dot red" />
                <span className="illus-dot yellow" />
                <span className="illus-dot green" />
              </div>
              <div className="illus-body">
                <div className="illus-label">Today's Study Plan</div>
                <div className="illus-progress-row">
                  <span>Mathematics</span>
                  <span className="illus-badge green-badge">85%</span>
                </div>
                <div className="illus-track">
                  <div className="illus-fill" style={{ width: "85%" }} />
                </div>
                <div className="illus-progress-row">
                  <span>Physics</span>
                  <span className="illus-badge blue-badge">62%</span>
                </div>
                <div className="illus-track">
                  <div className="illus-fill blue-fill" style={{ width: "62%" }} />
                </div>
                <div className="illus-progress-row">
                  <span>Chemistry</span>
                  <span className="illus-badge green-badge">91%</span>
                </div>
                <div className="illus-track">
                  <div className="illus-fill" style={{ width: "91%" }} />
                </div>
              </div>
            </div>

            <div className="illustration-card card-streak">
              <span className="streak-icon">🔥</span>
              <div>
                <div className="streak-num">14</div>
                <div className="streak-label">Day Streak</div>
              </div>
            </div>

            <div className="illustration-card card-score">
              <div className="score-circle">
                <span className="score-val">A+</span>
              </div>
              <div className="score-label">Last Mock Test</div>
            </div>
          </div>
        </div>
      </section>

      {/* BENEFITS (replaces stats) */}
      <section className="stats-section" id="benefits">
        <div className="section-inner">
          <div className="stats-grid">
            {benefits.map((b) => (
              <div className="stat-card" key={b.label}>
                <div className="stat-value">{b.icon}</div>
                <div className="stat-label">{b.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div className="section-inner">
          <div className="section-header">
            <span className="section-eyebrow">Everything You Need</span>
            <h2 className="section-title">Built for Serious Students</h2>
            <p className="section-sub">
              Six purpose-built modules that work together to keep your
              academics organised and your progress on track.
            </p>
          </div>
          <div className="features-grid">
            {features.map((f) => (
              <div className="feature-card" key={f.title}>
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="cta-section" id="cta">
        <div className="section-inner">
          <div className="cta-card">
            <span className="section-eyebrow light-eyebrow">Ready to Begin?</span>
            <h2 className="cta-title">Start Your Academic Journey with EduSphere</h2>
            <p className="cta-sub">
              Create your account and set up your personalised student
              dashboard in just a few minutes.
            </p>
            <div className="cta-btn-row">
              <button
                className="btn-white btn-lg"
                onClick={() => navigate("/register")}
              >
                Create Account
              </button>
              <button
                className="btn-outline-white btn-lg"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="landing-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="nav-logo">
              <span className="logo-mark">E</span>
              <span className="logo-text">EduSphere</span>
            </div>
            <p className="footer-tagline">
              A unified academic platform for students.
            </p>
          </div>
          <div className="footer-links-group">
            <div className="footer-col">
              <div className="footer-col-title">Product</div>
              <a className="footer-link" href="#features">Features</a>
              <a className="footer-link" href="#benefits">Why EduSphere</a>
            </div>
            <div className="footer-col">
              <div className="footer-col-title">Account</div>
              <a className="footer-link" href="/register">Sign Up</a>
              <a className="footer-link" href="/login">Sign In</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} EduSphere. All rights reserved.</span>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;