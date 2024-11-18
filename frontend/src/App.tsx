import { Route, Routes } from "react-router-dom";

import IndexPage from "@/pages/index";
import LoginPage from "@/pages/login";
import SignupPage from "@/pages/signup";
import DashboardPage from "@/pages/dashboard";
import InfoFormPage from "@/pages/info-form";

function App() {
  return (
    <Routes>
      <Route element={<IndexPage />} path="/" />
      <Route element={<LoginPage />} path="/login" />
      <Route element={<SignupPage />} path="/signup" />
      <Route element={<DashboardPage />} path="/dashboard" />
      <Route element={<InfoFormPage />} path="/info-form" />
    </Routes>
  );
}

export default App;
