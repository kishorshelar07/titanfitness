import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import TrainerCard from '../components/TrainerCard';
import { trainersData } from '../data/trainersData';
import './About.css';

const About = () => {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { threshold: 0.12 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  return (
    <main className="about-page">
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="section-tag">Our Story</p>
          <h1 className="page-hero-title">About <span className="accent">Titan</span></h1>
        </div>
      </div>

      {/* Story Section */}
      <section className="about-story">
        <div className="about-story-layout">
          <div className="reveal-left">
            <p className="section-tag">Est. 2017 · Pune</p>
            <h2 className="section-title">Built From <span className="accent">Passion</span></h2>
            <div className="section-divider" />
            <p className="about-body">
              Titan Fitness Club was founded in 2017 with a single conviction: that Pune deserved a world-class
              fitness destination — not just a gym. Our founders, competitive athletes and passionate coaches,
              wanted to create a space where science-backed training, elite coaching, and genuine community
              could coexist under one roof.
            </p>
            <p className="about-body">
              Today, Titan is home to 2,500+ members, 15+ certified trainers, and a culture of relentless
              self-improvement. Located in the heart of Shivajinagar, we've helped hundreds of people achieve
              transformations they once thought impossible.
            </p>
          </div>
          <div className="about-img-stack reveal-right">
            <img className="about-img-main" src="https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=700&q=80" alt="Gym interior" loading="lazy" />
            <img className="about-img-accent" src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&q=80" alt="CrossFit" loading="lazy" />
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="mission-section">
        <div className="section-header reveal" style={{ textAlign: 'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <p className="section-tag">Our Purpose</p>
          <h2 className="section-title">Mission &amp; <span className="accent">Vision</span></h2>
          <div className="section-divider" style={{ margin: '20px auto 0' }} />
        </div>
        <div className="mv-grid">
          <div className="mv-card reveal delay-1">
            <div className="mv-icon">🎯</div>
            <h3 className="mv-title">Our Mission</h3>
            <p className="mv-text">
              To empower every individual in Pune to achieve their peak physical and mental potential through
              world-class training, expert nutrition, and an unbeatable community culture.
            </p>
          </div>
          <div className="mv-card reveal delay-2">
            <div className="mv-icon">🔭</div>
            <h3 className="mv-title">Our Vision</h3>
            <p className="mv-text">
              To be India's most trusted premium fitness brand — a place where ordinary people achieve
              extraordinary results, driven by science, discipline, and community.
            </p>
          </div>
          <div className="mv-card reveal delay-3">
            <div className="mv-icon">⚡</div>
            <h3 className="mv-title">Our Values</h3>
            <p className="mv-text">
              Excellence in coaching. Honesty in results. Respect for every member's journey.
              We don't believe in shortcuts — we believe in the process.
            </p>
          </div>
        </div>
      </section>

      {/* Achievements */}
      <section className="achievements-section">
        <div className="section-header reveal" style={{ textAlign: 'center', display:'flex', flexDirection:'column', alignItems:'center' }}>
          <p className="section-tag">By The Numbers</p>
          <h2 className="section-title">Our <span className="accent">Achievements</span></h2>
          <div className="section-divider" style={{ margin: '20px auto 0' }} />
        </div>
        <div className="achievements-grid">
          {[
            { num: '2500+', label: 'Active Members'       },
            { num: '850+',  label: 'Transformations'      },
            { num: '15+',   label: 'Certified Trainers'   },
            { num: '4.9★',  label: 'Google Rating'        },
            { num: '12',    label: 'Fitness Programs'      },
            { num: '8yrs',  label: 'Years of Excellence'   },
          ].map((a, i) => (
            <div key={a.label} className={`achievement-card reveal delay-${(i % 3) + 1}`}>
              <div className="achievement-num">{a.num}</div>
              <div className="achievement-label">{a.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Trainers */}
      <section className="about-trainers">
        <div className="section-header reveal">
          <p className="section-tag">Meet The Team</p>
          <h2 className="section-title">Our <span className="accent">Trainers</span></h2>
          <div className="section-divider" />
        </div>
        <div className="trainers-grid-4">
          {trainersData.map((t, i) => (
            <div key={t.id} className={`reveal delay-${i + 1}`}>
              <TrainerCard trainer={t} />
            </div>
          ))}
        </div>
      </section>

      {/* Gym Photos */}
      <section className="gym-photos-section">
        <div className="section-header reveal">
          <p className="section-tag">Our Facilities</p>
          <h2 className="section-title">World-Class <span className="accent">Facilities</span></h2>
          <div className="section-divider" />
        </div>
        <div className="gym-photos-grid">
          {[
            'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=700&q=80',
            'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=700&q=80',
            'https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=700&q=80',
            'https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=700&q=80',
          ].map((src, i) => (
            <div key={i} className={`gym-photo-item reveal delay-${i + 1}`}>
              <img src={src} alt={`Gym facility ${i + 1}`} loading="lazy" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="about-cta">
        <div className="reveal" style={{ textAlign: 'center' }}>
          <h2 className="cta-title-sm">Ready to <span className="accent">Transform?</span></h2>
          <p style={{ color: 'var(--white2)', marginBottom: '32px', fontSize: '1.05rem' }}>
            Join thousands of members who've changed their lives at Titan Fitness Club.
          </p>
          <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/contact"    className="btn-primary">Start Free Trial</Link>
            <Link to="/membership" className="btn-secondary">View Membership</Link>
          </div>
        </div>
      </section>
    </main>
  );
};

export default About;
