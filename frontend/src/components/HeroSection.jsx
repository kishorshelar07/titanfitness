import { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import './HeroSection.css';

const HeroSection = () => {
  const bgRef = useRef(null);

  // Parallax on scroll
  useEffect(() => {
    const onScroll = () => {
      if (bgRef.current) {
        bgRef.current.style.transform = `translateY(${window.scrollY * 0.28}px)`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <section className="hero" id="hero">
      {/* Background */}
      <div className="hero-bg" ref={bgRef} />
      <div className="hero-overlay" />
      <div className="hero-overlay-bottom" />

      {/* Content */}
      <div className="hero-content">
        <div className="hero-eyebrow">
          <span className="eyebrow-line" />
          Pune's #1 Premium Fitness Club
        </div>

        <h1 className="hero-title">
          <span className="hero-line1">Build</span>
          <span className="hero-line2">Strength.</span>
        </h1>

        <p className="hero-tagline">
          Transform <span>Life.</span>&nbsp;·&nbsp;Pune, India
        </p>

        <div className="hero-btns">
          <Link to="/contact" className="btn-primary">
            ⚡ Start Free Trial
          </Link>
          <Link to="/programs" className="btn-secondary">
            Explore Programs
          </Link>
        </div>
      </div>

      {/* Floating Stats */}
      <div className="hero-stats">
        {[
          { num: '2500+', label: 'Active Members' },
          { num: '15+',   label: 'Expert Trainers' },
          { num: '8yrs',  label: 'Of Excellence'   },
        ].map((s) => (
          <div key={s.label} className="hero-stat">
            <div className="hero-stat-num">{s.num}</div>
            <div className="hero-stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Scroll Indicator */}
      <div className="hero-scroll">
        <span>Scroll</span>
      </div>
    </section>
  );
};

export default HeroSection;
