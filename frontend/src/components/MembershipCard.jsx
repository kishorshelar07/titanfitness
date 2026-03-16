import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import './MembershipCard.css';

const MembershipCard = ({ plan, isYearly }) => {
  const { showToast } = useApp();
  const navigate = useNavigate();
  const [hovered, setHovered] = useState(false);

  const price = isYearly
    ? Math.round(plan.monthlyPrice * 12 * 0.8).toLocaleString('en-IN')
    : plan.monthlyPrice.toLocaleString('en-IN');

  const handleJoin = () => {
    showToast(`${plan.name} Plan selected! Redirecting...`);
    setTimeout(() => navigate('/contact'), 1200);
  };

  return (
    <div
      className={`membership-card ${plan.featured ? 'featured' : ''} ${hovered ? 'hovered' : ''}`}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {plan.featured && <div className="popular-badge">MOST POPULAR</div>}

      <div className="plan-header">
        <p className="plan-name">{plan.name}</p>
        <p className="plan-tagline">{plan.tagline}</p>
      </div>

      <div className="plan-price-wrap">
        <span className="plan-currency">₹</span>
        <span className="plan-amount">{price}</span>
        <span className="plan-period">/ {isYearly ? 'year' : 'month'}</span>
      </div>

      {isYearly && (
        <div className="yearly-save">Save ₹{Math.round(plan.monthlyPrice * 12 * 0.2).toLocaleString('en-IN')} yearly</div>
      )}

      <div className="plan-divider" />

      <ul className="plan-features">
        {plan.features.map((f) => (
          <li key={f.text} className={`plan-feature ${f.included ? '' : 'inactive'}`}>
            <span className="feature-icon">{f.included ? '✓' : '✗'}</span>
            {f.text}
          </li>
        ))}
      </ul>

      <button className="plan-join-btn" onClick={handleJoin}>
        Get Started
      </button>
    </div>
  );
};

export default MembershipCard;
