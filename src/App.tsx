import { useEffect } from 'react';
import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { Layout } from "@/components/Layout";
import { Dashboard } from "@/pages/Dashboard";
import { Feeding } from "@/pages/Feeding";
import { Sleep } from "@/pages/Sleep";
import { Supplies } from "@/pages/Supplies";
import { Knowledge } from "@/pages/Knowledge";
import { Share } from "@/pages/Share";
import { Summary } from "@/pages/Summary";
import { Settings } from "@/pages/Settings";
import { SharedView } from "@/pages/SharedView";
import { useUISettingsStore } from "@/store/useUISettingsStore";

export default function App() {
  const { darkMode } = useUISettingsStore();

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  return (
    <Router>
      <Routes>
        <Route path="/share/:token" element={<SharedView />} />
        <Route element={<Layout />}>
          <Route path="/" element={<Dashboard />} />
          <Route path="/feeding" element={<Feeding />} />
          <Route path="/sleep" element={<Sleep />} />
          <Route path="/supplies" element={<Supplies />} />
          <Route path="/knowledge" element={<Knowledge />} />
          <Route path="/share" element={<Share />} />
          <Route path="/summary" element={<Summary />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
      </Routes>
    </Router>
  );
}
