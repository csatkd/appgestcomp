import { HashRouter, Route, Routes, Navigate, useParams } from "react-router-dom";
import { StoreProvider } from "./lib/store";
import { ToastProvider } from "./components/ui";
import Layout from "./components/Layout";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import DashboardEnhanced from "./pages/DashboardEnhanced";
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
            {/* Landing page sans layout */}
            <Route path="/landing" element={<Landing />} />
            
            {/* Portail Parents (sans layout) */}
            <Route path="/parents/login" element={<ParentsLogin />} />
            <Route path="/parents/dashboard" element={<ParentsDashboard />} />
            
            {/* Application avec layout */}
            <Route
              path="/*"
              element={
                <Layout>
                  <Routes>
                    <Route path="/" element={<DashboardEnhanced />} />
                    <Route path="/competitions" element={<Competitions />} />
                    <Route path="/organizers" element={<Organizers />} />
                    <Route path="/clubs" element={<Clubs />} />
                    <Route path="/referees" element={<Referees />} />
                    <Route path="/athletes" element={<Athletes />} />
                    <Route path="/pesee" element={<WeighIn />} />
                    <Route path="/tirages" element={<Brackets />} />
                    <Route path="/live" element={<LiveIndex />} />
                    <Route path="/live/:matchId" element={<LiveMatchPage />} />
                    <Route path="/resultats" element={<Results />} />
                    <Route path="/reclamations" element={<Claims />} />
                    <Route path="/tv" element={<TvMode />} />
                    <Route path="/qr" element={<QrPresence />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/export" element={<ExportImport />} />
                    <Route path="/sponsors" element={<Sponsors />} />
                    <Route path="/sponsors/report" element={<SponsorsReport />} />
                    <Route path="/ceremony-sponsors" element={<CeremonySponsorsPage />} />
                    <Route path="/workflow" element={<CompetitionWorkflow />} />
                    <Route path="/arenas" element={<ArenasManager />} />
                    <Route path="/schedule" element={<MatchSchedule />} />
                    <Route path="/call" element={<CallSystem />} />
                    <Route path="/certificates" element={<Certificates />} />
                    <Route path="/report" element={<CompetitionReport />} />
                    <Route path="/admin" element={<Admin />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                </Layout>
              }
            />
          </Routes>
        </HashRouter>
      </ToastProvider>
    </StoreProvider>
  );
}
