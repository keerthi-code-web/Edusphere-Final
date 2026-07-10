import { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentStudent } from "../services/authService";
import { createFeedback } from "../services/feedbackService";
import '../styles/CommandCenter.css';
import { getTasks } from "../services/taskService";
import { getStudyPlans } from "../services/studyPlanService";
import { getResources } from "../services/resourceService";
import { getProgress } from "../services/progressService";
import {
    getProfile,
    updateProfile,uploadProfilePhoto
} from "../services/profileService";


const DEFAULT_NAME = 'Student';
const BACKEND_URL = import.meta.env.VITE_API_URL.replace("/api", "");
const DEFAULT_SUBJECTS = [
  'Mathematics', 'Physics', 'Chemistry', 'Biology',
  'History', 'Geography', 'English', 'Computer Science',
  'Economics', 'Political Science', 'Psychology', 'Philosophy',
];
const DAILY_HOURS = ['Less than 1 hour', '1–2 hours', '2–4 hours', '4+ hours'];
const STUDY_DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DEFAULT_PROFILE = {
  displayName: DEFAULT_NAME,
  avatarUrl: null,
};

const MODULES = [
  { icon: '🚀', title: 'Mission Control', desc: 'Tasks, reminders & deadlines', route: '/mission-control', accent: 'mod-blue' },
  { icon: '🧠', title: 'Knowledge Vault', desc: 'Organise academic resources', route: '/knowledge-vault', accent: 'mod-purple' },
  { icon: '🗺️', title: 'StudyPath', desc: 'Personal weekly study planner', route: '/study-path', accent: 'mod-teal' },
  { icon: '⚡', title: 'RapidPrep', desc: 'Exam prep with past papers', route: '/rapid-prep', accent: 'mod-amber' },
  { icon: '📊', title: 'ProgressIQ', desc: 'Activity-based progress tracking', route: '/progress-iq', accent: 'mod-green' },
];



const STUDY_REMINDER = {
  icon: '📅',
  heading: "Today's Study Reminder",
  message: "Stay on track by completing your planned tasks consistently to achieve your academic goals.",
};

export default function CommandCenter() {
  const navigate = useNavigate();
  const location = useLocation();
  const [showUserMenu, setShowUserMenu] = useState(false);
  const [studentName, setStudentName] = useState(DEFAULT_NAME);
  const [profile, setProfile] = useState(DEFAULT_PROFILE);
  const [showSettings, setShowSettings] = useState(false);
  const [settingsForm, setSettingsForm] = useState(DEFAULT_PROFILE);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const fileInputRef = useRef(null);
  const [student, setStudent] = useState(null);
const [loadingStudent, setLoadingStudent] = useState(true);
  const [pendingTaskCount, setPendingTaskCount] = useState(0);
const [studyPlanCount, setStudyPlanCount] = useState(0);
const [resourceCount, setResourceCount] = useState(0);
const [overallProgress, setOverallProgress] = useState(0);
const [consistencyScore, setConsistencyScore] = useState(0);
const [productivityScore, setProductivityScore] = useState(0);
const [selectedProfileFile, setSelectedProfileFile] = useState(null);


  // Always begin this page from the top when navigated to from another page.
  const fetchPendingTaskCount = async () => {
  try {
    const response = await getTasks();

    const tasks = response.data.data;

    const completedTasks = tasks.filter(
      (task) => task.status === "Completed"
    ).length;

    const totalTasks = tasks.length;

    const consistencyScore =
      totalTasks === 0
        ? 0
        : Math.round((completedTasks / totalTasks) * 100);

    const pendingTasks = tasks.filter(
      (task) => task.status !== "Completed"
    );

    setPendingTaskCount(pendingTasks.length);

    // ✅ Move this inside try
    setConsistencyScore(consistencyScore);

  } catch (error) {
    console.error("Error fetching tasks:", error);
  }
};


 const fetchStudyPlanCount = async () => {
  try {
    const response = await getStudyPlans();

    const studyPlans = response.data.data;

    const completedPlans = studyPlans.filter(
      (plan) => plan.status === "Completed"
    ).length;

    const totalPlans = studyPlans.length;

    const productivityScore =
      totalPlans === 0
        ? 0
        : Math.round((completedPlans / totalPlans) * 100);

    setStudyPlanCount(studyPlans.length);

    // ✅ Move this inside try
    setProductivityScore(productivityScore);

  } catch (error) {
    console.error("Error fetching study plans:", error);
  }
};


const fetchResourceCount = async () => {
  try {
    const response = await getResources();

    const resources = response.data.data;

    setResourceCount(resources.length);

  } catch (error) {
    console.error("Error fetching resources:", error);
  }
};
  


 useEffect(() => {

    window.scrollTo(0, 0);

  loadStudent();
  
    fetchPendingTaskCount();

    fetchStudyPlanCount();

    fetchResourceCount();



}, []);

useEffect(() => {

    fetchPendingTaskCount();

    fetchStudyPlanCount();

    fetchResourceCount();

}, [location.pathname]);

useEffect(() => {
  console.log("Consistency:", consistencyScore);
  console.log("Productivity:", productivityScore);

  const overall = Math.round(
    (consistencyScore + productivityScore) / 2
  );

  console.log("Overall:", overall);

  setOverallProgress(overall);
}, [consistencyScore, productivityScore]);
  const handleLogout = () => {
    navigate('/login');
  };

  const openSettings = () => {
    setSettingsForm(profile);
    setShowUserMenu(false);
    setShowSettings(true);
  };

  const closeSettings = () => {
    setShowSettings(false);
  };

 const handleSettingsAvatarChange = (e) => {
    const file = e.target.files[0];

    if (file) {

        setSelectedProfileFile(file);

        const url = URL.createObjectURL(file);

        setSettingsForm((p) => ({
            ...p,
            avatarUrl: url
        }));

    }
};
  const toggleSettingsSubject = (s) => {
    setSettingsForm((p) => ({
      ...p,
      subjects: p.subjects.includes(s)
        ? p.subjects.filter((x) => x !== s)
        : [...p.subjects, s],
    }));
  };

  const toggleSettingsDay = (d) => {
    setSettingsForm((p) => ({
      ...p,
      studyDays: p.studyDays.includes(d)
        ? p.studyDays.filter((x) => x !== d)
        : [...p.studyDays, d],
    }));
  };

 const handleSaveSettings = async () => {

    try {

        let profilePhotoPath = profile.avatarUrl;

        // Upload new image if user selected one
        if (selectedProfileFile) {

            const formData = new FormData();

            formData.append(
                "profile_photo",
                selectedProfileFile
            );

            const uploadResponse =
                await uploadProfilePhoto(formData);

            profilePhotoPath =
                uploadResponse.data.profile_photo;

        }

        // Update profile details
        const updated = {

            display_name:
                settingsForm.displayName.trim() || DEFAULT_NAME,

            profile_photo:
                profilePhotoPath

        };

        await updateProfile(updated);

        const response =
            await getProfile();

        const student = response.data.user;

        setStudentName(
            student.display_name ||
            `${student.first_name} ${student.last_name}`
        );

        setProfile({

            ...profile,

            displayName:
                student.display_name ||
                `${student.first_name} ${student.last_name}`,

            avatarUrl:
                student.profile_photo

        });

        setSelectedProfileFile(null);

        setShowSettings(false);

    }

    catch (error) {

        console.error(
            "Profile Update Failed:",
            error
        );

    }

};
  // Feedback — frontend workflow only. Submitted feedback will later be
  // sent to the backend and surfaced inside the Admin Dashboard.
  const openFeedback = () => {
    setFeedbackMessage('');
    setShowFeedback(true);
  };

  const closeFeedback = () => {
    setShowFeedback(false);
  };

 const handleSubmitFeedback = async () => {

    if (!feedbackMessage.trim()) return;

    try {

        await createFeedback(feedbackMessage);

        alert("Feedback submitted successfully!");

        setShowFeedback(false);
        setFeedbackMessage("");

    } catch (error) {

        console.error(error);

        alert("Failed to submit feedback.");

    }

};

  const today = new Date().toLocaleDateString('en-IN', {
    weekday: 'long', day: 'numeric', month: 'long', year: 'numeric',
  });

 const loadStudent = async () => {

    try {

        const response = await getCurrentStudent();

        const user = response.data.user;
      console.log(response.data.user);

        setStudent(user);

        setProfile({

    displayName:
        user.display_name ||
        user.first_name ||
        DEFAULT_NAME,

    avatarUrl:
        user.profile_photo

});

        // Display the name from database
        setStudentName(
            user.display_name ||
            user.first_name ||
            DEFAULT_NAME
        );



    } catch (error) {

        console.error("Failed to load student:", error);

    } finally {

        setLoadingStudent(false);

    }

};

  return (
    <div className="command-center-page">
      {/* ── Navbar ── */}
      <nav className="top-navbar">
        <div className="navbar-left">
          <div className="navbar-logo-mark">E</div>
          <div className="navbar-branding">
            <h1 className="navbar-title">EduSphere</h1>
          </div>
        </div>

        <div className="navbar-right">
          <div className="navbar-user-wrap">
            <button
              className="navbar-user-btn"
              onClick={() => setShowUserMenu((v) => !v)}
              aria-label="User menu"
            >
              <div className="navbar-avatar">
                {profile.avatarUrl ? (
                  <img src={
    profile.avatarUrl
        ? `${BACKEND_URL}${profile.avatarUrl}`
        : ""
} alt={studentName} className="navbar-avatar-img" />
                ) : (
                  studentName[0]
                )}
              </div>
              <span className="navbar-user-name">{studentName}</span>
              <span className="navbar-chevron">▾</span>
            </button>
            {showUserMenu && (
              <div className="navbar-dropdown">
                <button className="dropdown-item" onClick={openSettings}>
                  ⚙️ Profile Settings
                </button>
                <div className="dropdown-divider" />
                <button className="dropdown-item dropdown-logout" onClick={handleLogout}>
                  🚪 Logout
                </button>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── Main Content ── */}
      <main className="main-content">

        {/* Welcome + Date */}
        {/* Display Name shown here is read from the student's profile and will
            automatically reflect the value set in Onboarding / Profile Settings
            once backend/database integration is complete. */}
        <section className="welcome-section">
          <div className="welcome-text">
            <p className="welcome-date">{today}</p>
            <h2 className="welcome-greeting">Welcome, {studentName}! 👋</h2>
            <p className="welcome-subtitle">
              Keep going, consistency is what gets you there.
            </p>
          </div>
          <button
            className="welcome-button"
            onClick={() => navigate('/study-path')}
          >
            Continue Learning →
          </button>
        </section>

        {/* Today's Reminder (replaces AI recommendations) */}
        <section className="reminder-section">
          <div className="reminder-icon">{STUDY_REMINDER.icon}</div>
          <div className="reminder-body">
            <h3 className="reminder-heading">{STUDY_REMINDER.heading}</h3>
            <p className="reminder-message">{STUDY_REMINDER.message}</p>
          </div>
          <button className="reminder-action" onClick={() => navigate('/mission-control')}>
            View Tasks →
          </button>
        </section>

        {/* Quick Stats */}
        <section className="quick-stats-section">
          <h2 className="section-heading">Quick Stats</h2>
          <div className="stats-cards-container">
            <div className="stat-card stat-accent-red">
              <div className="stat-icon">📋</div>
              <div className="stat-body">
                <span className="stat-value">{pendingTaskCount}</span>
                <span className="stat-label">Tasks Pending</span>
              </div>
            </div>
            <div className="stat-card stat-accent-blue">
              <div className="stat-icon">🗺️</div>
              <div className="stat-body">
                <span className="stat-value">{studyPlanCount}</span>
                <span className="stat-label">Study Plans</span>
              </div>
            </div>
            <div className="stat-card stat-accent-purple">
              <div className="stat-icon">🧠</div>
              <div className="stat-body">
                <span className="stat-value">{resourceCount}</span>
                <span className="stat-label">Resources</span>
              </div>
            </div>
            <div className="stat-card stat-accent-green">
              <div className="stat-icon">📊</div>
              <div className="stat-body">
                <span className="stat-value">{overallProgress}%</span>
                <span className="stat-label">Overall Progress</span>
              </div>
            </div>
          </div>
        </section>

        {/* Module Navigation */}
        <section className="modules-section">
          <h2 className="section-heading">Modules</h2>
          <div className="module-cards-grid">
            {MODULES.map((m) => (
              <button
                key={m.title}
                className={`module-card ${m.accent}`}
                onClick={() => navigate(m.route)}
              >
                <div className="module-icon">{m.icon}</div>
                <div className="module-info">
                  <span className="module-title">{m.title}</span>
                  <span className="module-desc">{m.desc}</span>
                </div>
                <span className="module-arrow">›</span>
              </button>
            ))}
          </div>
        </section>

        {/* Send Feedback — frontend workflow only; submissions will later appear in Admin Dashboard */}
        <section className="feedback-section">
          <h2 className="section-heading">Send Feedback</h2>
          <p className="feedback-section-sub">
            Have a suggestion or ran into an issue? Let us know.
          </p>
          <button className="feedback-open-btn" onClick={openFeedback}>
            ✉️ Send Feedback
          </button>
        </section>

      </main>

      {/* ── Settings Modal ── */}
      {showSettings && (
        <div className="cc-modal-overlay" onClick={closeSettings}>
          <div className="cc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cc-modal-header">
              <h2 className="cc-modal-title">Profile Settings</h2>
              <button className="cc-modal-close" onClick={closeSettings}>✕</button>
            </div>

            <div className="cc-modal-body">
              {/* Profile Photo */}
              <div className="cc-form-group">
                <label className="cc-form-label">Profile Photo</label>
                <div className="cc-avatar-upload-area">
                  <div
                    className="cc-avatar-preview"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {settingsForm.avatarUrl ? (
                      <img src={
    settingsForm.avatarUrl?.startsWith("blob:")
        ? settingsForm.avatarUrl
        : `http://localhost:5000${settingsForm.avatarUrl}`
} alt="Avatar" className="cc-avatar-img" />
                    ) : (
                      <span className="cc-avatar-placeholder">
                        {(settingsForm.displayName || DEFAULT_NAME)[0]}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    className="cc-avatar-change-btn"
                    onClick={() => fileInputRef.current.click()}
                  >
                    Change Photo
                  </button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="cc-avatar-input-hidden"
                    onChange={handleSettingsAvatarChange}
                  />
                </div>
              </div>

              {/* Display Name */}
              <div className="cc-form-group">
                <label className="cc-form-label">Display Name</label>
                <input
                  className="cc-form-input"
                  type="text"
                  placeholder="Your display name"
                  value={settingsForm.displayName}
                  onChange={(e) => setSettingsForm((p) => ({ ...p, displayName: e.target.value }))}
                />
              </div>

            </div>

            <div className="cc-modal-footer">
              <button className="cc-modal-cancel" onClick={closeSettings}>Cancel</button>
              <button className="cc-modal-submit" onClick={handleSaveSettings}>Save Changes</button>
            </div>
          </div>
        </div>
      )}

      {/* ── Feedback Modal ── */}
      {showFeedback && (
        <div className="cc-modal-overlay" onClick={closeFeedback}>
          <div className="cc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cc-modal-header">
              <h2 className="cc-modal-title">Send Feedback</h2>
              <button className="cc-modal-close" onClick={closeFeedback}>✕</button>
            </div>

            <div className="cc-modal-body">
              <div className="cc-form-group">
                <label className="cc-form-label">Message</label>
                <textarea
                  className="cc-form-textarea"
                  rows={5}
                  placeholder="Share your suggestion or issue..."
                  value={feedbackMessage}
                  onChange={(e) => setFeedbackMessage(e.target.value)}
                />
              </div>
            </div>

            <div className="cc-modal-footer">
              <button className="cc-modal-cancel" onClick={closeFeedback}>Cancel</button>
              <button
                className="cc-modal-submit"
                onClick={handleSubmitFeedback}
                disabled={!feedbackMessage.trim()}
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}