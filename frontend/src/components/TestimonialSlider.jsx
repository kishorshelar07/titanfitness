import { useState, useEffect, useRef } from 'react';
import { testimonialsData } from '../data/testimonialsData';
import './TestimonialSlider.css';

const TestimonialSlider = () => {
  const [index, setIndex]     = useState(0);
  const [perView, setPerView] = useState(3);
  const trackRef              = useRef(null);
  const timerRef              = useRef(null);

  useEffect(() => {
    const update = () => setPerView(window.innerWidth <= 768 ? 1 : window.innerWidth <= 1100 ? 2 : 3);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  const maxIndex = Math.max(0, testimonialsData.length - perView);

  const go = (dir) => {
    setIndex((prev) => {
      const next = prev + dir;
      if (next < 0) return maxIndex;
      if (next > maxIndex) return 0;
      return next;
    });
  };

  // Auto-play
  useEffect(() => {
    timerRef.current = setInterval(() => go(1), 5000);
    return () => clearInterval(timerRef.current);
  }, [perView]);

  useEffect(() => {
    if (!trackRef.current) return;
    const cardWidth = trackRef.current.children[0]?.offsetWidth + 20 || 0;
    trackRef.current.style.transform = `translateX(-${index * cardWidth}px)`;
  }, [index, perView]);

  return (
    <div className="testimonial-slider-wrap">
      <div className="testimonials-overflow">
        <div className="testimonials-track" ref={trackRef}>
          {testimonialsData.map((t) => (
            <div key={t.id} className="testimonial-card">
              <div className="t-stars">
                {[...Array(t.rating)].map((_, i) => <span key={i} className="star">★</span>)}
              </div>
              <p className="t-content">"{t.content}"</p>
              <div className="t-author">
                <div className="t-avatar">
                  <img src={t.photo} alt={t.name} loading="lazy" />
                </div>
                <div>
                  <div className="t-name">{t.name}</div>
                  <div className="t-role">{t.role}</div>
                </div>
              </div>
              {t.result && <div className="t-result">🏆 {t.result}</div>}
            </div>
          ))}
        </div>
      </div>

      <div className="t-controls">
        <button className="t-arrow" onClick={() => go(-1)} aria-label="Previous">←</button>
        <button className="t-arrow" onClick={() => go(1)}  aria-label="Next">→</button>
        <div className="t-dots">
          {[...Array(maxIndex + 1)].map((_, i) => (
            <button
              key={i}
              className={`t-dot ${i === index ? 'active' : ''}`}
              onClick={() => setIndex(i)}
              aria-label={`Slide ${i + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default TestimonialSlider;
