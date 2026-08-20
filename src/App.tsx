import { HashRouter, Route, Routes, Navigate, useParams } from "react-router-dom";
import { StoreProvider } from "./lib/store";
import { ToastProvider } from "./components/ui";
import Layout from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Athletes from "./pages/Athletes";
import WeighIn from "./pages/WeighIn";
import Brackets from "./pages/Brackets";
import { LiveIndex, LiveMatch } from "./pages/Live";
import Results from "./pages/Results";
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
          <Layout>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/athletes" element={<Athletes />} />
              <Route path="/pesee" element={<WeighIn />} />
              <Route path="/tirages" element={<Brackets />} />
              <Route path="/live" element={<LiveIndex />} />
              <Route path="/live/:matchId" element={<LiveMatchPage />} />
              <Route path="/resultats" element={<Results />} />
              <Route path="/admin" element={<Admin />} />
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </Layout>
        </HashRouter>
      </ToastProvider>
    </StoreProvider>
  );
}
