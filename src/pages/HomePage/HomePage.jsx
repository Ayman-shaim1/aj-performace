import { useEffect, useRef } from "react";
import HeroSection from "./HeroSection";
import AboutSection from "./AboutSection";

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
      <AboutSection />
    </>
  );
}
