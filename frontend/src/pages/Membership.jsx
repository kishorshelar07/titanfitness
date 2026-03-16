import { useEffect, useState } from 'react';
import MembershipCard from '../components/MembershipCard';
import { Link } from 'react-router-dom';

const plansData = [
  {
    id: 1, name: 'Basic', tagline: 'Perfect for getting started',
    monthlyPrice: 1499, featured: false,
    features: [
      { text: 'Full Gym Access',           included: true  },
      { text: 'Locker & Changing Room',    included: true  },
      { text: 'Group Classes (2/week)',    included: true  },
      { text: 'Basic Fitness Assessment',  included: true  },
      { text: 'Personal Trainer',          included: false },
      { text: 'Custom Nutrition Plan',     included: false },
      { text: 'Sauna & Spa Access',        included: false },
    ],
  },
  {
    id: 2, name: 'Pro', tagline: 'Most popular for serious results',
    monthlyPrice: 2999, featured: true,
    features: [
      { text: 'Full Gym Access',           included: true  },
      { text: 'Locker & Changing Room',    included: true  },
      { text: 'Unlimited Group Classes',   included: true  },
      { text: '2× Monthly PT Sessions',   included: true  },
      { text: 'Custom Nutrition Plan',     included: true  },
      { text: 'Progress Tracking App',     included: true  },
      { text: 'Sauna & Spa Access',        included: false },
    ],
  },
  {
    id: 3, name: 'Elite', tagline: 'The complete transformation package',
    monthlyPrice: 4999, featured: false,
    features: [
      { text: 'Full Gym Access',           included: true },
      { text: 'Premium Locker Room',       included: true },
      { text: 'Unlimited Group Classes',   included: true },
      { text: 'Unlimited PT Sessions',     included: true },
      { text: 'Full Nutrition Program',    included: true },
      { text: 'Body Composition Analysis', included: true },
      { text: 'Sauna & Spa Access',        included: true },
    ],
  },
];

const Membership = () => {
  const [isYearly, setIsYearly] = useState(false);

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
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="section-tag">Invest In Yourself</p>
          <h1 className="page-hero-title">Membership <span style={{ background:'var(--gradient-fire)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>Plans</span></h1>
        </div>
      </div>

      <section style={{ padding:'var(--section-padding)', background:'var(--dark2)' }}>
        <div className="section-header reveal" style={{ marginBottom:'50px' }}>
          <p className="section-tag">Choose Your Plan</p>
          <h2 className="section-title">Simple, <span className="accent">Transparent</span> Pricing</h2>
          <p className="section-desc">No hidden fees. No lock-in contracts. Just premium fitness at the right price.</p>
          <div className="section-divider" />
        </div>

        {/* Toggle */}
        <div style={{ display:'flex', alignItems:'center', gap:'16px', marginBottom:'50px', fontFamily:'var(--font-mono)', fontSize:'0.72rem', letterSpacing:'2px', textTransform:'uppercase', color:'var(--gray)' }} className="reveal">
          <span style={{ color: !isYearly ? 'var(--orange)' : 'var(--gray)' }}>Monthly</span>
          <div
            onClick={() => setIsYearly(!isYearly)}
            style={{
              width:'50px', height:'26px', background: isYearly ? 'rgba(255,77,0,0.2)' : 'var(--dark3)',
              border:'var(--border-orange)', borderRadius:'13px', position:'relative', cursor:'pointer', transition:'var(--transition)'
            }}
          >
            <div style={{
              position:'absolute', top:'3px', left: isYearly ? '27px' : '3px',
              width:'20px', height:'20px', background:'var(--orange)', borderRadius:'50%', transition:'var(--transition)'
            }} />
          </div>
          <span style={{ color: isYearly ? 'var(--orange)' : 'var(--gray)' }}>
            Yearly &nbsp;
            <span style={{ background:'rgba(255,77,0,0.15)', color:'var(--orange)', padding:'2px 8px', fontSize:'0.62rem' }}>SAVE 20%</span>
          </span>
        </div>

        <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2px' }}>
          {plansData.map((plan, i) => (
            <div key={plan.id} className={`reveal delay-${i+1}`}>
              <MembershipCard plan={plan} isYearly={isYearly} />
            </div>
          ))}
        </div>

        {/* FAQ */}
        <div style={{ marginTop:'80px' }}>
          <h3 className="section-title reveal" style={{ textAlign:'center', marginBottom:'40px' }}>
            Frequently Asked <span className="accent">Questions</span>
          </h3>
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2px', maxWidth:'900px', margin:'0 auto' }}>
            {[
              ['Can I cancel anytime?', 'Yes. There are no lock-in contracts. Cancel at any time with 7 days notice.'],
              ['Is there a joining fee?', 'No joining fee for the first month with our current offer.'],
              ['Can I upgrade my plan?', 'Absolutely. You can upgrade or downgrade your plan at any time.'],
              ['Do you offer student discounts?', 'Yes! Students get 15% off any plan with valid ID. Contact us for details.'],
            ].map(([q, a], i) => (
              <div key={i} className={`reveal delay-${i+1}`} style={{ background:'var(--panel)', border:'var(--border-dim)', padding:'28px' }}>
                <p style={{ fontFamily:'var(--font-display)', fontSize:'1rem', fontWeight:600, textTransform:'uppercase', letterSpacing:'1px', marginBottom:'10px', color:'var(--orange)' }}>{q}</p>
                <p style={{ color:'var(--white2)', fontSize:'0.92rem', lineHeight:1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
};

export default Membership;
