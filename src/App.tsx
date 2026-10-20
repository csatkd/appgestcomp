import { HashRouter, Route, Routes, Navigate, useParams } from "react-router-dom";
import { StoreProvider } from "./lib/store";
import { ToastProvider } from "./components/ui";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import DashboardEnhanced from "./pages/DashboardEnhanced";
import DashboardWithDragDrop from "./pages/DashboardWithDragDrop";
import AdminPanel from "./pages/AdminPanel";
import CompetitionWorkflow from "./pages/CompetitionWorkflow";
import ArenasManager from "./pages/ArenasManager";
import MatchSchedule from "./pages/MatchSchedule";
import CallSystem from "./pages/CallSystem";
import Certificates from "./pages/Certificates";
import CompetitionReport from "./pages/CompetitionReport";
import Athletes from "./pages/Athletes";
import WeighIn from "./pages/WeighIn";
import Brackets from "./pages/Brackets";
import { LiveIndex, LiveMatch } from "./pages/Live";
import Results from "./pages/Results";
import Claims from "./pages/Claims";
import TvMode from "./pages/TvMode";
import QrPresence from "./pages/QrPresence";
import Competitions from "./pages/Competitions";
import Organizers from "./pages/Organizers";
import Clubs from "./pages/Clubs";
import Referees from "./pages/Referees";
import ParentsLogin from "./pages/ParentsLogin";
import ParentsDashboard from "./pages/ParentsDashboard";
import Calendar from "./pages/Calendar";
import Reports from "./pages/Reports";
import Notifications from "./pages/Notifications";
import ExportImport from "./pages/ExportImport";
import Sponsors from "./pages/Sponsors";
import SponsorsReport from "./pages/SponsorsReport";
import CeremonySponsorsPage from "./pages/CeremonySponsorsPage";
import Admin from "./pages/Admin";
import GamificationPanel from "./components/GamificationPanel";
import AdvancedAnalytics from "./components/AdvancedAnalytics";
import AthleteRanking from "./components/AthleteRanking";
import AccessibilityPanel from "./components/AccessibilityPanel";
import SocialProfiles from "./components/SocialProfiles";
import TrainingModule from "./components/TrainingModule";
import Poomsae from "./pages/Poomsae";
import Casse from "./pages/Casse";
import Grades from "./pages/Grades";
import EfficientManagement from "./components/EfficientManagement";
import DemoShowcase from "./pages/DemoShowcase";

/** Remonte l'écran de combat à chaque changement d'adversaires. */
function LiveMatchPage() {
  const { matchId } = useParams();
  return <LiveMatch key={matchId} />;
}

export default function App() {
  return (
    <StoreProvider>
      <ToastProvider>
        <HashRouter>
          <Routes>
            {/* Page d'accueil */}
            <Route path="/" element={<Home />} />
            
            {/* Landing page sans layout */}
            <Route path="/landing" element={<Landing />} />
            <Route path="/demo" element={<DemoShowcase />} />
            
            {/* Portail Parents (sans layout) */}
            <Route path="/parents/login" element={<ParentsLogin />} />
            <Route path="/parents/dashboard" element={<ParentsDashboard />} />
            
            {/* Application avec layout - toutes les routes au même niveau */}
            <Route path="/app" element={<Layout><DashboardWithDragDrop /></Layout>} />
            <Route path="/competitions" element={<Layout><Competitions /></Layout>} />
            <Route path="/organizers" element={<Layout><Organizers /></Layout>} />
            <Route path="/clubs" element={<Layout><Clubs /></Layout>} />
            <Route path="/referees" element={<Layout><Referees /></Layout>} />
            <Route path="/athletes" element={<Layout><Athletes /></Layout>} />
            <Route path="/pesee" element={<Layout><WeighIn /></Layout>} />
            <Route path="/tirages" element={<Layout><Brackets /></Layout>} />
            <Route path="/live" element={<Layout><LiveIndex /></Layout>} />
            <Route path="/live/:matchId" element={<Layout><LiveMatchPage /></Layout>} />
            <Route path="/resultats" element={<Layout><Results /></Layout>} />
            <Route path="/reclamations" element={<Layout><Claims /></Layout>} />
            <Route path="/tv" element={<Layout><TvMode /></Layout>} />
            <Route path="/qr" element={<Layout><QrPresence /></Layout>} />
            <Route path="/calendar" element={<Layout><Calendar /></Layout>} />
            <Route path="/reports" element={<Layout><Reports /></Layout>} />
            <Route path="/notifications" element={<Layout><Notifications /></Layout>} />
            <Route path="/export" element={<Layout><ExportImport /></Layout>} />
            <Route path="/sponsors" element={<Layout><Sponsors /></Layout>} />
            <Route path="/sponsors/report" element={<Layout><SponsorsReport /></Layout>} />
            <Route path="/ceremony-sponsors" element={<Layout><CeremonySponsorsPage /></Layout>} />
            <Route path="/workflow" element={<Layout><CompetitionWorkflow /></Layout>} />
            <Route path="/arenas" element={<Layout><ArenasManager /></Layout>} />
            <Route path="/schedule" element={<Layout><MatchSchedule /></Layout>} />
            <Route path="/call" element={<Layout><CallSystem /></Layout>} />
            <Route path="/certificates" element={<Layout><Certificates /></Layout>} />
            <Route path="/report" element={<Layout><CompetitionReport /></Layout>} />
            <Route path="/analytics" element={<Layout><AdvancedAnalytics /></Layout>} />
            <Route path="/ranking" element={<Layout><AthleteRanking /></Layout>} />
            <Route path="/gamification" element={<Layout><GamificationPanel userId="current-user" /></Layout>} />
            <Route path="/profiles" element={<Layout><SocialProfiles /></Layout>} />
            <Route path="/training" element={<Layout><TrainingModule /></Layout>} />
            <Route path="/poomsae" element={<Layout><Poomsae /></Layout>} />
            <Route path="/casse" element={<Layout><Casse /></Layout>} />
            <Route path="/grades" element={<Layout><Grades /></Layout>} />
            <Route path="/management" element={<Layout><EfficientManagement /></Layout>} />
            <Route path="/admin" element={<Layout><AdminPanel /></Layout>} />
            
            {/* Redirection par défaut */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </StoreProvider>
  );
}
