import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/StudyPath.css";
import { applyStoredTheme } from "../utils/theme";
import { getStudyPlans, createStudyPlan, updateStudyPlan } from "../services/studyPlanService";

const DAYS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];
const DAY_FULL = {
  Mon: "Monday", Tue: "Tuesday", Wed: "Wednesday", Thu: "Thursday",
  Fri: "Friday", Sat: "Saturday", Sun: "Sunday",
};
const TODAY_ABBR = DAYS[(new Date().getDay() + 6) % 7]; // getDay: Sun=0 → map to Mon-first index

const SUBJECT_COLORS = {
  Mathematics: "#3b82f6", Physics: "#f59e0b", Chemistry: "#10b981",
  Biology: "#06b6d4", "Computer Science": "#8b5cf6", English: "#ec4899",
};
const PALETTE = ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ec4899", "#06b6d4"];

const SEED_PLANS = [
  {
    id: 1,
    name: "DBMS Revision",
    subject: "Database Systems",
    days: ["Mon", "Wed", "Fri"],
    activity: "Revise Transaction Management & Normalization",
    estTime: "1 hr",
    notes: "",
    progress: 80,
    completed: false,
  },
  {
    id: 2,
    name: "Machine Learning Basics",
    subject: "Machine Learning",
    days: ["Tue", "Thu"],
    activity: "Linear Regression & Classification Algorithms",
    estTime: "1.5 hrs",
    notes: "",
    progress: 60,
    completed: false,
  },
  {
    id: 3,
    name: "Software Engineering",
    subject: "Software Engineering",
    days: ["Mon", "Thu"],
    activity: "Design Patterns & SDLC Notes",
    estTime: "45 min",
    notes: "",
    progress: 70,
    completed: false,
  },
  {
    id: 4,
    name: "Aptitude Practice",
    subject: "Aptitude",
    days: ["Tue", "Fri"],
    activity: "Practice problem sets",
    estTime: "30 min",
    notes: "",
    progress: 100,
    completed: true,
  },
];

let nextId = 10;

const QUOTE = "Small progress every day leads to big achievements.";

export default function StudyPath() {
  const navigate = useNavigate();

  // Always open this module from the top of the page; restore saved theme
  useEffect(() => {
    window.scrollTo(0, 0);
    applyStoredTheme();
    loadStudyPlans();
}, []);

  const loadStudyPlans = async () => {
    try {
        const response = await getStudyPlans();

        const formattedPlans = response.data.data.map(plan => ({
            id: plan.plan_id,
            name: plan.plan_name,
            subject: plan.subject,
            days: plan.study_days ? plan.study_days.split(",") : [],
            activity: plan.plan_name,
            estTime: plan.estimated_hours,
             status: plan.status,
            notes: "",
            progress: plan.status === "Completed" ? 100 : 0,
            completed: plan.status === "Completed"
        }));

        setPlans(formattedPlans);
    } catch (error) {
        console.error("Failed to load study plans", error);
    }
};

  const [plans, setPlans] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: "", subject: "", day: "", estTime: "", notes: "",
  });
  const [errors, setErrors] = useState({});

  /* ── Derived stats ── */
  const totalPlans = plans.length;
  const completedPlans = plans.filter((p) => p.completed).length;
  const pendingPlans = totalPlans - completedPlans;
  const overallProgress = totalPlans
    ? Math.round(plans.reduce((sum, p) => sum + p.progress, 0) / totalPlans)
    : 0;

  /* ── Weekly schedule built from all plans ── */
  const weekSchedule = useMemo(() => {
    return DAYS.map((abbr) => {
      const entries = plans
        .filter((p) => p.days.includes(abbr))
       .map((p) => ({
    planId: p.id,
    subject: p.subject,
    activity: p.activity,
    estTime: p.estTime,
    completed: p.completed,
    color:
        SUBJECT_COLORS[p.subject] ||
        PALETTE[p.id % PALETTE.length]
}));
      return { day: DAY_FULL[abbr], abbr, entries };
    });
  }, [plans]);

  /* ── Today's plan ── */
  const todayEntries = weekSchedule.find((d) => d.abbr === TODAY_ABBR)?.entries || [];

  /* ── Pending activities (from incomplete plans) ── */
  const pendingActivities = plans.filter((p) => !p.completed);

  /* ── Form handlers ── */
  const validate = () => {
    const e = {};
    if (!form.name.trim()) e.name = "Plan name is required.";
    if (!form.subject.trim()) e.subject = "Subject is required.";
    if (!form.day) e.day = "Select a study day.";
    if (!form.estTime.trim()) e.estTime = "Estimated study time is required.";
    return e;
  };

  const closeModal = () => {
    setShowModal(false);
    setForm({ name: "", subject: "", day: "", estTime: "", notes: "" });
    setErrors({});
  };
const handleCreatePlan = async () => {

    console.log("Create button clicked");

    const e = validate();

    console.log(e);

    if (Object.keys(e).length) {
        setErrors(e);
        return;
    }

    try {

        console.log("Calling Backend...");

        await createStudyPlan({
            plan_name: form.name,
            subject: form.subject,
            study_days: form.day,
            estimated_hours: form.estTime
        });

        console.log("Backend Success");

        await loadStudyPlans();

        closeModal();

    } catch (error) {

    console.log("Axios Error:", error);

    if (error.response) {
        console.log("Status:", error.response.status);
        console.log("Response:", error.response.data);
    }

}

};
 const togglePlanComplete = async (id) => {

    const selectedPlan = plans.find(plan => plan.id === id);

    try {

        await updateStudyPlan(id, {

            plan_name: selectedPlan.name,

            subject: selectedPlan.subject,

            study_days: selectedPlan.days.join(","),

            estimated_hours: selectedPlan.estTime,

            status: selectedPlan.completed ? "Active" : "Completed"

        });

        await loadStudyPlans();

    }

    catch (error) {

        console.error("Failed to update study plan", error);

    }

};

 
const ringRadius = 50;

const ringCircumference = 2 * Math.PI * ringRadius;

const progressOffset =
  ringCircumference -
  (overallProgress / 100) * ringCircumference;
  return (
    <div className="sp-root">
      {/* ── Header ── */}
      <header className="sp-header">
        <div className="sp-header-text">
          <button className="sp-back-btn" onClick={() => navigate('/command-center')}>← Back to Dashboard</button>
          <h1 className="sp-title"><span className="sp-title-icon">🗺️</span> StudyPath</h1>
          <p className="sp-subtitle">
            Build personalised weekly study plans and track your learning progress.
          </p>
        </div>
        <button className="sp-btn-primary" onClick={() => setShowModal(true)}>+ New Plan</button>
      </header>

      {/* ── Stat Cards ── */}
      <section className="sp-stat-grid">
        <div className="sp-stat-card">
          <span className="sp-stat-icon">📘</span>
          <div>
            <p className="sp-stat-label">Total Plans</p>
            <p className="sp-stat-value">{totalPlans}</p>
          </div>
        </div>
        <div className="sp-stat-card">
          <span className="sp-stat-icon">✅</span>
          <div>
            <p className="sp-stat-label">Completed Plans</p>
            <p className="sp-stat-value">{completedPlans}</p>
          </div>
        </div>
        <div className="sp-stat-card">
          <span className="sp-stat-icon">⏳</span>
          <div>
            <p className="sp-stat-label">Pending Plans</p>
            <p className="sp-stat-value">{pendingPlans}</p>
          </div>
        </div>
        <div className="sp-stat-card">
          <span className="sp-stat-icon">📊</span>
          <div>
            <p className="sp-stat-label">Overall Progress</p>
            <p className="sp-stat-value">{overallProgress}%</p>
          </div>
        </div>
      </section>

      {/* ── Today's Study Plan ── */}
      <section className="sp-card sp-rec-card">
        <div className="sp-rec-card-header">
          <div className="sp-rec-icon-wrap">
            <span className="sp-rec-icon">📅</span>
          </div>
          <h3 className="sp-rec-title">Today's Study Plan</h3>
        </div>
        {todayEntries.length === 0 ? (
          <>
            <p className="sp-rec-text">
              You don't have a study plan for today yet. A few focused minutes now
              builds the habit that gets you to your goals — create a plan to stay on track!
            </p>
            <button className="sp-btn-secondary" onClick={() => setShowModal(true)}>
              Create a Plan →
            </button>
          </>
        ) : (
          <ul className="sp-today-list">
            {todayEntries.map((e, i) => (
              <li className="sp-today-item" key={i}>
                <span className="sp-today-dot" style={{ background: e.color }} />
                <div className="sp-today-body">
                  <p className="sp-today-task">{e.activity}</p>
                  <span className="sp-today-meta">{e.subject} · {e.estTime}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* ── Active Plans ── */}
      <section className="sp-card">
        <div className="sp-card-head">
          <h2 className="sp-card-title">Active Plans</h2>
          <span className="sp-badge">{plans.length} plans</span>
        </div>
        {plans.length === 0 ? (
          <p className="sp-empty-text">No study plans yet. Create your first plan to get started.</p>
        ) : (
          <ul className="sp-timeline">
            {plans.map((item) => {
              const color = SUBJECT_COLORS[item.subject] || PALETTE[item.id % PALETTE.length];
              return (
                <li className="sp-timeline-item" key={item.id}>
                  <div className="sp-tl-dot" style={{ background: color }} />
                  <div className="sp-tl-body">
                    <div className="sp-tl-row">
                      <span className="sp-tl-subject">{item.name}</span>
                      <span className="sp-tl-pct" style={{ color }}>
                        {item.progress}%
                      </span>
                    </div>
                    <div className="sp-progress-track">
                      <div
                        className="sp-progress-fill"
                        style={{ width: `${item.progress}%`, background: color }}
                      />
                    </div>
                    <button
                      className="sp-tl-toggle"
                      onClick={() => togglePlanComplete(item.id)}
                    >
                      {item.completed ? "✓ Completed" : "Mark as Complete"}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Pending Activities ── */}
      <section className="sp-card">
        <div className="sp-card-head">
          <h2 className="sp-card-title">Pending Activities</h2>
          <span className="sp-badge sp-badge-warn">{pendingActivities.length} pending</span>
        </div>
        {pendingActivities.length === 0 ? (
          <p className="sp-empty-text">All caught up — no pending activities.</p>
        ) : (
          <ul className="sp-task-list">
            {pendingActivities.map((p) => {
              const color = SUBJECT_COLORS[p.subject] || PALETTE[p.id % PALETTE.length];
              return (
                <li className="sp-task-item" key={p.id}>
                  <span className="sp-task-icon" style={{ color }}>📖</span>
                  <div className="sp-task-body">
                    <p className="sp-task-title">{p.activity}</p>
                    <span className="sp-task-due" style={{ background: `${color}1a`, color }}>
                      {p.subject} · {p.days.join(", ")}
                    </span>
                  </div>
                  <button className="sp-task-check" aria-label="Mark done" onClick={() => togglePlanComplete(p.id)}>✓</button>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Weekly Schedule ── */}
      <section className="sp-card">
        <div className="sp-card-head">
          <h2 className="sp-card-title">Weekly Schedule</h2>
          <span className="sp-week-label">This Week</span>
        </div>
        <div className="sp-week-grid">
          {weekSchedule.map((day) => (
  <div
    className={`sp-day-card ${
      day.abbr === TODAY_ABBR ? "sp-day-today" : ""
    }`}
    key={day.day}
  >
    <div className="sp-day-header">
      {day.day}
    </div>

    {day.entries.length === 0 ? (
      <p className="sp-no-plan">
        No study planned.
      </p>
    ) : (
      day.entries.map((s, i) => (
        <div className="sp-session" key={i}>

          <p className="sp-session-time">
            {s.estTime}
          </p>

          <p className="sp-session-task">
            {s.activity}
          </p>

          <div className="sp-session-footer">

            <span
              className="sp-session-tag"
              style={{
                background: `${s.color}20`,
                color: s.color
              }}
            >
              {s.subject}
            </span>

            <span
              className={`sp-status-badge ${
                s.completed
                  ? "sp-status-completed"
                  : "sp-status-pending"
              }`}
            >
              {s.completed ? "✅ Completed" : "🟡 Pending"}
            </span>

          </div>

        </div>
      ))
    )}

  </div>
))}
        </div>
      </section>

      {/* ── Overall Progress ── */}
      <section className="sp-card sp-progress-card">
        <h2 className="sp-card-title">Overall Plan Progress</h2>
        <div className="sp-ring-wrap">
          <svg className="sp-ring" viewBox="0 0 120 120">
            <circle cx="60" cy="60" r="50" className="sp-ring-bg" />
           <circle
    cx="60"
    cy="60"
    r="50"
    className="sp-ring-fg"
    strokeDasharray={ringCircumference}
    strokeDashoffset={progressOffset}
/>
            <text x="60" y="55" className="sp-ring-pct">{overallProgress}%</text>
            <text x="60" y="72" className="sp-ring-sub">Complete</text>
          </svg>
        </div>
        <div className="sp-progress-bar-lg-wrap">
          <div className="sp-progress-bar-lg-track">
            <div className="sp-progress-bar-lg-fill" style={{ width: `${overallProgress}%` }} />
          </div>
          <span className="sp-progress-bar-lg-label">{completedPlans} / {totalPlans} plans completed</span>
        </div>
      </section>

      {/* ── Motivational Quote ── */}
      <section className="sp-card sp-quote-card">
        <span className="sp-quote-mark">"</span>
        <h3 className="sp-quote-title">Stay Consistent</h3>
        <p className="sp-quote-text">{QUOTE}</p>
      </section>

      {/* ── New Plan Modal ── */}
      {showModal && (
        <div className="sp-modal-overlay" onClick={closeModal}>
          <div className="sp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sp-modal-header">
              <h2 className="sp-modal-title">New Weekly Study Plan</h2>
              <button className="sp-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="sp-modal-body">
              <div className="sp-form-group">
                <label className="sp-form-label">Plan Name <span className="sp-required">*</span></label>
                <input
                  className={`sp-form-input ${errors.name ? "sp-input-error" : ""}`}
                  type="text"
                  placeholder="e.g. DBMS Revision"
                  value={form.name}
                  onChange={(e) => { setForm((f) => ({ ...f, name: e.target.value })); setErrors((er) => ({ ...er, name: undefined })); }}
                />
                {errors.name && <span className="sp-error-msg">{errors.name}</span>}
              </div>

              <div className="sp-form-group">
                <label className="sp-form-label">Subject <span className="sp-required">*</span></label>
                <input
                  className={`sp-form-input ${errors.subject ? "sp-input-error" : ""}`}
                  type="text"
                  placeholder="e.g. Database Systems"
                  value={form.subject}
                  onChange={(e) => { setForm((f) => ({ ...f, subject: e.target.value })); setErrors((er) => ({ ...er, subject: undefined })); }}
                />
                {errors.subject && <span className="sp-error-msg">{errors.subject}</span>}
              </div>

              <div className="sp-form-group">
                <label className="sp-form-label">Study Day <span className="sp-required">*</span></label>
                <select
                  className={`sp-form-input ${errors.day ? "sp-input-error" : ""}`}
                  value={form.day}
                  onChange={(e) => { setForm((f) => ({ ...f, day: e.target.value })); setErrors((er) => ({ ...er, day: undefined })); }}
                >
                  <option value="">Select a day</option>
                  {DAYS.map((d) => (
                    <option key={d} value={d}>{DAY_FULL[d]}</option>
                  ))}
                </select>
                {errors.day && <span className="sp-error-msg">{errors.day}</span>}
              </div>

              <div className="sp-form-group">
                <label className="sp-form-label">Estimated Study Time <span className="sp-required">*</span></label>
                <input
                  className={`sp-form-input ${errors.estTime ? "sp-input-error" : ""}`}
                  type="text"
                  placeholder="e.g. 1 hr"
                  value={form.estTime}
                  onChange={(e) => { setForm((f) => ({ ...f, estTime: e.target.value })); setErrors((er) => ({ ...er, estTime: undefined })); }}
                />
                {errors.estTime && <span className="sp-error-msg">{errors.estTime}</span>}
              </div>

              <div className="sp-form-group">
                <label className="sp-form-label">Notes <span className="sp-optional">(optional)</span></label>
                <textarea
                  className="sp-form-textarea"
                  rows={3}
                  placeholder="Add any extra details about this plan..."
                  value={form.notes}
                  onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                />
              </div>
            </div>

            <div className="sp-modal-footer">
              <button className="sp-modal-cancel" onClick={closeModal}>Cancel</button>
              <button className="sp-modal-submit" onClick={handleCreatePlan}>Create Plan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}