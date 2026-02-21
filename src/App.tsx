import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppLayout from "./components/AppLayout";
import DashboardPage from "./pages/DashboardPage";
import IdeasPage from "./pages/IdeasPage";
import SettingsPage from "./pages/SettingsPage";
import NotFoundPage from "./pages/PageNotFound";
import BriefsPage from "./pages/BriefsPage";
import BriefDetailPage from "./pages/BriefDetailPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/ideas" element={<IdeasPage />} />
          <Route path="/briefs" element={<BriefsPage />} />
          <Route path="/briefs/:id" element={<BriefDetailPage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}