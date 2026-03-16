import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import HeroSection        from '../components/HeroSection';
import ProgramCard        from '../components/ProgramCard';
import TrainerCard        from '../components/TrainerCard';
import TestimonialSlider  from '../components/TestimonialSlider';
import { programsData }   from '../data/programsData';
import { trainersData }   from '../data/trainersData';
import { blogData }       from '../data/blogData';
import BlogCard           from '../components/BlogCard';
import './Home.css';

/* ── Scroll reveal hook ── */
const useReveal = () => {
  useEffect(() => {
    const els = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } });
    }, { threshold: 0.12 });
    els.forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

/* ── Animated counter ── */
const useCounters = () => {
  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          const el     = e.target;
          const target = parseInt(el.dataset.target, 10);
          const step   = target / 80;
          let cur      = 0;
          const id     = setInterval(() => {
            cur += step;
            if (cur >= target) { el.textContent = target.toLocaleString('en-IN'); clearInterval(id); }
            else { el.textContent = Math.floor(cur).toLocaleString('en-IN'); }
          }, 20);
          obs.unobserve(el);
        }
      });
    }, { threshold: 0.5 });
    document.querySelectorAll('.count-up').forEach((el) => obs.observe(el));
    return () => obs.disconnect();
  }, []);
};

const Home = () => {
  useReveal();
  useCounters();


  return (
    <main>
      {/* ── Hero ── */}
      <HeroSection />

      {/* ── Marquee ── */}
      <div className="marquee-strip">
        <div className="marquee-track">
          {[...Array(2)].map((_, rep) =>
            ['Weight Training','CrossFit','Fat Loss','Personal Training','Bodybuilding','Strength Training','Yoga & Wellness','Nutrition Plans'].map((item) => (
              <div key={`${rep}-${item}`} className="marquee-item">
                <span className="marquee-dot" />
                {item}
              </div>
            ))
          )}
        </div>
      </div>

      {/* ── Stats ── */}
      <section className="stats-section">
        <div className="stats-grid">
          {[
            { target: 2500, suffix: '+', label: 'Active Members'   },
            { target: 15,   suffix: '+', label: 'Expert Trainers'  },
            { target: 12,   suffix: '',  label: 'Fitness Programs'  },
            { target: 8,    suffix: 'yr',label: 'Years of Excellence'},
          ].map((s) => (
            <div key={s.label} className="stat-card reveal">
              <div className="stat-number">
                <span className="count-up" data-target={s.target}>0</span>
                <span className="stat-suffix">{s.suffix}</span>
              </div>
              <div className="stat-label">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Programs ── */}
      <section className="home-programs" id="programs">
        <div className="section-header reveal">
          <p className="section-tag">What We Offer</p>
          <h2 className="section-title">Our <span className="accent">Programs</span></h2>
          <p className="section-desc">From fat loss to elite bodybuilding — every goal has a program built for it.</p>
          <div className="section-divider" />
        </div>
        <div className="programs-grid">
          {programsData.map((p, i) => (
            <div key={p.id} className={`reveal delay-${(i % 3) + 1}`}>
              <ProgramCard program={p} />
            </div>
          ))}
        </div>
        <div className="section-cta reveal">
          <Link to="/programs" className="btn-secondary">View All Programs →</Link>
        </div>
      </section>

      {/* ── Transformation ── */}
      <section className="transformation-section">
        <div className="transformation-layout">
          <div className="t-text reveal-left">
            <p className="section-tag">Real Results</p>
            <h2 className="section-title">Where <span className="accent">Legends</span> Are Forged</h2>
            <p className="section-desc" style={{ maxWidth: '100%' }}>
              At Titan Fitness Club, transformation isn't a promise — it's a track record. Our members
              achieve life-changing results backed by science, elite coaching, and world-class facilities
              in the heart of Pune.
            </p>
            <div className="t-stats-grid">
              {[
                { num: '98%',  label: 'Goal Achievement Rate' },
                { num: '850+', label: 'Transformations Done'  },
                { num: '4.9★', label: 'Google Rating'         },
                { num: '24/7', label: 'Facility Access'       },
              ].map((s) => (
                <div key={s.label} className="t-stat-card">
                  <div className="t-stat-num">{s.num}</div>
                  <div className="t-stat-label">{s.label}</div>
                </div>
              ))}
            </div>
            <Link to="/contact" className="btn-primary" style={{ marginTop: '30px' }}>
              Start Your Journey
            </Link>
          </div>

          <div className="t-images reveal-right">
            <div className="t-main-img">
              <img src="https://images.unsplash.com/photo-1605296867304-46d5465a13f1?w=700&q=80" alt="Gym Interior" loading="lazy" />
            </div>
            <div className="t-accent-img">
              <img src="https://images.unsplash.com/photo-1581009137042-c552e485697a?w=300&q=80" alt="Training" loading="lazy" />
            </div>
            <div className="t-badge">
              <div className="t-badge-num">8+</div>
              <div className="t-badge-lbl">Years of Excellence</div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Trainers ── */}
      <section className="home-trainers">
        <div className="section-header reveal">
          <p className="section-tag">Meet The Team</p>
          <h2 className="section-title">Elite <span className="accent">Trainers</span></h2>
          <p className="section-desc">Certified coaches who bring competitive experience and genuine care to every session.</p>
          <div className="section-divider" />
        </div>
        <div className="trainers-grid">
          {trainersData.map((t, i) => (
            <div key={t.id} className={`reveal delay-${i + 1}`}>
              <TrainerCard trainer={t} />
            </div>
          ))}
        </div>
        <div className="section-cta reveal">
          <Link to="/trainers" className="btn-secondary">Meet All Trainers →</Link>
        </div>
      </section>

      {/* ── Testimonials ── */}
      <section className="home-testimonials">
        <div className="section-header reveal">
          <p className="section-tag">Success Stories</p>
          <h2 className="section-title">Member <span className="accent">Results</span></h2>
          <div className="section-divider" />
        </div>
        <TestimonialSlider />
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <div className="cta-bg" />
        <div className="cta-content reveal">
          <p className="section-tag" style={{ justifyContent: 'center' }}>Limited Spots Available</p>
          <h2 className="cta-title">
            Your <span className="cta-accent">Strongest</span><br />Version Awaits
          </h2>
          <p className="cta-sub">
            Join 2,500+ members who chose to transform their lives at Titan Fitness Club, Pune.
          </p>
          <div className="hero-btns" style={{ justifyContent: 'center', marginTop: '32px' }}>
            <Link to="/contact"    className="btn-primary">⚡ Claim Free Trial</Link>
            <a href="tel:+919876543210" className="btn-secondary">📞 Call Us Now</a>
          </div>
        </div>
      </section>

      {/* ── Blog Preview ── */}
      <section className="home-blog">
        <div className="section-header reveal">
          <p className="section-tag">Knowledge Hub</p>
          <h2 className="section-title">Fitness <span className="accent">Blog</span></h2>
          <p className="section-desc">Expert advice, science-backed tips, and real stories from the Titan community.</p>
          <div className="section-divider" />
        </div>
        <div className="blog-grid">
          {blogData.slice(0, 3).map((b, i) => (
            <div key={b.id} className={`reveal delay-${i + 1}`}>
              <BlogCard blog={b} />
            </div>
          ))}
        </div>
        <div className="section-cta reveal">
          <Link to="/blog" className="btn-secondary">View All Articles →</Link>
        </div>
      </section>
    </main>
  );
};

export default Home;