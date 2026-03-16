import { useEffect } from 'react';
import TestimonialSlider from '../components/TestimonialSlider';
import { testimonialsData } from '../data/testimonialsData';
import { Link } from 'react-router-dom';

const Testimonials = () => {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="section-tag">Real People, Real Results</p>
          <h1 className="page-hero-title">
            Success{' '}
            <span style={{ background: 'var(--gradient-fire)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
              Stories
            </span>
          </h1>
        </div>
      </div>

      {/* Slider */}
      <section style={{ padding: 'var(--section-padding)', background: 'var(--black)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-40px', left: '3%', fontFamily: 'var(--font-display)', fontSize: '28rem', lineHeight: 1, color: 'rgba(255,77,0,0.04)', pointerEvents: 'none' }}>"</div>
        <div style={{ position: 'relative', zIndex: 1 }}>
          <div className="section-header reveal" style={{ marginBottom: '60px' }}>
            <p className="section-tag">Member Testimonials</p>
            <h2 className="section-title">What Our <span className="accent">Members Say</span></h2>
            <p className="section-desc">Over 850 transformations and counting.</p>
            <div className="section-divider" />
          </div>
          <TestimonialSlider />
        </div>
      </section>

      {/* All Testimonials Grid */}
      <section style={{ padding: 'var(--section-padding)', background: 'var(--dark2)' }}>
        <div className="section-header reveal" style={{ marginBottom: '60px' }}>
          <p className="section-tag">All Reviews</p>
          <h2 className="section-title">Every <span className="accent">Story</span> Matters</h2>
          <div className="section-divider" />
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '2px' }}>
          {testimonialsData.map((t, i) => (
            <div key={t.id}
              className={`reveal delay-${(i % 3) + 1}`}
              style={{ background: 'var(--panel)', border: 'var(--border-dim)', padding: '36px', transition: 'var(--transition)' }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(255,77,0,0.3)'; e.currentTarget.style.transform = 'translateY(-4px)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = ''; e.currentTarget.style.transform = ''; }}
            >
              <div style={{ display: 'flex', gap: '3px', marginBottom: '14px' }}>
                {[...Array(t.rating)].map((_, si) => <span key={si} style={{ color: 'var(--gold2)' }}>★</span>)}
              </div>
              {t.result && (
                <div style={{ display: 'inline-block', marginBottom: '12px', fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '2px', textTransform: 'uppercase', padding: '4px 12px', background: 'rgba(232,184,75,0.1)', border: '1px solid rgba(232,184,75,0.25)', color: 'var(--gold2)' }}>
                  🏆 {t.result}
                </div>
              )}
              <p style={{ fontStyle: 'italic', color: 'var(--white2)', lineHeight: 1.8, fontSize: '0.95rem', marginBottom: '24px' }}>"{t.content}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <img src={t.photo} alt={t.name} style={{ width: '48px', height: '48px', borderRadius: '50%', objectFit: 'cover', border: '2px solid rgba(255,77,0,0.4)' }} loading="lazy" />
                <div>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '2px' }}>{t.name}</div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--orange)', textTransform: 'uppercase' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ padding: '100px 6%', background: 'var(--black)', textAlign: 'center' }}>
        <div className="reveal">
          <p className="section-tag" style={{ justifyContent: 'center' }}>Your Turn</p>
          <h2 className="section-title" style={{ marginBottom: '20px' }}>Write Your <span className="accent">Success Story</span></h2>
          <p style={{ color: 'var(--white2)', marginBottom: '36px', fontSize: '1.05rem' }}>Every legend at Titan started exactly where you are now.</p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact" className="btn-primary">⚡ Start Free Trial</Link>
            <Link to="/membership" className="btn-secondary">View Membership</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Testimonials;
