// ─── Gallery.jsx ──────────────────────────────────────────────────────────────
import { useEffect } from 'react';
import GalleryGrid from '../components/GalleryGrid';

const Gallery = () => {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="section-tag">Inside Titan</p>
          <h1 className="page-hero-title">Our <span style={{ background:'var(--gradient-fire)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Gallery</span></h1>
        </div>
      </div>
      <section style={{ padding:'var(--section-padding)', background:'var(--black)' }}>
        <div className="section-header reveal" style={{ marginBottom:'50px' }}>
          <p className="section-tag">Real Moments</p>
          <h2 className="section-title">Titan in <span className="accent">Action</span></h2>
          <p className="section-desc">State-of-the-art facilities, real transformations, and the community that drives results.</p>
          <div className="section-divider" />
        </div>
        <GalleryGrid />
      </section>
    </main>
  );
};

export default Gallery;
