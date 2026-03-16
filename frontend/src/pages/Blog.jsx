import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import BlogCard from '../components/BlogCard';
import { blogData } from '../data/blogData';

/* ── Blog List ── */
export const Blog = () => {
  const [filter, setFilter] = useState('All');
  const cats = ['All', 'Workout', 'Nutrition', 'Mindset', 'Lifestyle'];
  const filtered = filter === 'All' ? blogData : blogData.filter(b => b.category === filter);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('revealed'); obs.unobserve(e.target); } }),
      { threshold: 0.1 }
    );
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [filter]);

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1549576490-b0b4831ef60a?w=1920&q=80')" }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="section-tag">Knowledge Hub</p>
          <h1 className="page-hero-title">
            Fitness{' '}
            <span style={{ background: 'var(--gradient-fire)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Blog</span>
          </h1>
        </div>
      </div>

      <section style={{ padding: 'var(--section-padding)', background: 'var(--dark2)' }}>
        <div className="section-header reveal" style={{ marginBottom: '50px' }}>
          <p className="section-tag">Expert Articles</p>
          <h2 className="section-title">Tips, Science &amp; <span className="accent">Stories</span></h2>
          <p className="section-desc">Expert advice, science-backed tips, and real stories from the Titan community.</p>
          <div className="section-divider" />
        </div>

        {/* Filter */}
        <div style={{ display: 'flex', gap: '2px', flexWrap: 'wrap', marginBottom: '50px' }} className="reveal">
          {cats.map(c => (
            <button key={c}
              onClick={() => setFilter(c)}
              style={{
                fontFamily: 'var(--font-display)', fontSize: '0.75rem', letterSpacing: '2px',
                textTransform: 'uppercase', padding: '10px 22px',
                background: filter === c ? 'var(--orange)' : 'var(--panel)',
                color: filter === c ? 'white' : 'var(--gray)',
                border: 'var(--border-dim)', cursor: 'pointer', transition: 'var(--transition)'
              }}
            >{c}</button>
          ))}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
          {filtered.map((b, i) => (
            <div key={b.id} className={`reveal delay-${(i % 3) + 1}`}>
              <BlogCard blog={b} />
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter CTA */}
      <section style={{ padding: '80px 6%', background: 'var(--black)' }}>
        <div className="reveal" style={{
          background: 'var(--panel)', border: 'var(--border-orange)',
          padding: '60px', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: '40px', flexWrap: 'wrap'
        }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '10px' }}>
              Get Weekly <span className="accent">Fitness Tips</span>
            </h3>
            <p style={{ color: 'var(--white2)', fontSize: '0.95rem' }}>Join 5,000+ subscribers getting free expert fitness advice.</p>
          </div>
          <div style={{ display: 'flex', gap: '0' }}>
            <input
              type="email" placeholder="your@email.com"
              style={{ background: 'var(--dark3)', border: 'var(--border-dim)', borderRight: 'none', padding: '14px 20px', color: 'var(--white)', fontFamily: 'var(--font-body)', fontSize: '0.95rem', outline: 'none', width: '280px' }}
            />
            <button className="btn-primary" style={{ clipPath: 'none', borderRadius: '0' }}>Subscribe</button>
          </div>
        </div>
      </section>
    </main>
  );
};

/* ── Blog Single Post ── */
export const BlogPost = () => {
  const { slug } = useParams();
  const post = blogData.find(b => b.slug === slug);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  if (!post) return (
    <div style={{ padding: '200px 6%', textAlign: 'center' }}>
      <h2 className="section-title">Post <span className="accent">Not Found</span></h2>
      <Link to="/blog" className="btn-primary" style={{ marginTop: '30px', display: 'inline-flex' }}>← Back to Blog</Link>
    </div>
  );

  return (
    <main>
      <div className="page-hero">
        <div className="page-hero-bg" style={{ backgroundImage: `url(${post.image})` }} />
        <div className="page-hero-overlay" />
        <div className="page-hero-content">
          <p className="section-tag">{post.category} · {post.readTime}</p>
          <h1 className="page-hero-title" style={{ fontSize: 'clamp(2rem,5vw,4rem)', maxWidth: '800px', lineHeight: 1.1 }}>{post.title}</h1>
        </div>
      </div>

      <section style={{ padding: 'var(--section-padding)', background: 'var(--black)' }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <div style={{ display: 'flex', gap: '16px', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--gray)', textTransform: 'uppercase' }}>By {post.author}</span>
            <span style={{ color: 'var(--orange)' }}>·</span>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--gray)', textTransform: 'uppercase' }}>{post.date}</span>
          </div>
          <p style={{ fontSize: '1.15rem', color: 'var(--white2)', lineHeight: 1.9, marginBottom: '30px' }}>{post.excerpt}</p>
          <p style={{ fontSize: '1rem', color: 'var(--gray)', lineHeight: 1.9 }}>
            Full article content would be rendered here from the database. This is a placeholder for the complete blog post content which would include multiple sections, images, and formatting.
          </p>
          <div style={{ marginTop: '50px', paddingTop: '40px', borderTop: 'var(--border-dim)', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
            {post.tags?.map(tag => (
              <span key={tag} style={{ fontFamily: 'var(--font-mono)', fontSize: '0.62rem', letterSpacing: '2px', textTransform: 'uppercase', padding: '5px 14px', background: 'rgba(255,77,0,0.1)', border: '1px solid rgba(255,77,0,0.25)', color: 'var(--orange)' }}>#{tag}</span>
            ))}
          </div>
          <div style={{ marginTop: '50px' }}>
            <Link to="/blog" style={{ fontFamily: 'var(--font-mono)', fontSize: '0.65rem', letterSpacing: '2px', color: 'var(--orange)', textTransform: 'uppercase', textDecoration: 'none' }}>← Back to Blog</Link>
          </div>
        </div>
      </section>

      {/* Related Posts */}
      <section style={{ padding: '80px 6%', background: 'var(--dark2)' }}>
        <h3 className="section-title" style={{ marginBottom: '40px' }}>Related <span className="accent">Articles</span></h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px' }}>
          {blogData.filter(b => b.id !== post.id).slice(0, 3).map(b => (
            <BlogCard key={b.id} blog={b} />
          ))}
        </div>
      </section>
    </main>
  );
};

export default Blog;
