import { Link } from 'react-router-dom';
import './BlogCard.css';

const BlogCard = ({ blog }) => (
  <div className="blog-card">
    <div className="blog-img-wrap">
      <img src={blog.image} alt={blog.title} loading="lazy" />
      <span className="blog-cat">{blog.category}</span>
    </div>
    <div className="blog-body">
      <div className="blog-meta">
        <span>{blog.date}</span>
        <span className="dot-sep">·</span>
        <span>{blog.readTime}</span>
        <span className="dot-sep">·</span>
        <span>{blog.author}</span>
      </div>
      <h3 className="blog-title">{blog.title}</h3>
      <p className="blog-excerpt">{blog.excerpt}</p>
      <Link to={`/blog/${blog.slug}`} className="blog-read-link">
        Read Article <span className="arrow">→</span>
      </Link>
    </div>
  </div>
);

export default BlogCard;
