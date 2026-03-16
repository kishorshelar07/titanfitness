import './TrainerCard.css';

const TrainerCard = ({ trainer }) => (
  <div className="trainer-card">
    <div className="trainer-img-wrap">
      <img src={trainer.photo} alt={trainer.name} loading="lazy" />
      <div className="trainer-img-overlay" />
      <div className="trainer-socials">
        {trainer.socialLinks?.instagram && (
          <a href={trainer.socialLinks.instagram} target="_blank" rel="noreferrer" className="t-social">ig</a>
        )}
        {trainer.socialLinks?.youtube && (
          <a href={trainer.socialLinks.youtube} target="_blank" rel="noreferrer" className="t-social">yt</a>
        )}
        {trainer.socialLinks?.linkedin && (
          <a href={trainer.socialLinks.linkedin} target="_blank" rel="noreferrer" className="t-social">in</a>
        )}
      </div>
    </div>
    <div className="trainer-info">
      <div className="trainer-spec">{trainer.specialization}</div>
      <h3 className="trainer-name">{trainer.name}</h3>
      <p className="trainer-exp">⚡ {trainer.experience} Years Experience</p>
      {trainer.certifications?.length > 0 && (
        <div className="trainer-certs">
          {trainer.certifications.slice(0, 2).map((c) => (
            <span key={c} className="cert-tag">{c}</span>
          ))}
        </div>
      )}
    </div>
  </div>
);

export default TrainerCard;
