import { useState } from 'react';
import { galleryData, galleryCategories } from '../data/galleryData';
import './GalleryGrid.css';

const GalleryGrid = () => {
  const [active,    setActive]    = useState('All');
  const [lightbox,  setLightbox]  = useState(null);

  const filtered = active === 'All'
    ? galleryData
    : galleryData.filter((g) => g.category === active);

  return (
    <>
      {/* Filter Tabs */}
      <div className="gallery-filters">
        {galleryCategories.map((cat) => (
          <button
            key={cat}
            className={`filter-btn ${active === cat ? 'active' : ''}`}
            onClick={() => setActive(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="gallery-grid">
        {filtered.map((item, i) => (
          <div
            key={item.id}
            className={`gallery-item ${i === 2 || i === 6 ? 'wide' : ''}`}
            onClick={() => setLightbox(item)}
          >
            <img src={item.image} alt={item.title} loading="lazy" />
            <div className="gallery-hover">
              <div className="gallery-zoom">⊕</div>
              {item.title && <p className="gallery-title">{item.title}</p>}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="lightbox-overlay" onClick={() => setLightbox(null)}>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img src={lightbox.image} alt={lightbox.title} />
            {lightbox.title && (
              <div className="lightbox-caption">
                <span>{lightbox.title}</span>
                <span className="lb-cat">{lightbox.category}</span>
              </div>
            )}
          </div>
          <button className="lightbox-close" onClick={() => setLightbox(null)}>✕</button>
        </div>
      )}
    </>
  );
};

export default GalleryGrid;
