import { BrowserRouter, Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import { AdminAuthProvider } from "./context/AdminAuthContext";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import SignUpPage from "./pages/SignUpPage";
import WelcomePage from "./pages/WelcomePage";
import AdminLoginPage from "./pages/admin/AdminLoginPage";
import AdminDashboardPage from "./pages/admin/AdminDashboardPage";

function App() {
  return (
    <UserProvider>
      <AdminAuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/signup" element={<SignUpPage />} />
            <Route path="/welcome" element={<WelcomePage />} />
            <Route path="/admin" element={<AdminLoginPage />} />
            <Route path="/admin/dashboard" element={<AdminDashboardPage />} />
          </Routes>
        </BrowserRouter>
      </AdminAuthProvider>
    </UserProvider>
  );
}

export default App;
