import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage/HomePage";
import EBookListPage from "./pages/EBookListPage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import EmailConfirmationPage from "./pages/EmailConfirmationPage";
import VerifyEmailPage from "./pages/VerifyEmailPage";
import ResendVerificationPage from "./pages/ResendVerificationPage";
import { client } from "./config/appwrite"; 

function AppContent() {
  const [heroInView, setHeroInView] = useState(true);
  const location = useLocation();

  useEffect(() => {
    if (location.pathname !== "/") {
      setHeroInView(false);
    }
  }, [location.pathname]);

  return (
    <>
      <Routes>
        <Route
          path="/"
          element={
            <>
              <NavBar isHeroInView={heroInView} />
              <HomePage onHeroInViewChange={setHeroInView} />
            </>
          }
        />
        <Route path="/e-books" element={<EBookListPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/email-confirmation" element={<EmailConfirmationPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/resend-verification" element={<ResendVerificationPage />} />
      </Routes>
    </>
  );
}

export default function App() {
  

  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
