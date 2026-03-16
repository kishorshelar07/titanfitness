import { useEffect, useState } from 'react';
import './Loader.css';

const Loader = () => {
  const [hide, setHide] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setHide(true), 2200);
    return () => clearTimeout(timer);
  }, []);

  if (hide) return null;

  return (
    <div className="loader-overlay">
      <div className="loader-logo">TITAN</div>
      <div className="loader-bar">
        <div className="loader-bar-inner" />
      </div>
      <p className="loader-text">INITIALIZING...</p>
    </div>
  );
};

export default Loader;
