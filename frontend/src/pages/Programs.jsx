// ─── Programs.jsx ─────────────────────────────────────────────────────────────
import { useEffect, useState } from 'react';
import ProgramCard from '../components/ProgramCard';
import { programsData } from '../data/programsData';

const Programs = () => {
  const [filter, setFilter] = useState('All');
  const cats = ['All', 'Weight Training', 'CrossFit', 'Fat Loss', 'Strength Training', 'Personal Training', 'Bodybuilding'];
  const filtered = filter === 'All' ? programsData : programsData.filter(p => p.category === filter);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [filter]);

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="section-tag">Train With Purpose</p>
          <h1 className="page-hero-title">Our <span style={{ background:'var(--gradient-fire)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Programs</span></h1>
        </div>
      </div>

      <section style={{ padding: 'var(--section-padding)', background: 'var(--black)' }}>
        <div style={{ display:'flex', gap:'2px', flexWrap:'wrap', marginBottom:'50px' }} className="reveal">
          {cats.map(c => (
            <button key={c}
              style={{
                fontFamily:'var(--font-display)', fontSize:'0.75rem', letterSpacing:'2px', textTransform:'uppercase',
                padding:'10px 22px', background: filter===c ? 'var(--orange)' : 'var(--panel)',
                color: filter===c ? 'white' : 'var(--gray)', border:'var(--border-dim)', cursor:'pointer',
                transition:'var(--transition)'
              }}
              onClick={() => setFilter(c)}
            >{c}</button>
          ))}
        </div>
        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px' }}>
          {filtered.map((p,i) => (
            <div key={p.id} className={`reveal delay-${(i%3)+1}`}>
              <ProgramCard program={p} />
            </div>
          ))}
        </div>
      </section>
    </main>
  );
};

export default Programs;
