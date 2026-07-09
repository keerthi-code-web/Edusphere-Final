import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/MissionControl.css';
import { applyStoredTheme } from '../utils/theme';
import {
    getTasks,
    updateTask,createTask
} from "../services/taskService";


// ── Helpers ──────────────────────────────────────
const today = new Date();
today.setHours(0, 0, 0, 0);

function parseDue(dateStr) {
  const d = new Date(dateStr);
  d.setHours(0, 0, 0, 0);
  return d;
}

function daysUntil(dateStr) {
  return Math.round((parseDue(dateStr) - today) / 86400000);
}

function urgencyLabel(dateStr) {
  const d = daysUntil(dateStr);
  if (d < 0) return 'overdue';
  if (d === 0) return 'today';
  if (d <= 2) return 'urgent';
  if (d <= 5) return 'soon';
  return 'normal';
}

function formatDue(dateStr) {
  const d = daysUntil(dateStr);
  if (d < 0) return `Overdue by ${Math.abs(d)} day${Math.abs(d) > 1 ? 's' : ''}`;
  if (d === 0) return 'Due Today';
  if (d === 1) return 'Due Tomorrow';
  return `Due ${new Date(dateStr).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}`;
}

// ── Seed tasks ────────────────────────────────────
let nextId = 10;

const SEED_TASKS = [
  { id: 1, title: 'DBMS Assignment', dueDate: '2026-07-02', subject: 'Database Systems', description: '', completed: false },
  { id: 2, title: 'Linear Algebra Problem Set', dueDate: '2026-07-04', subject: 'Mathematics III', description: '', completed: false },
  { id: 3, title: 'NPTEL Week 8 Quiz', dueDate: '2026-07-06', subject: 'NPTEL – ML', description: '', completed: false },
  { id: 4, title: 'ML Model Training Report', dueDate: '2026-07-03', subject: 'Machine Learning', description: '', completed: false },
  { id: 5, title: 'OS Lab Experiment 5', dueDate: '2026-07-04', subject: 'Operating Systems', description: '', completed: false },
  { id: 6, title: 'CN Assignment – TCP/IP', dueDate: '2026-07-10', subject: 'Computer Networks', description: '', completed: false },
  { id: 7, title: 'Java Mini Project', dueDate: '2026-06-29', subject: 'OOP with Java', description: '', completed: true },
  { id: 8, title: 'Data Structures Viva', dueDate: '2026-06-23', subject: 'DSA', description: '', completed: true },
  { id: 9, title: 'English Technical Writing', dueDate: '2026-06-20', subject: 'Communication Skills', description: '', completed: true },
];

const FILTERS = ['All', 'Urgent', 'Completed'];

// ── Component ─────────────────────────────────────
export default function MissionControl() {
  const navigate = useNavigate();

  // Always open this module from the top of the page; restore saved theme
  useEffect(() => {

    window.scrollTo(0,0);

    applyStoredTheme();

    loadTasks();

}, []);

  const [tasks, setTasks] = useState([]);
  const [activeFilter, setActiveFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: '', dueDate: '', subject: '', description: '' });
  const [formErrors, setFormErrors] = useState({});
  const [updatingTaskId, setUpdatingTaskId] = useState(null);

  const loadTasks = async () => {

    try {

        const response = await getTasks();

        const formattedTasks = response.data.data.map(task => ({

            id: task.task_id,

            title: task.task_name,

            dueDate: task.due_date,

            subject: task.subject,

            description: task.description,

            completed: task.status === "Completed"

        }));

        setTasks(formattedTasks);

    }

    catch (error) {

        console.error("Failed to load tasks", error);

    }

};


  // ── Derived counts ────────────────────────────
  const total = tasks.length;
  const completed = tasks.filter((t) => t.completed).length;
  const pending = total - completed;
  const urgent = tasks.filter(
    (t) => !t.completed && ['urgent', 'today', 'overdue'].includes(urgencyLabel(t.dueDate))
  ).length;

  // ── Filtered list ─────────────────────────────
  const filtered = useMemo(() => {
    const pending_tasks = tasks.filter((t) => !t.completed);
    const done_tasks = tasks.filter((t) => t.completed);

    if (activeFilter === 'Completed') return done_tasks;
    if (activeFilter === 'Urgent')
      return pending_tasks.filter((t) =>
        ['urgent', 'today', 'overdue'].includes(urgencyLabel(t.dueDate))
      );
    // All: pending sorted by due date first, then completed
    return [
      ...pending_tasks.sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate)),
      ...done_tasks,
    ];
  }, [tasks, activeFilter]);

  // Upcoming deadlines: pending tasks sorted by nearest due
  const deadlines = useMemo(
    () =>
      tasks
        .filter((t) => !t.completed)
        .sort((a, b) => new Date(a.dueDate) - new Date(b.dueDate))
        .slice(0, 5),
    [tasks]
  );

  const progressPct = total > 0 ? Math.round((completed / total) * 100) : 0;
  const circumference = 201; // 2π×32

  // ── Actions ───────────────────────────────────
  const toggleComplete = async (id) => {

    try {

        setUpdatingTaskId(id);

        await updateTask(id, {
            status: "Completed"
        });

        await loadTasks();

    } catch (error) {

        console.error("Failed to update task:", error);

    } finally {

        setUpdatingTaskId(null);

    }

};
  const validateNew = () => {
    const e = {};
    if (!newTask.title.trim()) e.title = 'Task name is required.';
    if (!newTask.dueDate) e.dueDate = 'Due date is required.';
    return e;
  };

  const handleAddTask = async () => {
    const e = validateNew();
    if (Object.keys(e).length) { setFormErrors(e); return; }
    try {

    await createTask({

        task_name: newTask.title.trim(),

        subject: newTask.subject.trim(),

        description: newTask.description.trim(),

        due_date: newTask.dueDate

    });

   
await loadTasks();
    setNewTask({
        title: "",
        dueDate: "",
        subject: "",
        description: ""
    });

    setFormErrors({});

    setShowModal(false);

} catch (error) {

    console.error("Task creation failed:", error);

}
  };

  const closeModal = () => {
    setShowModal(false);
    setNewTask({ title: '', dueDate: '', subject: '', description: '' });
    setFormErrors({});
  };

  const dateStr = new Date().toLocaleDateString('en-IN', {
    weekday: 'short', day: 'numeric', month: 'long', year: 'numeric',
  });

  return (
    <div className="mc-root">
      {/* ── Header ── */}
      <header className="mc-header">
        <div className="mc-header-text">
          <button className="mc-back-btn" onClick={() => navigate('/command-center')}>← Back to Dashboard</button>
          <h1 className="mc-title"><span className="mc-title-icon">🚀</span> Mission Control</h1>
          <p className="mc-subtitle">Your personal task & deadline manager.</p>
        </div>
        <span className="mc-date-badge">{dateStr}</span>
      </header>

      {/* ── Summary Cards ── */}
      <section className="mc-summary-grid">
        {[
          { label: 'Total Tasks', value: total, icon: '📋', accent: 'accent-blue' },
          { label: 'Pending', value: pending, icon: '⏳', accent: 'accent-amber' },
          { label: 'Completed', value: completed, icon: '✅', accent: 'accent-green' },
          { label: 'Urgent', value: urgent, icon: '🔥', accent: 'accent-red' },
        ].map((c) => (
          <div key={c.label} className={`mc-summary-card ${c.accent}`}>
            <div className="mc-summary-icon">{c.icon}</div>
            <div className="mc-summary-body">
              <span className="mc-summary-value">{c.value}</span>
              <span className="mc-summary-label">{c.label}</span>
            </div>
          </div>
        ))}
      </section>

      {/* ── Toolbar ── */}
      <section className="mc-toolbar">
        <div className="mc-filters">
          {FILTERS.map((f) => (
            <button
              key={f}
              className={`mc-filter-btn ${activeFilter === f ? 'mc-filter-active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <button className="mc-add-btn" onClick={() => setShowModal(true)}>
          <span className="mc-add-icon">＋</span> New Task
        </button>
      </section>

      {/* ── Task List (full width) ── */}
      <section className="mc-task-list">
        <div className="mc-list-header">
          <span className="mc-list-count">{filtered.length} task{filtered.length !== 1 ? 's' : ''}</span>
        </div>

        {filtered.length === 0 ? (
          <div className="mc-empty">
            <div className="mc-empty-icon">🎉</div>
            <p className="mc-empty-text">
              {activeFilter === 'Urgent' ? 'No urgent tasks right now.' : 'No tasks here yet.'}
            </p>
          </div>
        ) : (
          <div className="mc-cards-col">
            {filtered.map((task) => (
              <div
                key={task.id}
                className={`mc-task-card ${task.completed ? 'mc-task-done' : ''}`}
              >
                <button
    className={`mc-check-btn ${task.completed ? 'mc-check-done' : ''}`}
    onClick={() => toggleComplete(task.id)}
    disabled={task.completed || updatingTaskId === task.id}
    title={task.completed ? 'Completed' : 'Mark complete'}
>
    {updatingTaskId === task.id
        ? "..."
        : task.completed
            ? "✓"
            : ""}
</button>
                <div className="mc-task-info">
                  <span className="mc-task-title">{task.title}</span>
                  <div className="mc-task-meta">
                    {task.subject && <span className="mc-task-subject">📚 {task.subject}</span>}
                    <span className="mc-task-due">🗓 {formatDue(task.dueDate)}</span>
                  </div>
                </div>
                <span className={`mc-status-pill ${task.completed ? 'mc-status-done' : 'mc-status-pending'}`}>
                  {task.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── Upcoming Deadlines (full width) ── */}
      <section className="mc-panel mc-deadlines-section">
        <h3 className="mc-panel-title"><span>⏰</span> Upcoming Deadlines</h3>
        {deadlines.length === 0 ? (
          <p className="mc-panel-empty">No pending deadlines.</p>
        ) : (
          <ul className="mc-deadline-list">
            {deadlines.map((t) => {
              const urg = urgencyLabel(t.dueDate);
              return (
                <li key={t.id} className={`mc-deadline-item mc-dl-${urg}`}>
                  <div className="mc-dl-dot" />
                  <div className="mc-dl-content">
                    <span className="mc-dl-name">{t.title}</span>
                    <span className="mc-dl-when">{formatDue(t.dueDate)}</span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      {/* ── Overall Progress (full width) ── */}
      <section className="mc-panel mc-progress-panel">
        <h3 className="mc-panel-title"><span>📊</span> Overall Progress</h3>
        <div className="mc-progress-content">
          <div className="mc-progress-ring-wrapper">
            <svg className="mc-ring-svg" viewBox="0 0 80 80">
              <circle cx="40" cy="40" r="32" className="mc-ring-bg" />
              <circle
                cx="40" cy="40" r="32"
                className="mc-ring-fill"
                strokeDasharray={`${(progressPct / 100) * circumference} ${circumference}`}
                transform="rotate(-90 40 40)"
              />
            </svg>
            <div className="mc-ring-label">
              <span className="mc-ring-pct">{progressPct}%</span>
              <span className="mc-ring-sub">Done</span>
            </div>
          </div>
          <div className="mc-progress-stats">
            <span>{completed} completed</span>
            <span>{pending} remaining</span>
          </div>
        </div>
      </section>

      {/* ── Motivational Quote (full width) ── */}
      <section className="mc-panel mc-motivation-panel">
        <div className="mc-motivation-icon">💡</div>
        <p className="mc-motivation-quote">Stay focused.</p>
        <p className="mc-motivation-sub">
          One completed task is better than ten planned tasks.
        </p>
      </section>

      {/* ── Add Task Modal ── */}
      {showModal && (
        <div className="mc-modal-overlay" onClick={closeModal}>
          <div className="mc-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mc-modal-header">
              <h2 className="mc-modal-title">New Task</h2>
              <button className="mc-modal-close" onClick={closeModal}>✕</button>
            </div>

            <div className="mc-modal-body">
              <div className="mc-form-group">
                <label className="mc-form-label">Task Name <span className="mc-required">*</span></label>
                <input
                  className={`mc-form-input ${formErrors.title ? 'mc-input-error' : ''}`}
                  type="text"
                  placeholder="e.g. Complete DBMS assignment"
                  value={newTask.title}
                  onChange={(e) => { setNewTask((p) => ({ ...p, title: e.target.value })); setFormErrors((p) => ({ ...p, title: undefined })); }}
                />
                {formErrors.title && <span className="mc-error-msg">{formErrors.title}</span>}
              </div>

              <div className="mc-form-group">
                <label className="mc-form-label">Subject <span className="mc-optional">(optional)</span></label>
                <input
                  className="mc-form-input"
                  type="text"
                  placeholder="e.g. Mathematics"
                  value={newTask.subject}
                  onChange={(e) => setNewTask((p) => ({ ...p, subject: e.target.value }))}
                />
              </div>

              <div className="mc-form-group">
                <label className="mc-form-label">Due Date <span className="mc-required">*</span></label>
                <input
                  className={`mc-form-input ${formErrors.dueDate ? 'mc-input-error' : ''}`}
                  type="date"
                  value={newTask.dueDate}
                  onChange={(e) => { setNewTask((p) => ({ ...p, dueDate: e.target.value })); setFormErrors((p) => ({ ...p, dueDate: undefined })); }}
                />
                {formErrors.dueDate && <span className="mc-error-msg">{formErrors.dueDate}</span>}
              </div>

              <div className="mc-form-group">
                <label className="mc-form-label">Description <span className="mc-optional">(optional)</span></label>
                <textarea
                  className="mc-form-textarea"
                  rows={3}
                  placeholder="Add any extra details about this task..."
                  value={newTask.description}
                  onChange={(e) => setNewTask((p) => ({ ...p, description: e.target.value }))}
                />
              </div>
            </div>

            <div className="mc-modal-footer">
              <button className="mc-modal-cancel" onClick={closeModal}>Cancel</button>
              <button className="mc-modal-submit" onClick={handleAddTask}>Create Task</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}