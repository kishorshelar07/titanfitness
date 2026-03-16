import { useEffect } from 'react';
import ContactForm from '../components/ContactForm';

const Contact = () => {
  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal, .reveal-left, .reveal-right').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const contactDetails = [
    { icon: '📍', label: 'Address',  value: 'FC Road, Shivajinagar, Pune 411005, Maharashtra' },
    { icon: '📞', label: 'Phone',    value: '+91 98765 43210',      href: 'tel:+919876543210'           },
    { icon: '✉️', label: 'Email',    value: 'info@titanfitness.com', href: 'mailto:info@titanfitness.com' },
    { icon: '🕐', label: 'Hours',    value: 'Mon–Sat: 5:30 AM – 10:30 PM | Sun: 7:00 AM – 8:00 PM'      },
  ];

  return (
    <main>
      {/* Page Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="section-tag">Get In Touch</p>
          <h1 className="page-hero-title">
            Contact{' '}
            <span style={{ background: 'var(--gradient-fire)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Us</span>
          </h1>
        </div>
      </div>

      {/* Contact Layout */}
      <section style={{ padding: 'var(--section-padding)', background: 'var(--black)' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.4fr', gap: '80px' }}>

          {/* Left: Info */}
          <div className="reveal-left">
            <p className="section-tag">Reach Out</p>
            <h2 className="section-title" style={{ marginBottom: '16px' }}>Let's <span className="accent">Talk</span></h2>
            <p className="section-desc" style={{ maxWidth: '100%', marginBottom: '40px' }}>
              Ready to begin your transformation? Our team will respond within 24 hours. Walk-ins welcome during gym hours.
            </p>
            <div className="section-divider" style={{ marginBottom: '40px' }} />

            {contactDetails.map((d) => (
              <div key={d.label} style={{ display: 'flex', gap: '18px', marginBottom: '32px' }}>
                <div style={{
                  width: '50px', height: '50px', flexShrink: 0,
                  background: 'rgba(255,77,0,0.1)', border: 'var(--border-orange)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: '1.2rem'
                }}>{d.icon}</div>
                <div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '3px', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '4px' }}>{d.label}</div>
                  {d.href
                    ? <a href={d.href} style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 500, color: 'var(--white)', textDecoration: 'none', transition: 'var(--transition)' }}
                        onMouseEnter={e => e.target.style.color = 'var(--orange)'}
                        onMouseLeave={e => e.target.style.color = 'var(--white)'}
                      >{d.value}</a>
                    : <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 400, color: 'var(--white2)' }}>{d.value}</div>
                  }
                </div>
              </div>
            ))}

            {/* Google Map */}
            <div style={{ height: '220px', border: 'var(--border-dim)', overflow: 'hidden', marginTop: '10px' }}>
              <iframe
                title="Titan Fitness Club Location"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.553060718713!2d73.84348561489!3d18.52042878739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c07f4e2eabc9%3A0x4e0b2e6e5bdf6c5!2sShivajinagar%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
                width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.7)' }}
                allowFullScreen loading="lazy"
              />
            </div>

            {/* WhatsApp Quick Contact */}
            <a
              href="https://wa.me/919876543210?text=Hi%20Titan%20Fitness!%20I'm%20interested%20in%20joining."
              target="_blank" rel="noreferrer"
              style={{
                display: 'flex', alignItems: 'center', gap: '14px',
                marginTop: '24px', padding: '18px 24px',
                background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.3)',
                textDecoration: 'none', transition: 'var(--transition)'
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(37,211,102,0.2)'}
              onMouseLeave={e => e.currentTarget.style.background = 'rgba(37,211,102,0.1)'}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="#25d366">
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
              </svg>
              <div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', color: '#25d366' }}>Chat on WhatsApp</div>
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.6rem', color: 'var(--gray)', textTransform: 'uppercase', letterSpacing: '1px' }}>Instant reply during gym hours</div>
              </div>
            </a>
          </div>

          {/* Right: Form */}
          <div className="reveal-right">
            <div style={{ background: 'var(--panel)', border: 'var(--border-dim)', padding: '50px 44px' }}>
              <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '1.6rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '8px' }}>
                Send a Message
              </h3>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '3px', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '36px' }}>
                We'll reply within 24 hours
              </p>
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Full Width */}
      <div style={{ height: '400px', position: 'relative' }}>
        <iframe
          title="Titan Fitness Full Map"
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3782.553060718713!2d73.84348561489!3d18.52042878739!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bc2c07f4e2eabc9%3A0x4e0b2e6e5bdf6c5!2sShivajinagar%2C%20Pune%2C%20Maharashtra!5e0!3m2!1sen!2sin!4v1234567890"
          width="100%" height="100%" style={{ border: 0, filter: 'invert(90%) hue-rotate(180deg) saturate(0.7)', display: 'block' }}
          allowFullScreen loading="lazy"
        />
        <div style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%)', background: 'var(--orange)', padding: '10px 20px', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', pointerEvents: 'none', boxShadow: 'var(--glow-orange)' }}>
          📍 Titan Fitness Club
        </div>
      </div>
    </main>
  );
};

export default Contact;
