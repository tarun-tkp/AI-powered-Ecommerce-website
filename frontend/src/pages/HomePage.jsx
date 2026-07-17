import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiArrowRight, FiZap, FiTruck, FiShield, FiHeadphones } from 'react-icons/fi';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './HomePage.css';

export default function HomePage() {
  const [featured, setFeatured] = useState([]);
  const [topRated, setTopRated] = useState([]);
  const [bestSellers, setBestSellers] = useState([]);
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    productAPI.getFeatured().then(setFeatured).catch(() => {});
    productAPI.getTopRated().then(setTopRated).catch(() => {});
    productAPI.getBestSellers().then(setBestSellers).catch(() => {});
    categoryAPI.getAll().then(setCategories).catch(() => {});
  }, []);

  return (
    <div className="home page-enter">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content container">
          <div className="hero-badge"><FiZap /> AI-Powered Shopping</div>
          <h1 className="hero-title">
            Shop Smarter with<br />
            <span className="gradient-text">Artificial Intelligence</span>
          </h1>
          <p className="hero-subtitle">
            Get personalized recommendations, smart search, and AI-powered assistance to find exactly what you need.
          </p>
          <div className="hero-actions">
            <Link to="/products" className="btn btn-primary btn-lg">
              Shop Now <FiArrowRight />
            </Link>
            <Link to="/products?sort=rating" className="btn btn-secondary btn-lg">
              Top Rated
            </Link>
          </div>
          <div className="hero-stats">
            <div className="hero-stat"><span>10K+</span><p>Products</p></div>
            <div className="hero-stat"><span>50K+</span><p>Customers</p></div>
            <div className="hero-stat"><span>4.8★</span><p>Rating</p></div>
          </div>
        </div>
        <div className="hero-visual">
          <div className="hero-glow" />
          <img src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=600" alt="Shopping" />
        </div>
      </section>

      {/* Features */}
      <section className="features container">
        {[
          { icon: <FiTruck />, title: 'Free Delivery', desc: 'On orders above ₹499' },
          { icon: <FiShield />, title: 'Secure Payments', desc: '100% safe & encrypted' },
          { icon: <FiHeadphones />, title: 'AI Support', desc: '24/7 smart assistant' },
          { icon: <FiZap />, title: 'Fast Checkout', desc: 'One-click ordering' },
        ].map(f => (
          <div key={f.title} className="feature-card card">
            <div className="feature-icon">{f.icon}</div>
            <div><h4>{f.title}</h4><p>{f.desc}</p></div>
          </div>
        ))}
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="section container">
          <div className="section-header">
            <h2>Shop by Category</h2>
            <Link to="/products" className="see-all">See All <FiArrowRight /></Link>
          </div>
          <div className="categories-grid">
            {categories.map(cat => (
              <Link key={cat.id} to={`/products?categoryId=${cat.id}`} className="category-card card">
                <img src={cat.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=300'} alt={cat.name} />
                <div className="category-overlay">
                  <h3>{cat.name}</h3>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {featured.length > 0 && (
        <section className="section container">
          <div className="section-header">
            <h2>Featured Products</h2>
            <Link to="/products?sort=newest" className="see-all">See All <FiArrowRight /></Link>
          </div>
          <div className="grid-4">
            {featured.slice(0, 8).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Top Rated */}
      {topRated.length > 0 && (
        <section className="section container">
          <div className="section-header">
            <h2>⭐ Top Rated</h2>
            <Link to="/products?sort=rating" className="see-all">See All <FiArrowRight /></Link>
          </div>
          <div className="grid-4">
            {topRated.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* Best Sellers */}
      {bestSellers.length > 0 && (
        <section className="section container">
          <div className="section-header">
            <h2>🔥 Best Sellers</h2>
            <Link to="/products?sort=popular" className="see-all">See All <FiArrowRight /></Link>
          </div>
          <div className="grid-4">
            {bestSellers.slice(0, 4).map(p => <ProductCard key={p.id} product={p} />)}
          </div>
        </section>
      )}

      {/* AI Banner */}
      <section className="ai-banner container">
        <div className="ai-banner-content">
          <h2>🤖 Ask our AI Shopping Assistant</h2>
          <p>Not sure what to buy? Our AI can recommend products based on your budget, needs, and preferences.</p>
          <div className="ai-banner-chips">
            {['Laptop under ₹60,000', 'Best phone for gaming', 'Gift ideas for dad'].map(q => (
              <span key={q} className="ai-chip">{q}</span>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
