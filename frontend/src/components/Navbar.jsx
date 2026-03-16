import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import './Navbar.css';

const Navbar = () => {
  const [scrolled,    setScrolled]    = useState(false);
  const [menuOpen,    setMenuOpen]    = useState(false);
  const [scrollPct,   setScrollPct]   = useState(0);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => {
      const scrollTop  = window.scrollY;
      const docHeight  = document.documentElement.scrollHeight - window.innerHeight;
      setScrolled(scrollTop > 80);
      setScrollPct((scrollTop / docHeight) * 100);
    };
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close menu on route change
  useEffect(() => setMenuOpen(false), [location]);

  const navLinks = [
    { path: '/',            label: 'Home'       },
    { path: '/about',       label: 'About'      },
    { path: '/programs',    label: 'Programs'   },
    { path: '/trainers',    label: 'Trainers'   },
    { path: '/membership',  label: 'Membership' },
    { path: '/gallery',     label: 'Gallery'    },
    { path: '/blog',        label: 'Blog'       },
    { path: '/contact',     label: 'Contact'    },
  ];

  return (
    <>
      {/* Scroll Progress */}
      <div className="scroll-progress" style={{ width: `${scrollPct}%` }} />

      <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        {/* Logo */}
        <Link to="/" className="nav-logo">
          <div className="nav-logo-icon">T</div>
          <div className="nav-logo-text">
            Titan
            <span>Fitness Club · Pune</span>
          </div>
        </Link>

        {/* Desktop Links */}
        <ul className="nav-links">
          {navLinks.map((l) => (
            <li key={l.path}>
              <Link
                to={l.path}
                className={`nav-link ${location.pathname === l.path ? 'active' : ''}`}
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>

        {/* CTA */}
        <Link to="/membership" className="nav-cta">Join Now</Link>

        {/* Hamburger */}
        <button
          className={`hamburger ${menuOpen ? 'active' : ''}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Mobile Menu */}
      <div className={`mobile-menu ${menuOpen ? 'open' : ''}`}>
        {navLinks.map((l) => (
          <Link key={l.path} to={l.path} className="mobile-link">
            {l.label}
          </Link>
        ))}
        <Link to="/membership" className="btn-primary" style={{ marginTop: '20px', textAlign: 'center', justifyContent: 'center' }}>
          ⚡ Join Now
        </Link>
      </div>

      {/* Overlay */}
      {menuOpen && (
        <div className="menu-overlay" onClick={() => setMenuOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
