import { useApp } from '../context/AppContext';
import './ProgramCard.css';

const ProgramCard = ({ program }) => {
  const { showToast } = useApp();

  return (
    <div className="program-card">
      <img src={program.image} alt={program.title} loading="lazy" />
      <div className="program-overlay" />
      <div className="program-content">
        <div className="program-number">{program.number} / 06</div>
        <h3 className="program-name">{program.title}</h3>
        <p className="program-desc">{program.description}</p>
        <div className="program-meta">
          <span>Duration: <strong>{program.duration}</strong></span>
          <span>From: <strong>₹{program.price.toLocaleString('en-IN')}</strong></span>
        </div>
        <div className="program-level">
          <span className={`level-badge level-${program.level?.toLowerCase().replace(' ', '-')}`}>
            {program.level}
          </span>
        </div>
        <button
          className="program-enroll-btn"
          onClick={() => showToast(`${program.title} — Enquiry sent! We'll contact you.`)}
        >
          Enroll Now →
        </button>
      </div>
    </div>
  );
};

export default ProgramCard;
