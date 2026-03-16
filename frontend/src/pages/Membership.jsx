import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const plansData = [
  {
    id: 1, name: 'Basic', tagline: 'Perfect for getting started',
    monthlyPrice: 1499, featured: false,
    features: [
      { text: 'Full Gym Access',          included: true  },
      { text: 'Locker & Changing Room',   included: true  },
      { text: 'Group Classes (2/week)',   included: true  },
      { text: 'Basic Fitness Assessment', included: true  },
      { text: 'Personal Trainer',         included: false },
      { text: 'Custom Nutrition Plan',    included: false },
      { text: 'Sauna & Spa Access',       included: false },
    ],
  },
  {
    id: 2, name: 'Pro', tagline: 'Most popular for serious results',
    monthlyPrice: 2999, featured: true,
    features: [
      { text: 'Full Gym Access',          included: true  },
      { text: 'Locker & Changing Room',   included: true  },
      { text: 'Unlimited Group Classes',  included: true  },
      { text: '2x Monthly PT Sessions',  included: true  },
      { text: 'Custom Nutrition Plan',    included: true  },
      { text: 'Progress Tracking App',    included: true  },
      { text: 'Sauna & Spa Access',       included: false },
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

// ── Razorpay Checkout ─────────────────────────────────────────────
const loadRazorpayScript = () =>
  new Promise((resolve) => {
    if (document.getElementById('razorpay-script')) return resolve(true);
    const script = document.createElement('script');
    script.id  = 'razorpay-script';
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.onload  = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });

const Membership = () => {
  const { showToast } = useApp();
  const [isYearly,    setIsYearly]    = useState(false);
  const [showModal,   setShowModal]   = useState(false);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [payLoading,  setPayLoading]  = useState(false);
  const [form, setForm] = useState({ memberName: '', email: '', phone: '' });

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const getPrice = (plan) =>
    isYearly ? Math.round(plan.monthlyPrice * 12 * 0.8) : plan.monthlyPrice;

  const handleJoin = (plan) => {
    setSelectedPlan(plan);
    setShowModal(true);
  };

  const handlePayment = async () => {
    if (!form.memberName || !form.email || !form.phone) {
      showToast('Please fill all fields!', 'error');
      return;
    }

    setPayLoading(true);

    // Razorpay script load करा
    const loaded = await loadRazorpayScript();
    if (!loaded) {
      showToast('Razorpay failed to load. Check internet connection.', 'error');
      setPayLoading(false);
      return;
    }

    try {
      const amount = getPrice(selectedPlan);

      // Backend ला order create करायला सांगा
      const res = await fetch(`${API_URL}/payment/create-order`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount,
          plan:         selectedPlan.name,
          billingCycle: isYearly ? 'yearly' : 'monthly',
        }),
      });

      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      // Razorpay Checkout उघडा
      const options = {
        key:         data.keyId,
        amount:      data.amount,
        currency:    data.currency,
        name:        'Titan Fitness Club',
        description: `${selectedPlan.name} Plan - ${isYearly ? 'Yearly' : 'Monthly'}`,
        order_id:    data.orderId,
        prefill: {
          name:    form.memberName,
          email:   form.email,
          contact: form.phone,
        },
        theme: { color: '#ff4d00' },
        handler: async (response) => {
          // Payment successful — verify करा
          const verifyRes = await fetch(`${API_URL}/payment/verify`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              razorpay_order_id:   response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature:  response.razorpay_signature,
              memberName:          form.memberName,
              email:               form.email,
              phone:               form.phone,
              plan:                selectedPlan.name,
              billingCycle:        isYearly ? 'yearly' : 'monthly',
              amount,
            }),
          });

          const verifyData = await verifyRes.json();

          if (verifyData.success) {
            showToast('Payment Successful! Welcome to Titan! 🎉');
            setShowModal(false);
            setForm({ memberName: '', email: '', phone: '' });
          } else {
            showToast('Payment verification failed!', 'error');
          }
        },
        modal: {
          ondismiss: () => {
            showToast('Payment cancelled', 'error');
            setPayLoading(false);
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (err) {
      showToast(err.message || 'Payment failed', 'error');
    } finally {
      setPayLoading(false);
    }
  };

  const inp = { width: '100%', background: 'var(--dark3)', border: 'var(--border-dim)', color: 'var(--white)', padding: '14px 18px', fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none', marginBottom: '16px', display: 'block' };
  const lbl = { display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '3px', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '8px' };

  return (
    <main>
      {/* Hero */}
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="section-tag">Invest In Yourself</p>
          <h1 className="page-hero-title">
            Membership{' '}
            <span style={{ background: 'var(--gradient-fire)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Plans</span>
          </h1>
        </div>
      </div>

      <section style={{ padding: 'var(--section-padding)', background: 'var(--dark2)' }}>
        <div className="section-header reveal" style={{ marginBottom: '50px' }}>
          <p className="section-tag">Choose Your Plan</p>
          <h2 className="section-title">Simple, <span className="accent">Transparent</span> Pricing</h2>
          <p className="section-desc">No hidden fees. No lock-in contracts. Secure online payment via Razorpay.</p>
          <div className="section-divider" />
        </div>

        {/* Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '50px', fontFamily: 'var(--font-mono)', fontSize: '0.72rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gray)' }} className="reveal">
          <span style={{ color: !isYearly ? 'var(--orange)' : 'var(--gray)' }}>Monthly</span>
          <div onClick={() => setIsYearly(!isYearly)} style={{ width: '50px', height: '26px', background: isYearly ? 'rgba(255,77,0,0.2)' : 'var(--dark3)', border: 'var(--border-orange)', borderRadius: '13px', position: 'relative', cursor: 'pointer', transition: 'var(--transition)' }}>
            <div style={{ position: 'absolute', top: '3px', left: isYearly ? '27px' : '3px', width: '20px', height: '20px', background: 'var(--orange)', borderRadius: '50%', transition: 'var(--transition)' }} />
          </div>
          <span style={{ color: isYearly ? 'var(--orange)' : 'var(--gray)' }}>
            Yearly <span style={{ background: 'rgba(255,77,0,0.15)', color: 'var(--orange)', padding: '2px 8px', fontSize: '0.62rem', marginLeft: '6px' }}>SAVE 20%</span>
          </span>
        </div>

        {/* Plans Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
          {plansData.map((plan, i) => (
            <div key={plan.id}
              className={`reveal delay-${i + 1}`}
              style={{
                background: plan.featured ? 'var(--dark3)' : 'var(--panel)',
                border: plan.featured ? '1px solid rgba(255,77,0,0.5)' : 'var(--border-dim)',
                padding: '48px 36px', position: 'relative', overflow: 'hidden',
                transition: 'var(--transition)',
              }}
              onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-8px)'; e.currentTarget.style.boxShadow = '0 30px 80px rgba(0,0,0,0.5), var(--glow-orange)'; }}
              onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = ''; }}
            >
              {plan.featured && (
                <div style={{ position: 'absolute', top: '22px', right: '-34px', background: 'var(--gradient-fire)', fontFamily: 'var(--font-mono)', fontSize: '0.52rem', letterSpacing: '3px', color: 'white', padding: '6px 50px', transform: 'rotate(45deg)' }}>
                  MOST POPULAR
                </div>
              )}

              <p style={{ fontFamily: 'var(--font-display)', fontSize: '0.95rem', fontWeight: 600, letterSpacing: '5px', textTransform: 'uppercase', color: 'var(--gray)', marginBottom: '24px' }}>{plan.name}</p>

              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '2px', marginBottom: '6px' }}>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.3rem', color: 'var(--orange)', lineHeight: 1.8 }}>Rs.</span>
                <span style={{ fontFamily: 'var(--font-display)', fontSize: '4rem', fontWeight: 700, lineHeight: 1, color: 'var(--white)' }}>{getPrice(plan).toLocaleString('en-IN')}</span>
              </div>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--gray)', textTransform: 'uppercase', marginBottom: isYearly ? '8px' : '0' }}>
                / {isYearly ? 'year' : 'month'}
              </p>
              {isYearly && (
                <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '2px', textTransform: 'uppercase', color: 'var(--gold2)', background: 'rgba(232,184,75,0.1)', border: '1px solid rgba(232,184,75,0.25)', display: 'inline-block', padding: '4px 10px', marginBottom: '4px' }}>
                  Save Rs.{Math.round(plan.monthlyPrice * 12 * 0.2).toLocaleString('en-IN')}
                </div>
              )}

              <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: '28px 0' }} />

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '13px', marginBottom: '34px' }}>
                {plan.features.map((f) => (
                  <li key={f.text} style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.95rem', color: f.included ? 'var(--white2)' : 'var(--gray)', textDecoration: f.included ? 'none' : 'line-through' }}>
                    <span style={{ width: '20px', height: '20px', background: f.included ? 'rgba(255,77,0,0.12)' : 'rgba(107,101,96,0.1)', border: f.included ? '1px solid rgba(255,77,0,0.28)' : '1px solid rgba(107,101,96,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.62rem', color: f.included ? 'var(--orange)' : 'var(--gray)', flexShrink: 0 }}>
                      {f.included ? '✓' : '✗'}
                    </span>
                    {f.text}
                  </li>
                ))}
              </ul>

              <button
                onClick={() => handleJoin(plan)}
                style={{
                  width: '100%', fontFamily: 'var(--font-display)', fontSize: '0.85rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase', padding: '16px',
                  background: plan.featured ? 'var(--gradient-fire)' : 'transparent',
                  color: plan.featured ? 'white' : 'var(--orange)',
                  border: plan.featured ? 'none' : '1px solid rgba(255,77,0,0.4)',
                  cursor: 'pointer', transition: 'var(--transition)',
                  boxShadow: plan.featured ? 'var(--glow-orange)' : 'none',
                }}
                onMouseEnter={e => { if (!plan.featured) { e.currentTarget.style.background = 'var(--gradient-fire)'; e.currentTarget.style.color = 'white'; e.currentTarget.style.borderColor = 'transparent'; } }}
                onMouseLeave={e => { if (!plan.featured) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--orange)'; e.currentTarget.style.borderColor = 'rgba(255,77,0,0.4)'; } }}
              >
                Pay with Razorpay ⚡
              </button>
            </div>
          ))}
        </div>

        {/* Razorpay Badge */}
        <div className="reveal" style={{ textAlign: 'center', marginTop: '30px' }}>
          <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--gray)', textTransform: 'uppercase' }}>
            🔒 Secure Payment via Razorpay · UPI · Cards · Net Banking · Wallets
          </p>
        </div>

        {/* FAQ */}
        <div style={{ marginTop: '80px' }}>
          <h3 className="section-title reveal" style={{ textAlign: 'center', marginBottom: '40px' }}>
            Frequently Asked <span className="accent">Questions</span>
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2px', maxWidth: '900px', margin: '0 auto' }}>
            {[
              ['Can I cancel anytime?',        'Yes. No lock-in contracts. Cancel with 7 days notice.'],
              ['Is there a joining fee?',       'No joining fee for the first month with our current offer.'],
              ['Can I upgrade my plan?',        'Absolutely. Upgrade or downgrade at any time.'],
              ['Is payment secure?',            'Yes! We use Razorpay — India\'s most trusted payment gateway.'],
            ].map(([q, a], i) => (
              <div key={i} className={`reveal delay-${i + 1}`} style={{ background: 'var(--panel)', border: 'var(--border-dim)', padding: '28px' }}>
                <p style={{ fontFamily: 'var(--font-display)', fontSize: '1rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px', color: 'var(--orange)' }}>{q}</p>
                <p style={{ color: 'var(--white2)', fontSize: '0.92rem', lineHeight: 1.7 }}>{a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Payment Modal ── */}
      {showModal && selectedPlan && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.9)', zIndex: 9000, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '20px' }}
          onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div style={{ background: 'var(--dark2)', border: 'var(--border-orange)', padding: '50px 44px', width: '100%', maxWidth: '480px', position: 'relative' }}>

            {/* Close */}
            <button onClick={() => setShowModal(false)} style={{ position: 'absolute', top: '20px', right: '20px', background: 'none', border: 'var(--border-dim)', color: 'var(--white2)', width: '36px', height: '36px', cursor: 'pointer', fontSize: '1rem' }}>✕</button>

            {/* Header */}
            <div style={{ marginBottom: '30px' }}>
              <p style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '3px', color: 'var(--orange)', textTransform: 'uppercase', marginBottom: '8px' }}>Enrolling In</p>
              <h2 style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '4px' }}>{selectedPlan.name} Plan</h2>
              <p style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--orange)', fontWeight: 700 }}>
                Rs. {getPrice(selectedPlan).toLocaleString('en-IN')}
                <span style={{ fontSize: '0.75rem', color: 'var(--gray)', fontWeight: 400, marginLeft: '8px', fontFamily: 'var(--font-mono)', letterSpacing: '2px' }}>/ {isYearly ? 'year' : 'month'}</span>
              </p>
            </div>

            <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', marginBottom: '30px' }} />

            {/* Form */}
            <div>
              <label style={lbl}>Full Name</label>
              <input style={inp} value={form.memberName} onChange={e => setForm({ ...form, memberName: e.target.value })} placeholder="Rahul Mehta" />

              <label style={lbl}>Email Address</label>
              <input style={inp} type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="rahul@email.com" />

              <label style={lbl}>Phone Number</label>
              <input style={inp} type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })} placeholder="+91 98765 43210" />
            </div>

            {/* Pay Button */}
            <button
              onClick={handlePayment}
              disabled={payLoading}
              style={{
                width: '100%', fontFamily: 'var(--font-display)', fontSize: '0.9rem', fontWeight: 600, letterSpacing: '3px', textTransform: 'uppercase',
                padding: '18px', background: 'var(--gradient-fire)', color: 'white', border: 'none', cursor: payLoading ? 'not-allowed' : 'pointer',
                transition: 'var(--transition)', boxShadow: 'var(--glow-orange)', opacity: payLoading ? 0.7 : 1,
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '10px',
              }}
            >
              {payLoading ? (
                <><span style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 0.8s linear infinite', display: 'inline-block' }} /> Processing...</>
              ) : (
                <>Pay Rs. {getPrice(selectedPlan).toLocaleString('en-IN')} via Razorpay</>
              )}
            </button>

            <p style={{ textAlign: 'center', fontFamily: 'var(--font-mono)', fontSize: '0.6rem', letterSpacing: '2px', color: 'var(--gray)', textTransform: 'uppercase', marginTop: '16px' }}>
              🔒 Secured by Razorpay · UPI · Cards · Net Banking
            </p>
          </div>
        </div>
      )}
    </main>
  );
};

export default Membership;
