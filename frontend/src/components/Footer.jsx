import React from 'react';
import { Link } from 'react-router-dom';
import './Footer.css';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer-inner">
        <div className="footer-brand">
          <div className="footer-logo"><span>⚡</span> ShopAI</div>
          <p>AI-powered shopping experience. Find the best products with intelligent recommendations.</p>
        </div>
        <div className="footer-links">
          <div className="footer-col">
            <h4>Shop</h4>
            <Link to="/products">All Products</Link>
            <Link to="/products?featured=true">Featured</Link>
            <Link to="/products?sort=rating">Top Rated</Link>
          </div>
          <div className="footer-col">
            <h4>Account</h4>
            <Link to="/profile">My Profile</Link>
            <Link to="/orders">My Orders</Link>
            <Link to="/wishlist">Wishlist</Link>
          </div>
          <div className="footer-col">
            <h4>Support</h4>
            <span>Free delivery on orders above ₹499</span>
            <span>Returns within 7 days</span>
            <span>support@shopai.com</span>
          </div>
        </div>
      </div>
      <div className="footer-bottom container">
        <p>© 2024 ShopAI. Built with Spring Boot + React + Spring AI.</p>
      </div>
    </footer>
  );
}
