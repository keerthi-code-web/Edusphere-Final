import React, { useState, useMemo, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/RapidPrep.css";
import { getResources } from "../services/resourceService";
import { applyStoredTheme } from "../utils/theme";
import { getExams, createExam, updateExam } from "../services/examService";
/* ── Knowledge Vault resources (RapidPrep reads from the Vault — it never
   stores files itself). Mirrors the tagging used in Knowledge Vault. ── */
const VAULT_RESOURCES = [
  { id: 1, title: "DBMS Important Questions 2025", subject: "Database Systems", isImportantQuestion: true, isPYQ: false },
  { id: 2, title: "Machine Learning Key Concepts", subject: "Machine Learning", isImportantQuestion: true, isPYQ: false },
  { id: 3, title: "Software Engineering – Likely Questions", subject: "Software Engineering", isImportantQuestion: true, isPYQ: false },
  { id: 4, title: "OS Previous Year Paper – 2024", subject: "Operating Systems", isImportantQuestion: false, isPYQ: true },
  { id: 5, title: "DBMS Previous Year Paper – 2024", subject: "Database Systems", isImportantQuestion: false, isPYQ: true },
  { id: 6, title: "Linear Algebra Previous Year Paper", subject: "Mathematics III", isImportantQuestion: false, isPYQ: true },
  { id: 7, title: "ML Model Evaluation Cheatsheet", subject: "Machine Learning", isImportantQuestion: false, isPYQ: false },
  { id: 8, title: "Computer Networks Lecture Notes", subject: "Computer Networks", isImportantQuestion: false, isPYQ: false },
];

const SEED_EXAMS = [];

let nextExamId = 10;

function daysUntil(dateStr) {
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const d = new Date(dateStr); d.setHours(0, 0, 0, 0);
  return Math.round((d - today) / 86400000);
}

function formatExamDate(dateStr) {
  return new Date(dateStr).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" });
}

function SectionHeader({ title }) {
  return (
    <div className="rp-section-header">
      <h2 className="rp-section-title">{title}</h2>
      <div className="rp-section-line" />
    </div>
  );
}

function SummaryCard({ label, value, icon, accent }) {
  return (
    <div className={`rp-summary-card rp-accent-${accent}`}>
      <div className="rp-summary-icon">{icon}</div>
      <div className="rp-summary-value">{value}</div>
      <div className="rp-summary-label">{label}</div>
    </div>
  );
}

export default function RapidPrep() {
  const navigate = useNavigate();

  // Always open this module from the top of the page; restore saved theme
 useEffect(() => {
  window.scrollTo(0, 0);
  applyStoredTheme();

  loadExams();
  loadResources();

}, []);

  const [exams, setExams] = useState(SEED_EXAMS);
  const [showExamModal, setShowExamModal] = useState(false);
  const [examForm, setExamForm] = useState({ subject: "", date: "", venue: "" });
  const [examErrors, setExamErrors] = useState({});
  const [importantQuestions, setImportantQuestions] = useState([]);
const [previousPapers, setPreviousPapers] = useState([]);

  const loadExams = async () => {
  try {

    const response = await getExams();

    const formattedExams = response.data.data.map((exam) => ({
      id: exam.exam_id,
      subject: exam.subject,
      date: exam.exam_date,
      venue: exam.venue || ""
    }));

    setExams(formattedExams);

  } catch (error) {

    console.error("Failed to load exams", error);

  }
};
const loadResources = async () => {

    try {

        const response = await getResources();

        const resources = response.data.data;

        setImportantQuestions(
            resources.filter(
                r => r.resource_type === "Important Questions"
            )
        );

        setPreviousPapers(
            resources.filter(
                r => r.resource_type === "Previous Year Paper"
            )
        );

    } catch (error) {

        console.error("Failed to load resources", error);

    }

};


  

  const sortedExams = useMemo(
    () => [...exams].sort((a, b) => new Date(a.date) - new Date(b.date)),
    [exams]
  );

  const summaryCards = [
    { label: "Upcoming Exams", value: exams.length, icon: "📅", accent: "blue" },
    { label: "Important Questions", value: importantQuestions.length, icon: "❓", accent: "purple" },
    { label: "Previous Year Papers", value: previousPapers.length, icon: "📄", accent: "teal" },
  ];

  const validateExam = () => {
    const e = {};
    if (!examForm.subject.trim()) e.subject = "Subject is required.";
    if (!examForm.date) e.date = "Exam date is required.";
    return e;
  };

  const closeExamModal = () => {
    setShowExamModal(false);
    setExamForm({ subject: "", date: "", venue: "" });
    setExamErrors({});
  };

  const handleAddExam = async () => {

  const e = validateExam();

  if (Object.keys(e).length) {
    setExamErrors(e);
    return;
  }

  try {

    await createExam({
      subject: examForm.subject,
      exam_date: examForm.date
    });

    await loadExams();

    closeExamModal();

  } catch (error) {

    console.error(error);

  }

};

  return (
    <div className="rp-root">
      {/* ── Page Header ── */}
      <div className="rp-page-header">
        <div className="rp-header-text">
          <button className="rp-back-btn" onClick={() => navigate('/command-center')}>← Back to Dashboard</button>
          <h1 className="rp-page-title">
            <span className="rp-title-icon">⚡</span> RapidPrep
          </h1>
          <p className="rp-page-subtitle">
            Exam-time prep, powered by your Knowledge Vault resources.
          </p>
        </div>
        <div className="rp-header-badge">Exam Season Active</div>
      </div>

      {/* ── Summary Cards ── */}
      <div className="rp-summary-grid">
        {summaryCards.map((card) => (
          <SummaryCard key={card.label} {...card} />
        ))}
      </div>

      {/* ── Upcoming Exams ── */}
      <section className="rp-section">
        <div className="rp-section-header">
          <h2 className="rp-section-title">Upcoming Exams</h2>
          <div className="rp-section-line" />
          <button className="rp-btn-primary rp-btn-sm" onClick={() => setShowExamModal(true)}>
            + Add Exam
          </button>
        </div>

        {sortedExams.length === 0 ? (
          <p className="rp-empty-text">No exams added yet. Add your exam timetable to get started.</p>
        ) : (
          <div className="rp-exam-list">
            {sortedExams.map((ex) => {
              const d = daysUntil(ex.date);
              const urgent = d <= 3 && d >= 0;
              return (
                <div className="rp-exam-item" key={ex.id}>
                  <div className="rp-exam-date-badge">
                    <span className="rp-exam-day">{new Date(ex.date).getDate()}</span>
                    <span className="rp-exam-mon">
                      {new Date(ex.date).toLocaleDateString("en-IN", { month: "short" })}
                    </span>
                  </div>
                  <div className="rp-exam-info">
                    <p className="rp-exam-subject">{ex.subject}</p>
                    <span className="rp-exam-meta">
                      {formatExamDate(ex.date)}{ex.venue ? ` · ${ex.venue}` : ""}
                    </span>
                  </div>
                  <span className={`rp-badge ${urgent ? "rp-badge-high" : "rp-badge-low"}`}>
                    {d < 0 ? "Past" : d === 0 ? "Today" : `${d} day${d > 1 ? "s" : ""} left`}
                  </span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* ── Important Questions ── */}
      <section className="rp-section">
        <SectionHeader title="Important Questions" />
        {importantQuestions.length === 0 ? (
          <p className="rp-empty-text">No resources marked as Important Question in Knowledge Vault yet.</p>
        ) : (
          <div className="rp-card-grid">
            {importantQuestions.map((r) => (
              <div className="rp-card" key={r.id}>
                <div className="rp-card-top">
                  <div className="rp-card-icon-wrap rp-icon-blue">❓</div>
                  <span className="rp-badge rp-badge-year">IQ</span>
                </div>
                <h3 className="rp-card-title">{r.title}</h3>
                <p className="rp-card-meta">{r.subject}</p>
                <button
    className="rp-btn-primary"
    onClick={() => window.open(r.file_path, "_blank")}
>
    View →
</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Previous Year Papers ── */}
      <section className="rp-section">
        <SectionHeader title="Previous Year Papers" />
        {previousPapers.length === 0 ? (
          <p className="rp-empty-text">No resources marked as Previous Year Paper in Knowledge Vault yet.</p>
        ) : (
          <div className="rp-card-grid">
            {previousPapers.map((r) => (
              <div className="rp-card" key={r.id}>
                <div className="rp-card-top">
                  <div className="rp-card-icon-wrap rp-icon-purple">📄</div>
                  <span className="rp-badge rp-badge-updated">PYQ</span>
                </div>
                <h3 className="rp-card-title">{r.title}</h3>
                <p className="rp-card-meta">{r.subject}</p>
                <button
    className="rp-btn-primary"
    onClick={() => window.open(r.file_path, "_blank")}
>
    View →
</button>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Motivational Quote ── */}
      <section className="rp-panel rp-panel-tip">
        <div className="rp-panel-eyebrow">💡 Exam Success Tip</div>
        <blockquote className="rp-quote">
          "Preparation today creates confidence tomorrow."
        </blockquote>
      </section>

      {/* ── Add Exam Modal ── */}
      {showExamModal && (
        <div className="rp-modal-overlay" onClick={closeExamModal}>
          <div className="rp-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rp-modal-header">
              <h2 className="rp-modal-title">Add Exam</h2>
              <button className="rp-modal-close" onClick={closeExamModal}>✕</button>
            </div>

            <div className="rp-modal-body">
              <div className="rp-form-group">
                <label className="rp-form-label">Subject <span className="rp-required">*</span></label>
                <input
                  className={`rp-form-input ${examErrors.subject ? "rp-input-error" : ""}`}
                  type="text"
                  placeholder="e.g. Database Systems"
                  value={examForm.subject}
                  onChange={(e) => { setExamForm((p) => ({ ...p, subject: e.target.value })); setExamErrors((er) => ({ ...er, subject: undefined })); }}
                />
                {examErrors.subject && <span className="rp-error-msg">{examErrors.subject}</span>}
              </div>

              <div className="rp-form-group">
                <label className="rp-form-label">Exam Date <span className="rp-required">*</span></label>
                <input
                  className={`rp-form-input ${examErrors.date ? "rp-input-error" : ""}`}
                  type="date"
                  value={examForm.date}
                  onChange={(e) => { setExamForm((p) => ({ ...p, date: e.target.value })); setExamErrors((er) => ({ ...er, date: undefined })); }}
                />
                {examErrors.date && <span className="rp-error-msg">{examErrors.date}</span>}
              </div>

              <div className="rp-form-group">
                <label className="rp-form-label">Venue <span className="rp-optional">(optional)</span></label>
                <input
                  className="rp-form-input"
                  type="text"
                  placeholder="e.g. Hall A"
                  value={examForm.venue}
                  onChange={(e) => setExamForm((p) => ({ ...p, venue: e.target.value }))}
                />
              </div>
            </div>

            <div className="rp-modal-footer">
              <button className="rp-modal-cancel" onClick={closeExamModal}>Cancel</button>
              <button className="rp-modal-submit" onClick={handleAddExam}>Add Exam</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}