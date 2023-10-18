// Router.js
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import AdminLogin from "./pages/adminLogin";

export default function AppRoutes() {
  return (
    <Router>
      <Routes>
        <Route path="/app/login" element={<AdminLogin />} />
      </Routes>
    </Router>
  );
}


