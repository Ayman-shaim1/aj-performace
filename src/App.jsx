import { useState } from "react";
import NavBar from "./components/NavBar";
import HomePage from "./pages/HomePage/HomePage";

export default function App() {
  const [heroInView, setHeroInView] = useState(true);

  return (
    <>
      <NavBar isHeroInView={heroInView} />
      <HomePage onHeroInViewChange={setHeroInView} />
    </>
  );
}
