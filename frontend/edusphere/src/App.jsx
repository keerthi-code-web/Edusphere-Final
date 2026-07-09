
import { Routes, Route } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import RegisterPage from "./pages/RegisterPage";
import Login from "./pages/Login";
import OnboardingPage from "./pages/OnboardingPage";
import CommandCenter from "./pages/CommandCenter";
import MissionControl from "./pages/MissionControl";
import KnowledgeVault from "./pages/KnowledgeVault";
import StudyPath from "./pages/StudyPath";
import RapidPrep from "./pages/RapidPrep";
import ProgressIQ from "./pages/ProgressIQ";
import AdminDashboard from "./pages/AdminDashboard";

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/onboarding" element={<OnboardingPage />} />
      <Route path="/command-center" element={<CommandCenter />} />

      <Route path="/mission-control" element={<MissionControl />} />
      <Route path="/knowledge-vault" element={<KnowledgeVault />} />
      <Route path="/study-path" element={<StudyPath />} />
      <Route path="/rapid-prep" element={<RapidPrep />} />
      <Route path="/progress-iq" element={<ProgressIQ />} />

      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
}

export default App;

