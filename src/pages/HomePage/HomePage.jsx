import { useEffect, useRef } from "react";
import HeroSection from "./HeroSection";
import ResultsStatsSection from "./ResultsStatsSection";
import AboutSection from "./AboutSection";
import MyServicesSection from "./MyServicesSection";
import EBooksPreviewSection from "./EBooksPreviewSection";
import TestimonialsSection from "./TestimonialsSection";
import FAQSection from "./FAQSection";
import ContactMeSection from "./ContactMeSection";
import FooterSection from "./FooterSection";


export default function HomePage({ onHeroInViewChange }) {
  const heroRef = useRef(null);

  useEffect(() => {
    const handleIntersection = (entries) => {
      const [entry] = entries;
      if (onHeroInViewChange) {
        onHeroInViewChange(entry.isIntersecting);
      }
    };

    const observer = new IntersectionObserver(handleIntersection, {
      root: null,
      threshold: 0,
    });

    const currentHero = heroRef.current;

    if (currentHero) {
      observer.observe(currentHero);
    }

    return () => {
      if (currentHero) {
        observer.unobserve(currentHero);
      }
      observer.disconnect();
    };
  }, [onHeroInViewChange]);

  return (
    <>
      <HeroSection sectionRef={heroRef} />
      <ResultsStatsSection />
      <AboutSection />
      <MyServicesSection />
      <EBooksPreviewSection />
      <TestimonialsSection />
      <FAQSection />
      <ContactMeSection />
      <FooterSection />
    </>
  );
}
