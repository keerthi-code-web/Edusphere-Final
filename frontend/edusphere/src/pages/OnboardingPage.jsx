import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { completeOnboarding } from "../services/onboardingService";
import "../styles/OnboardingPage.css";
import { uploadProfilePhoto } from "../services/profileService";


/*
 * NOTE (future backend/database integration):
 * The values collected on this page — Display Name, Profile Photo, and
 * Main Goal — are currently held only in local component state and are
 * not persisted anywhere permanent. Once backend and database integration
 * is complete, these same fields should be saved to the student's profile
 * record and then loaded/reused throughout the rest of the platform
 * (Command Center welcome section, navbar avatar, StudyPath, Profile
 * Settings, etc.) instead of relying on local state. No frontend redesign
 * is required for this — only the data source for these fields needs to
 * change from local state to the backend/database.
 */

const STEPS = [
  { id: 1, label: "Profile" },
  { id: 2, label: "Goals" },
];

const GOAL_OPTIONS = [
  { id: "placements", label: "Crack Placements", icon: "💼" },
  { id: "cgpa", label: "Score Higher CGPA", icon: "🎓" },
  { id: "skills", label: "Learn New Skills", icon: "🌱" },
  { id: "consistency", label: "Stay Consistent", icon: "🔥" },
];

const OnboardingPage = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef();

  const [step, setStep] = useState(1);
  // Display Name and Profile Photo (avatarUrl) — will be persisted to
  // the backend/database and reused across the platform once integrated.
  const [profileData, setProfileData] = useState({
    displayName: "",
    avatarUrl: null,
  });
  const [selectedGoal, setSelectedGoal] = useState("");
  const [errors, setErrors] = useState({});

  // Always begin this page from the top when navigated to from another page.
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  /* ------- navigation ------- */
  const validateStep = () => {
    const e = {};
    if (step === 1 && !profileData.displayName.trim()) {
      e.displayName = "Display name is required.";
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleContinue = () => {
    if (!validateStep()) return;
    if (step < STEPS.length) {
      setStep((s) => s + 1);
    } else {
      goToCommandCenter();
    }
  };

 

  const handleBack = () => setStep((s) => s - 1);

  /* ------- persistence -------
     Stores the collected profile data (Display Name, Profile Photo) to
     localStorage under the same key Command Center reads from, so the
     Display Name (and other fields) are available there. Frontend/
     local-storage persistence only — no backend integration yet. */
  const persistProfile = () => {
    try {
      const existingRaw = localStorage.getItem('edusphere_profile');
      const existing = existingRaw ? JSON.parse(existingRaw) : {};
      const updated = {
        ...existing,
        ...(profileData.displayName.trim() ? { displayName: profileData.displayName.trim() } : {}),
        ...(profileData.avatarUrl ? { avatarUrl: profileData.avatarUrl } : {}),
      };
      localStorage.setItem('edusphere_profile', JSON.stringify(updated));
    } catch (e) {
      // localStorage unavailable — Display Name will fall back to default in Command Center
    }
  };

  const goToCommandCenter = async () => {

    try {

        persistProfile();

        const user = JSON.parse(localStorage.getItem("user"));

        await completeOnboarding({

            studentId: user.student_id,

            display_name: profileData.displayName,

            profile_photo: profileData.avatarUrl,

            main_goal: selectedGoal

        });

        navigate("/command-center");

    } catch (error) {

        console.error(error);

        alert("Unable to complete onboarding.");

    }

};

  /* ------- avatar ------- */
const handleAvatarChange = async (e) => {

    const file = e.target.files[0];

    if (!file) return;

    // Instant Preview
    const previewUrl = URL.createObjectURL(file);
    console.log("Preview URL:", previewUrl);

    setProfileData((p) => ({
        ...p,
        avatarUrl: previewUrl
    }));
    console.log("Avatar state updated");

    try {

        const formData = new FormData();

        formData.append("profile_photo", file);

        const response = await uploadProfilePhoto(formData);

        // Replace preview with permanent server image
        setProfileData((p) => ({
            ...p,
            avatarUrl: response.data.profile_photo
        }));

    } catch (error) {

        console.error("Profile photo upload failed:", error);

        alert("Unable to upload profile photo.");

    }

};
 const progressPct = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="ob-root">
      {/* Header */}
      <div className="ob-header">
        <div className="ob-header-inner">
          <button className="ob-logo" onClick={() => navigate("/")}>
            <span className="logo-mark">E</span>
            <span className="logo-text">EduSphere</span>
          </button>
          
        </div>
      </div>

      <div className="ob-body">
        {/* Progress Panel */}
        <div className="ob-progress-panel">
          <div className="ob-progress-title">Setup Progress</div>

          {/* Linear bar */}
          <div className="ob-bar-track">
            <div className="ob-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="ob-bar-label">{step} of {STEPS.length} steps</div>

          {/* Step pills */}
          <div className="ob-steps-list">
            {STEPS.map((s) => (
              <div
                key={s.id}
                className={`ob-step-item ${
                  s.id < step
                    ? "step-done"
                    : s.id === step
                    ? "step-active"
                    : "step-pending"
                }`}
              >
                <div className="step-bubble">
                  {s.id < step ? "✓" : s.id}
                </div>
                <span className="step-label">{s.label}</span>
              </div>
            ))}
          </div>

          <div className="ob-tip-box">
            <span className="ob-tip-icon">💡</span>
            <p className="ob-tip-text">
              You can update all your settings later from Command Center.
            </p>
          </div>
        </div>

        {/* Step Content */}
        <div className="ob-content">
          <div className="ob-card">
            {/* Step 1: Profile */}
            {step === 1 && (
              <div className="ob-step-body">
                <div className="ob-step-header">
                  <span className="ob-step-eyebrow">Step 1 of 2</span>
                  <h2 className="ob-step-title">Personal Profile</h2>
                  <p className="ob-step-sub">
                    Your display name will appear throughout the platform.
                    Add a photo to personalise your dashboard.
                  </p>
                </div>

                {/* Avatar Upload */}
                {console.log(profileData.avatarUrl)}
                <div className="avatar-upload-area">
                  <div
                    className="avatar-preview"
                    onClick={() => fileInputRef.current.click()}
                  >
                    {profileData.avatarUrl ? (
                      <img
    src={
        profileData.avatarUrl?.startsWith("blob:")
            ? profileData.avatarUrl
            : `${import.meta.env.VITE_API_URL}${profileData.avatarUrl}`
    }
    alt="Avatar"
    className="avatar-img"
/>
                    ) : (
                      <div className="avatar-placeholder">
                        <span className="avatar-placeholder-icon">📷</span>
                        <span className="avatar-placeholder-text">Upload Photo</span>
                      </div>
                    )}
                    <div className="avatar-overlay">
                      <span>Change</span>
                    </div>
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    ref={fileInputRef}
                    style={{ display: "none" }}
                    onChange={handleAvatarChange}
                  />
                  <p className="avatar-hint">JPG, PNG or GIF · Max 5 MB</p>
                </div>

                {/* Display Name */}
                <div className="form-group">
                  <label className="form-label">Display Name <span className="required-star">*</span></label>
                  <input
                    className={`form-input ${errors.displayName ? "input-error" : ""}`}
                    type="text"
                    placeholder="How should we call you?"
                    value={profileData.displayName}
                    onChange={(e) => {
                      setProfileData((p) => ({ ...p, displayName: e.target.value }));
                      if (errors.displayName) setErrors((er) => ({ ...er, displayName: undefined }));
                    }}
                  />
                  {errors.displayName && (
                    <span className="error-msg">{errors.displayName}</span>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Goals */}
            {step === 2 && (
              <div className="ob-step-body">
                <div className="ob-step-header">
                  <span className="ob-step-eyebrow">Step 2 of 2</span>
                  <h2 className="ob-step-title">Main Goal</h2>
                  <p className="ob-step-sub">
                    This helps us tailor your StudyPath and recommended resources.
                  </p>
                </div>

                <div className="goal-grid">
                  {GOAL_OPTIONS.map((g) => (
                    <button
                      key={g.id}
                      type="button"
                      className={`goal-card ${selectedGoal === g.id ? "goal-active" : ""}`}
                      onClick={() => setSelectedGoal(g.id)}
                    >
                      <span className="goal-icon">{g.icon}</span>
                      <span className="goal-label">{g.label}</span>
                      {selectedGoal === g.id && (
                        <span className="goal-check">✓</span>
                      )}
                    </button>
                  ))}
                </div>

                <div className="ob-summary-box">
                  <div className="summary-icon">🎉</div>
                  <div>
                    <div className="summary-title">Almost there!</div>
                    <p className="summary-text">
                      Click <strong>Finish Setup</strong> to open your
                      EduSphere dashboard and start your academic journey.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action buttons */}
            <div className="ob-actions">
              <div className="ob-actions-left">
                {step > 1 && (
                  <button className="btn-back" onClick={handleBack}>
                    ← Back
                  </button>
                )}
              </div>
              <div className="ob-actions-right">
        
                <button className="btn-continue" onClick={handleContinue}>
                  {step === STEPS.length ? "Finish Setup" : "Continue →"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;