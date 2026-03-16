import { useEffect } from 'react';
import TrainerCard from '../components/TrainerCard';
import { trainersData } from '../data/trainersData';
import { Link } from 'react-router-dom';

const Trainers = () => {
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
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="section-tag">Meet The Coaches</p>
          <h1 className="page-hero-title">Our <span style={{ background:'var(--gradient-fire)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Trainers</span></h1>
        </div>
      </div>

      <section style={{ padding:'var(--section-padding)', background:'var(--dark2)' }}>
        <div className="section-header reveal" style={{ marginBottom:'60px' }}>
          <p className="section-tag">The Experts</p>
          <h2 className="section-title">World-Class <span className="accent">Coaches</span></h2>
          <p className="section-desc">Each trainer at Titan is handpicked for expertise, results, and character. Meet the people who will change your life.</p>
          <div className="section-divider" />
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'2px' }}>
          {trainersData.map((t, i) => (
            <div key={t.id} className={`reveal delay-${i+1}`}>
              <TrainerCard trainer={t} />
            </div>
          ))}
        </div>
      </section>

      {/* Detail Cards */}
      <section style={{ padding:'var(--section-padding)', background:'var(--black)' }}>
        {trainersData.map((t, i) => (
          <div key={t.id} style={{
            display:'grid', gridTemplateColumns: i%2===0 ? '340px 1fr' : '1fr 340px',
            gap:'80px', alignItems:'center', marginBottom:'80px',
            paddingBottom:'80px', borderBottom:'var(--border-dim)'
          }} className={i%2===0 ? 'reveal-left' : 'reveal-right'}>
            <img src={t.photo} alt={t.name} style={{ width:'100%', height:'420px', objectFit:'cover', objectPosition:'top', order: i%2===0 ? 0 : 1 }} loading="lazy" />
            <div style={{ order: i%2===0 ? 1 : 0 }}>
              <p className="section-tag">{t.specialization}</p>
              <h2 style={{ fontFamily:'var(--font-display)', fontSize:'2.8rem', fontWeight:700, textTransform:'uppercase', lineHeight:1, marginBottom:'16px', color:'var(--white)' }}>{t.name}</h2>
              <p style={{ color:'var(--orange)', fontFamily:'var(--font-mono)', fontSize:'0.7rem', letterSpacing:'3px', textTransform:'uppercase', marginBottom:'20px' }}>
                ⚡ {t.experience} Years Experience
              </p>
              <p style={{ color:'var(--white2)', lineHeight:1.8, fontSize:'1rem', marginBottom:'28px' }}>{t.bio}</p>
              <div style={{ display:'flex', flexWrap:'wrap', gap:'8px', marginBottom:'28px' }}>
                {t.certifications.map(c => (
                  <span key={c} style={{ fontFamily:'var(--font-mono)', fontSize:'0.6rem', letterSpacing:'2px', textTransform:'uppercase', padding:'6px 14px', background:'rgba(255,77,0,0.1)', border:'1px solid rgba(255,77,0,0.25)', color:'var(--orange)' }}>{c}</span>
                ))}
              </div>
              <Link to="/contact" className="btn-primary">Book a Session</Link>
            </div>
          </div>
        ))}
      </section>
    </main>
  );
};

export default Trainers;
