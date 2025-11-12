import { useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage/HomePage";
import EBookListPage from "./pages/EBookListPage";

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
