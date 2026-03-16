import { Link } from 'react-router-dom';
import './Footer.css';

const Footer = () => {
  const year = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-grid">
        {/* Brand */}
        <div className="footer-brand">
          <Link to="/" className="footer-logo">
            <div className="nav-logo-icon">T</div>
            <div className="nav-logo-text">
              Titan Fitness Club
              <span>Pune, Maharashtra · Est. 2017</span>
            </div>
          </Link>
          <p className="footer-desc">
            Pune's most trusted premium fitness destination. We exist to help you
            build strength, transform your body, and elevate every dimension of your life.
          </p>
          <div className="footer-socials">
            {['ig','fb','yt','tw'].map((s) => (
              <a key={s} href="https://instagram.com" target="_blank" rel="noreferrer" className="social-btn">{s}</a>
            ))}
          </div>
        </div>

        {/* Quick Links */}
        <div>
          <h4 className="footer-heading">Quick Links</h4>
          <ul className="footer-links">
            {[['/','/about','Programs','/programs'],
              ['/trainers','/membership','/gallery','/blog'],
              ['/contact','/testimonials','','']]
              .flat()
              .filter(Boolean)
              .map((path, i) => {
                const labels = ['Home','About','Programs','Trainers','Membership','Gallery','Blog','Contact','Testimonials'];
                return labels[i] ? (
                  <li key={i}><Link to={path}>{labels[i]}</Link></li>
                ) : null;
              })}
          </ul>
        </div>

        {/* Programs */}
        <div>
          <h4 className="footer-heading">Programs</h4>
          <ul className="footer-links">
            {['Weight Training','CrossFit','Fat Loss','Strength Training','Personal Training','Bodybuilding','Yoga & Wellness'].map(p => (
              <li key={p}><Link to="/programs">{p}</Link></li>
            ))}
          </ul>
        </div>

        {/* Hours */}
        <div>
          <h4 className="footer-heading">Gym Hours</h4>
          <div className="footer-schedule">
            {[
              ['Mon – Friday', '5:30 AM – 10:30 PM'],
              ['Saturday',     '6:00 AM – 9:00 PM'],
              ['Sunday',       '7:00 AM – 8:00 PM'],
              ['Public Holiday','8:00 AM – 6:00 PM'],
            ].map(([day, time]) => (
              <div key={day} className="schedule-item">
                <span>{day}</span>
                <span className="time">{time}</span>
              </div>
            ))}
          </div>
          <div className="footer-contact">
            <a href="tel:+919876543210">+91 98765 43210</a>
            <a href="mailto:info@titanfitness.com">info@titanfitness.com</a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {year} Titan Fitness Club, Pune. All Rights Reserved.</span>
        <span>Build Strength · Transform Life</span>
        <span>Privacy Policy · Terms of Use</span>
      </div>
    </footer>
  );
};

export default Footer;
