import React, { useState, useEffect } from "react";
import "../styles/KnowledgeVault.css";
import { applyStoredTheme } from "../utils/theme";
import { useNavigate } from "react-router-dom";
import {
    createResource,
    getResources
} from "../services/resourceService";


/* ── Resource categories (fixed set) ── */
const RESOURCE_CATEGORIES = ["Notes", "Important Questions", "Previous Year Paper"];

/* ── Seed resources — grouped automatically by Subject, no folders ── */
const INITIAL_RESOURCES = [
  {
    id: 1,
    resourceName: "Database Management Notes",
    subject: "Database Systems",
    semester: "Semester 5",
    resourceType: "Notes",
    fileLink: "",
    uploaded: "2 days ago",
  },
  {
    id: 2,
    resourceName: "DBMS Important Questions 2025",
    subject: "Database Systems",
    semester: "Semester 5",
    resourceType: "Important Questions",
    fileLink: "",
    uploaded: "1 week ago",
  },
  {
    id: 3,
    resourceName: "OS Previous Year Paper – 2024",
    subject: "Operating Systems",
    semester: "Semester 5",
    resourceType: "Previous Year Paper",
    fileLink: "",
    uploaded: "Yesterday",
  },
  {
    id: 4,
    resourceName: "Machine Learning Fundamentals",
    subject: "Machine Learning",
    semester: "Semester 5",
    resourceType: "Notes",
    fileLink: "",
    uploaded: "Today",
  },
  {
    id: 5,
    resourceName: "ML Model Evaluation Cheatsheet",
    subject: "Machine Learning",
    semester: "Semester 5",
    resourceType: "Notes",
    fileLink: "",
    uploaded: "5 days ago",
  },
  {
    id: 6,
    resourceName: "Computer Networks Lecture Notes",
    subject: "Computer Networks",
    semester: "Semester 4",
    resourceType: "Notes",
    fileLink: "",
    uploaded: "3 days ago",
  },
  {
    id: 7,
    resourceName: "Linear Algebra Previous Year Paper",
    subject: "Mathematics III",
    semester: "Semester 4",
    resourceType: "Previous Year Paper",
    fileLink: "",
    uploaded: "1 week ago",
  },
];

const filters = ["All", ...RESOURCE_CATEGORIES];

const typeIcon = (type) => {
  if (type === "Notes") return "📝";
  if (type === "Important Questions") return "❓";
  if (type === "Previous Year Paper") return "🗞️";
  return "📎";
};

const typeBadgeClass = (type) => {
  if (type === "Notes") return "badge-notes";
  if (type === "Important Questions") return "badge-pdf";
  if (type === "Previous Year Paper") return "badge-video";
  return "badge-other";
};

const emptyUploadForm = {
  resourceName: "",
  subject: "",
  semester: "",
  resourceType: RESOURCE_CATEGORIES[0],
  fileLink: "",
};

export default function KnowledgeVault() {
  const navigate = useNavigate();

  const [resources, setResources] = useState(INITIAL_RESOURCES);

  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const [showUploadModal, setShowUploadModal] = useState(false);
  const [uploadForm, setUploadForm] = useState(emptyUploadForm);
  const [uploadErrors, setUploadErrors] = useState({});

  useEffect(() => {

    window.scrollTo(0,0);

    applyStoredTheme();

    loadResources();

}, []);

  /* ── Summary metrics ── */
  const totalResources = resources.length;
  const importantQuestionCount = resources.filter((r) => r.resourceType === "Important Questions").length;
  const pyqCount = resources.filter((r) => r.resourceType === "Previous Year Paper").length;
  const subjectsCount = new Set(resources.map((r) => r.subject)).size;

  /* ── Filtering ── */
  const filtered = resources.filter((r) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      r.resourceName.toLowerCase().includes(q) || r.subject.toLowerCase().includes(q);
    const matchFilter = activeFilter === "All" || r.resourceType === activeFilter;
    return matchSearch && matchFilter;
  });

  /* ── Group resources by Subject (replaces folders) ── */
  const subjects = [...new Set(resources.map((r) => r.subject))];

  /* ── Upload flow ── */
  const validateUpload = () => {
    const e = {};
    if (!uploadForm.resourceName.trim()) e.resourceName = "Resource name is required.";
    if (!uploadForm.subject.trim()) e.subject = "Subject is required.";
    if (!uploadForm.semester.trim()) e.semester = "Semester is required.";
    if (!uploadForm.fileLink.trim()) e.fileLink = "Resource link is required.";
    return e;
  };

  const handleUploadSubmit = async () => {

    const e = validateUpload();

    if (Object.keys(e).length) {

        setUploadErrors(e);

        return;

    }

    try {

        await createResource({

            resource_name: uploadForm.resourceName,

            subject: uploadForm.subject,

            semester: Number(uploadForm.semester),

            resource_type: uploadForm.resourceType,

            file_path: uploadForm.fileLink

        });

        await loadResources();

closeUploadModal();

alert("Resource Uploaded Successfully!");

    } catch (error) {

        console.error("Upload Failed", error);

    }

};

  const closeUploadModal = () => {
    setShowUploadModal(false);
    setUploadForm(emptyUploadForm);
    setUploadErrors({});
  };

  const loadResources = async () => {

    try {

        const response = await getResources();

        const formattedResources = response.data.data.map((resource) => ({

            id: resource.resource_id,

            resourceName: resource.resource_name,

            subject: resource.subject,

            semester: resource.semester,

            resourceType: resource.resource_type,

            fileLink: resource.file_path,

            uploaded: resource.uploaded_at

        }));

        setResources(formattedResources);

    }
    catch (error) {

        console.error("Failed to load resources", error);

    }

};

  const renderResourceCard = (res) => (
    <div key={res.id} className="kv-resource-card">
      <div className="kv-resource-top">
        <div className="kv-resource-file-icon">{typeIcon(res.resourceType)}</div>
      </div>
      <div className="kv-resource-body">
        <h3 className="kv-resource-title">{res.resourceName}</h3>
        <div className="kv-resource-meta">
          <span className={`kv-badge ${typeBadgeClass(res.resourceType)}`}>
            {res.resourceType}
          </span>
          <span className="kv-resource-subject">📚 {res.subject}</span>
        </div>
        <p className="kv-resource-uploaded">Uploaded: {res.uploaded}</p>
      </div>
      <div className="kv-resource-footer">

    <button
        className="kv-view-btn"
        onClick={() => window.open(res.fileLink, "_blank")}
    >
        View
    </button>

    <button
        className="kv-download-btn"
        title="Download"
        onClick={() => window.open(res.fileLink, "_blank")}
    >
        ⬇
    </button>

</div>
    </div>
  );

  return (
    <div className="kv-root" >
      {/* ── Header ── */}
      <header className="kv-header">
        <div className="kv-header-text">
           <button id="kv-backbtn" className="kv-back-btn" onClick={() => navigate('/command-center')}>← Back to Dashboard</button>
          <h1 className="kv-title">
            <span className="kv-title-icon">🏛️</span>
            Knowledge Vault
          </h1>
          <p className="kv-subtitle">
            Organize, manage, and access your academic resources.
          </p>
        </div>
      </header>

      {/* ── Summary Cards ── */}
      <section className="kv-summary-grid">
        <div className="kv-summary-card accent-blue">
          <div className="kv-summary-icon">🗂️</div>
          <div className="kv-summary-body">
            <span className="kv-summary-value">{totalResources}</span>
            <span className="kv-summary-label">Total Resources</span>
          </div>
        </div>
        <div className="kv-summary-card accent-amber">
          <div className="kv-summary-icon">❓</div>
          <div className="kv-summary-body">
            <span className="kv-summary-value">{importantQuestionCount}</span>
            <span className="kv-summary-label">Important Questions</span>
          </div>
        </div>
        <div className="kv-summary-card accent-red">
          <div className="kv-summary-icon">🗞️</div>
          <div className="kv-summary-body">
            <span className="kv-summary-value">{pyqCount}</span>
            <span className="kv-summary-label">Previous Year Papers</span>
          </div>
        </div>
        <div className="kv-summary-card accent-green">
          <div className="kv-summary-icon">📚</div>
          <div className="kv-summary-body">
            <span className="kv-summary-value">{subjectsCount}</span>
            <span className="kv-summary-label">Subjects</span>
          </div>
        </div>
      </section>

      {/* ── Toolbar ── */}
      <section className="kv-toolbar">
        <div className="kv-search-wrap">
          <span className="kv-search-icon">🔍</span>
          <input
            className="kv-search"
            type="text"
            placeholder="Search by subject or resource name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          {searchQuery && (
            <button className="kv-search-clear" onClick={() => setSearchQuery("")}>
              ✕
            </button>
          )}
        </div>
        <div className="kv-filters">
          {filters.map((f) => (
            <button
              key={f}
              className={`kv-filter-btn ${activeFilter === f ? "kv-filter-active" : ""}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="kv-upload-btn" onClick={() => setShowUploadModal(true)}>
          <span>⬆</span> Upload Resource
        </button>
      </section>

      {/* ── Resources ── */}
      <section className="kv-section">
        <div className="kv-section-header">
          <h2 className="kv-section-title">Resources</h2>
          <div className="kv-section-header-actions">
            <span className="kv-result-count">{filtered.length} found</span>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="kv-empty">
            <div className="kv-empty-icon">📭</div>
            <p className="kv-empty-text">No resources match your search.</p>
            <button
              className="kv-empty-reset"
              onClick={() => {
                setSearchQuery("");
                setActiveFilter("All");
              }}
            >
              Clear filters
            </button>
          </div>
        ) : (
          <div className="kv-resource-grid">
            {filtered.map((res) => renderResourceCard(res))}
          </div>
        )}
      </section>

      {/* ── Resources by Subject (replaces Subject Folders) ── */}
      <section className="kv-section">
        <div className="kv-section-header">
          <h2 className="kv-section-title">Resources by Subject</h2>
        </div>

        {subjects.map((subject) => (
          <div key={subject} className="kv-semester-block">
          <div className="kv-subject-divider">
    <span className="kv-divider-line"></span>

    <p className="kv-semester-label">
        {subject}
    </p>

    <span className="kv-divider-line"></span>
</div>
            <div className="kv-resource-grid">
              {resources
                .filter((r) => r.subject === subject)
                .map((res) => renderResourceCard(res))}
            </div>
          </div>
        ))}
      </section>

      {/* ── Guide Card ── */}
      <section className="kv-section">
        <div className="kv-panel kv-tip-panel">
          <div className="kv-tip-icon">💡</div>
          <h3 className="kv-tip-title">Stay Organized</h3>
          <p className="kv-tip-body">
            Resources are automatically grouped by subject as you upload them —
            no need to create folders. Just fill in the subject and semester
            when uploading, and everything stays organized on its own.
          </p>
        </div>
      </section>

      {/* ── Upload Modal ── */}
      {showUploadModal && (
        <div className="kv-modal-overlay" onClick={closeUploadModal}>
          <div className="kv-modal" onClick={(e) => e.stopPropagation()}>
            <div className="kv-modal-header">
              <h2 className="kv-modal-title">Upload Resource</h2>
              <button className="kv-modal-close" onClick={closeUploadModal}>✕</button>
            </div>

            <div className="kv-modal-body">
              <div className="kv-form-group">
                <label className="kv-form-label">
                  Resource Name <span className="kv-required">*</span>
                </label>
                <input
                  className={`kv-form-input ${uploadErrors.resourceName ? "kv-input-error" : ""}`}
                  type="text"
                  placeholder="e.g. DBMS Unit 3 Notes"
                  value={uploadForm.resourceName}
                  onChange={(e) => {
                    setUploadForm((p) => ({ ...p, resourceName: e.target.value }));
                    setUploadErrors((p) => ({ ...p, resourceName: undefined }));
                  }}
                />
                {uploadErrors.resourceName && (
                  <span className="kv-error-msg">{uploadErrors.resourceName}</span>
                )}
              </div>

              <div className="kv-form-group">
                <label className="kv-form-label">
                  Subject <span className="kv-required">*</span>
                </label>
                <input
                  className={`kv-form-input ${uploadErrors.subject ? "kv-input-error" : ""}`}
                  type="text"
                  placeholder="e.g. Database Systems"
                  value={uploadForm.subject}
                  onChange={(e) => {
                    setUploadForm((p) => ({ ...p, subject: e.target.value }));
                    setUploadErrors((p) => ({ ...p, subject: undefined }));
                  }}
                />
                {uploadErrors.subject && (
                  <span className="kv-error-msg">{uploadErrors.subject}</span>
                )}
              </div>

              <div className="kv-form-group">
                <label className="kv-form-label">
                  Semester <span className="kv-required">*</span>
                </label>
                <input
                  className={`kv-form-input ${uploadErrors.semester ? "kv-input-error" : ""}`}
                  type="text"
                  placeholder="e.g. Semester 5"
                  value={uploadForm.semester}
                  onChange={(e) => {
                    setUploadForm((p) => ({ ...p, semester: e.target.value }));
                    setUploadErrors((p) => ({ ...p, semester: undefined }));
                  }}
                />
                {uploadErrors.semester && (
                  <span className="kv-error-msg">{uploadErrors.semester}</span>
                )}
              </div>

              <div className="kv-form-group">
                <label className="kv-form-label">Resource Category</label>
                <select
                  className="kv-form-input kv-form-select"
                  value={uploadForm.resourceType}
                  onChange={(e) => setUploadForm((p) => ({ ...p, resourceType: e.target.value }))}
                >
                  {RESOURCE_CATEGORIES.map((t) => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
              </div>

              <div className="kv-form-group">
                <label className="kv-form-label">
                  Resource Link <span className="kv-required">*</span>
                </label>
                <input
                  className={`kv-form-input ${uploadErrors.fileLink ? "kv-input-error" : ""}`}
                  type="text"
                  placeholder="e.g. https://drive.google.com/..."
                  value={uploadForm.fileLink}
                  onChange={(e) => {
                    setUploadForm((p) => ({ ...p, fileLink: e.target.value }));
                    setUploadErrors((p) => ({ ...p, fileLink: undefined }));
                  }}
                />
                {uploadErrors.fileLink && (
                  <span className="kv-error-msg">{uploadErrors.fileLink}</span>
                )}
              </div>
            </div>

            <div className="kv-modal-footer">
              <button className="kv-modal-cancel" onClick={closeUploadModal}>Cancel</button>
              <button className="kv-modal-submit" onClick={handleUploadSubmit}>Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}