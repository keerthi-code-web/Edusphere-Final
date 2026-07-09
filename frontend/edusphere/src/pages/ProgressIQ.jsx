import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/ProgressIQ.css";
import {
    createProgress,
    getProgress,
    updateProgress,
    deleteProgress
} from "../services/progressService";
import { getTasks } from "../services/taskService";
import { getStudyPlans } from "../services/studyPlanService";

// ── Data (derived from student activity across EduSphere modules) ────────────
// ProgressIQ measures EduSphere activity only — there is no AI involved and
// no academic marks/grades are used. All scores are calculated purely from
// platform activity:
//  • Mission Control task completion → Consistency Score
//  • StudyPath plan completion       → Productivity Score
//  • Average of the two above        → Overall Score





// Demo weekly activity data (derived from combined module activity)

// ── Sub-components ────────────────────────────────────────────────────────────

function SectionHeader({ title }) {
  return (
    <div className="piq-sec-hdr">
      <h2 className="piq-sec-title">{title}</h2>
      <div className="piq-sec-line" />
    </div>
  );
}

function ScoreCard({ label, value, icon, accent }) {
  return (
    <div className={`piq-score-card piq-accent-${accent}`}>
      <div className="piq-score-top">
        <span className="piq-score-icon">{icon}</span>
        <span className="piq-score-value">{value}%</span>
      </div>
      <div className="piq-score-label">{label}</div>
    </div>
  );
}

function PerformanceItem({ label, value, color, explanation }) {
  return (
    <div className="piq-bar-row">
      <div className="piq-bar-label-row">
        <span className="piq-bar-label">{label}</span>
        <span className="piq-bar-pct">{value}%</span>
      </div>
      <div className="piq-bar-bg">
        <div
          className={`piq-bar-fill piq-fill-${color}`}
          style={{ width: `${value}%` }}
        />
      </div>
      <p className="piq-bar-explain">{explanation}</p>
    </div>
  );
}

function StrengthCard({ text }) {
  return (
    <div className="piq-strength-card">
      <span className="piq-strength-icon">✔</span>
      <span className="piq-strength-text">{text}</span>
    </div>
  );
}

function WeaknessCard({ text }) {
  return (
    <div className="piq-weakness-card">
      <span className="piq-weakness-dot">•</span>
      <span className="piq-weakness-text">{text}</span>
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────────────────────

export default function ProgressIQ() {
  const navigate = useNavigate();
  const [progressHistory, setProgressHistory] = useState([]);
  const [tasks, setTasks] = useState([]);
const [plans, setPlans] = useState([]);
 

  const loadProgress = async () => {

  try {
    console.log("TOKEN:", localStorage.getItem("token"));
    const progressResponse = await getProgress();
    setProgressHistory(progressResponse.data.data);

    const taskResponse = await getTasks();
    setTasks(taskResponse.data.data);

    const planResponse = await getStudyPlans();
    setPlans(planResponse.data.data);

  } catch (error) {

    console.error("Failed to load ProgressIQ data", error);

  }

};

useEffect(() => {

  window.scrollTo(0, 0);

  loadProgress();

}, []);
// ===== LIVE SCORE CALCULATIONS =====

// Mission Control
const totalTasks = tasks.length;

const completedTasks = tasks.filter(
    (task) => task.status === "Completed"
).length;

const consistencyScore =
    totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);


// StudyPath
const totalPlans = plans.length;

const completedPlans = plans.filter(
    (plan) => plan.status === "Completed"
).length;

const productivityScore =
    totalPlans === 0
        ? 0
        : Math.round((completedPlans / totalPlans) * 100);


// Overall
const overallScore =
    Math.round(
        (consistencyScore + productivityScore) / 2
    );
const scoreCards = [
  {
    label: "Consistency Score",
    value: consistencyScore,
    icon: "📆",
    accent: "purple",
  },
  {
    label: "Productivity Score",
    value: productivityScore,
    icon: "⚡",
    accent: "teal",
  },
  {
    label: "Overall Score",
    value: overallScore,
    icon: "📊",
    accent: "orange",
  },
];

function explainScore(label, value) {

  const high = value >= 85;
  const mid = value >= 70 && value < 85;

  switch (label) {

    case "Consistency Score":

      if (high)
        return "Calculated using completed tasks in Mission Control.";

      if (mid)
        return "Some Mission Control tasks are still pending.";

      return "Complete more Mission Control tasks.";

    case "Productivity Score":

      if (high)
        return "Calculated using completed Study Plans.";

      if (mid)
        return "Some Study Plans are still active.";

      return "Complete more Study Plans.";

    case "Overall Score":

      return "Average of Consistency and Productivity.";

    default:
      return "";

  }

}

const performanceBreakdown = scoreCards.map((c) => ({
  label: c.label,
  value: c.value,
  color: c.accent,
  explanation: explainScore(c.label, c.value),
}));

const strengths = [];

if (consistencyScore >= 85)
  strengths.push("Excellent Mission Control consistency.");

if (productivityScore >= 85)
  strengths.push("Excellent Study Plan completion.");

if (strengths.length === 0)
  strengths.push("Keep using EduSphere regularly.");

const improvements = [];

if (consistencyScore < 85)
    improvements.push("Complete more Mission Control tasks.");

if (productivityScore < 85)
    improvements.push("Finish more active Study Plans.");

const hasImprovements = improvements.length > 0;

  
return (
    <div className="piq-root">

      {/* ── Page Header ── */}
<header className="piq-header">
      <div className="piq-page-header">
        <button className="piq-back-btn" onClick={() => navigate("/command-center")}>
        ← Back to Dashboard
      </button>
        <h1 className="piq-page-title">
          <span className="piq-title-icon">📊</span> ProgressIQ
        </h1>
        <p className="piq-page-subtitle">
          Track your activity-based consistency and productivity across EduSphere.
        </p>
      </div>
</header>
      {/* ── Score Cards ── */}
      <div className="piq-score-grid">
        {scoreCards.map((c) => (
          <ScoreCard key={c.label} {...c} />
        ))}
      </div>

      {/* ── Performance Breakdown ── */}
      <section className="piq-section">
        <div className="piq-card">
          <h2 className="piq-card-title">Performance Breakdown</h2>
          <div className="piq-bars-list">
            {performanceBreakdown.map((b) => (
              <PerformanceItem key={b.label} {...b} />
            ))}
          </div>
        </div>
      </section>

      {/* ── Strengths & Weaknesses ── */}
      <section className="piq-section">
        <div className="piq-sw-row">

          <div className="piq-card piq-card-sw">
            <SectionHeader title="Strengths" />
            <div className="piq-sw-list">
              {strengths.map((s) => (
                <StrengthCard key={s} text={s} />
              ))}
            </div>
          </div>

          <div className="piq-card piq-card-sw">
           <SectionHeader
    title={hasImprovements ? "Needs Improvement" : "Keep It Up"}
/>
            <div className="piq-sw-list">

    {hasImprovements ? (

        improvements.map((w) => (
            <WeaknessCard
                key={w}
                text={w}
            />
        ))

    ) : (

        <StrengthCard
            text="Great work! Keep maintaining your progress."
        />

    )}

</div>
          </div>

        </div>
      </section>

      {/* ── Motivational Quote ── */}
      <section className="piq-section piq-section--last">
        <div className="piq-card piq-card-grow">
          <div className="piq-grow-eyebrow">🌱 Keep Growing</div>
          <blockquote className="piq-grow-quote">
            "Progress is achieved one consistent step at a time."
          </blockquote>
        </div>
      </section>

    </div>
  );
}