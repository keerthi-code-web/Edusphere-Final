import React, { useState, useEffect } from "react";
import "../styles/AdminDashboard.css";
import { getAdmins } from "../services/adminService";
import { getStudents } from "../services/studentService";
import { getAllFeedback , updateFeedbackStatus} from "../services/feedbackService";
import { useNavigate } from "react-router-dom";
// ── Icons (inline SVG helpers) ──────────────────────────────────────────────
const Icon = ({ d, size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d={d} />
  </svg>
);

const icons = {
  students:    "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 3a4 4 0 1 0 0 8 4 4 0 0 0 0-8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
  activity:    "M22 12h-4l-3 9L9 3l-3 9H2",
  message:     "M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z",
};

// ── Sidebar Data ─────────────────────────────────────────────────────────────

const sidebarLinks = [
  { id: "overview", label: "Overview", icon: "activity" },
  { id: "feedback", label: "Feedback", icon: "message"  },
];

// ── Component ────────────────────────────────────────────────────────────────
export default function AdminDashboard() {
  const navigate = useNavigate();
  const [activeNav, setActiveNav] = useState("overview");
  const [menuOpen, setMenuOpen] = useState(false);


const [feedback, setFeedback] = useState([]);

// Placeholder sample data for the Registered Students list (UI only).
const sampleRegisteredStudents = [
  { id: 1, name: "Aarav Sharma", registeredAt: "08 Jul 2026, 10:35 AM" },
  { id: 2, name: "Meera Nair", registeredAt: "07 Jul 2026, 04:12 PM" },
  { id: 3, name: "Rohan Verma", registeredAt: "06 Jul 2026, 09:48 AM" },
  { id: 4, name: "Priya Iyer", registeredAt: "05 Jul 2026, 02:20 PM" },
];

  const [admins, setAdmins] = useState([]);
const [students, setStudents] = useState([]);


const loadAdmins = async () => {
    const feedbackResponse = await getAllFeedback();
  setFeedback(feedbackResponse.data.data);

    try {

        const response = await getAdmins();

        setAdmins(response.data.data);

    } catch (error) {

        console.error("Failed to load admins", error);

    }

};
const handleLogout = () => {

    localStorage.removeItem("adminToken");

    navigate("/login");

};
const loadStudents = async () => {

    try {

        const response = await getStudents();

        setStudents(response.data.data);

    } catch (error) {

        console.error("Failed to load students", error);

    }

};
  // Always open this page from the top.
  useEffect(() => {
    window.scrollTo(0, 0);

    loadAdmins();
    loadStudents();

  }, []);

  useEffect(() => {

    const refreshDashboard = () => {
        loadAdmins();
        loadStudents();
    };

    window.addEventListener("focus", refreshDashboard);

    return () => {
        window.removeEventListener("focus", refreshDashboard);
    };

}, []);
  // ── Derived stats ──
  const totalStudents = students.length;
  const totalFeedback = feedback.length;

  // ── Sidebar smooth-scroll navigation ──
  function goToSection(id) {
    setActiveNav(id);
    setMenuOpen(false);
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // ── Feedback handlers ──
  // NOTE: Feedback is view + mark-reviewed only — no reply functionality.
  // Once a backend is connected, this list can be populated directly from
  // submissions made through Command Center's Send Feedback section.
 
const toggleReviewed = async (feedbackId) => {

    try {

        await updateFeedbackStatus(
            feedbackId,
            "Reviewed"
        );

        await loadAdmins();

    } catch (error) {

        console.error(error);

    }

};
  console.log(admins);

  return (
    <div className="ad-root">
      {/* ── Sidebar ── */}
      <aside className={`ad-sidebar ${menuOpen ? "ad-sidebar--open" : ""}`}>
        <div className="ad-sidebar__brand">
          <div className="ad-sidebar__logo">
            <span>E</span>
          </div>
          <span className="ad-sidebar__name">EduSphere</span>
        </div>

        <nav className="ad-sidebar__nav">
          {sidebarLinks.map(item => (
            <button
              key={item.id}
              className={`ad-nav-item ${activeNav === item.id ? "ad-nav-item--active" : ""}`}
              onClick={() => goToSection(item.id)}
            >
              <Icon d={icons[item.icon]} size={18} />
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
        <div className="ad-sidebar-footer">
    <button
        className="ad-logout-btn"
        onClick={handleLogout}
    >
       ↪ Logout
    </button>
</div>
      </aside>

      {/* ── Main ── */}
      <main className="ad-main">

        {/* Top Bar — title + subtitle merged into the navbar, no sticky behaviour */}
        <header className="ad-topbar">
          <button className="ad-hamburger" onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu">
            <span /><span /><span />
          </button>
          <div className="ad-topbar__title">
            <h1 className="ad-page-title">EduSphere Admin Dashboard</h1>
            <p className="ad-page-subtitle">Platform Monitoring &amp; Management</p>
          </div>
        </header>

        <div className="ad-content">

          {/* ── Overview Cards ── */}
          <section className="ad-section" id="overview">
            <div className="ad-stats-grid">
              <div className="ad-stat-card ad-stat-card--blue">
                <div className="ad-stat-card__icon"><Icon d={icons.students} size={22} /></div>
                <div className="ad-stat-card__body">
                  <span className="ad-stat-card__value">{totalStudents.toLocaleString()}</span>
                  <span className="ad-stat-card__label">Registered Students</span>
                </div>
              </div>
              <div className="ad-stat-card ad-stat-card--indigo">
                <div className="ad-stat-card__icon"><Icon d={icons.message} size={22} /></div>
                <div className="ad-stat-card__body">
                  <span className="ad-stat-card__value">{totalFeedback}</span>
                  <span className="ad-stat-card__label">Feedback Received</span>
                </div>
              </div>
            </div>
          </section>

          {/* ── Registered Students ── */}
          <section className="ad-section" id="registered-students">
            <div className="ad-section-header">
              <h2 className="ad-section-title">Registered Students</h2>
            </div>
            <div className="ad-students-list">
              {students.length === 0 ? (

    <p className="ad-empty-text">
        No students registered yet.
    </p>

) : (

    students.map((s) => (
        <div key={s.student_id} className="ad-student-row">

            <p className="ad-student-row__name">
                👤 {s.first_name} {s.last_name}
            </p>

            <p className="ad-student-row__date">
                Registered: {new Date(s.created_at).toLocaleDateString("en-GB")}
            </p>

        </div>
    ))

)}
            </div>
          </section>

          {/* ── Feedback Management ── */}
          <section className="ad-section" id="feedback">
            <div className="ad-section-header" id="feedback-header">
              <h2 className="ad-section-title">Feedback</h2>
              <p className="ad-section-desc">
                View feedback messages submitted by students and mark them as reviewed.
              </p>
            </div>
            <div className="ad-feedback-grid">
              {feedback.map((f) => (
                <div key={f.feedback_id} className={`ad-feedback-card ${f.status === "Reviewed" ? "ad-feedback-card--reviewed" : ""}`}>
                  <div className="ad-feedback-card__top">
                    <p className="ad-feedback-card__student">{f.first_name} {f.last_name}</p>
                    <span className={`ad-tag ${f.status === "Reviewed" ? "tag-resources" : "tag-exams"}`}>
                      {f.status}
                    </span>
                  </div>
                  <p className="ad-feedback-card__message">{f.message}</p>
                  <div className="ad-feedback-card__bottom">
                    <span className="ad-feedback-card__date">{new Date(f.submitted_at).toLocaleDateString()}</span>
                    {f.status !== "Reviewed" && (
  <button
    className="ad-link-btn"
    onClick={() => toggleReviewed(f.feedback_id)}
  >
    Mark as Reviewed
  </button>
)}
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* ── Motivational Banner ── */}
          <section className="ad-section ad-section--last">
            <div className="ad-banner">
              <div className="ad-banner__glow" />
              <div className="ad-banner__content">
                <p className="ad-banner__eyebrow">Lead with Impact</p>
                <blockquote className="ad-banner__quote">
                  "A well-maintained platform empowers every learner who depends on it."
                </blockquote>
                <p className="ad-banner__sub">
                  Keep the platform reliable, informed, and running smoothly for all students.
                </p>
              </div>
              <div className="ad-banner__shapes" aria-hidden="true">
                <div className="ad-banner__circle ad-banner__circle--1" />
                <div className="ad-banner__circle ad-banner__circle--2" />
                <div className="ad-banner__circle ad-banner__circle--3" />
              </div>
            </div>
          </section>

        </div>
      </main>

      {/* Overlay for mobile sidebar */}
      {menuOpen && (
        <div className="ad-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </div>
  );
}