import React from 'react';
import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { wishlistAPI } from '../services/api';
import toast from 'react-hot-toast';
import './ProductCard.css';

export default function ProductCard({ product }) {
  const { addToCart } = useCart();
  const { user } = useAuth();

  const handleAddToCart = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login to add to cart'); return; }
    const ok = await addToCart(product.id, 1);
    if (ok) toast.success('Added to cart!');
    else toast.error('Failed to add to cart');
  };

  const handleWishlist = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login'); return; }
    try {
      const res = await wishlistAPI.toggle(product.id);
      toast.success(res.added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch { toast.error('Error updating wishlist'); }
  };

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <Link to={`/products/${product.id}`} className="product-card card">
      <div className="product-card-img-wrap">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=400'}
          alt={product.name}
          loading="lazy"
        />
        {discount > 0 && <span className="discount-badge">-{discount}%</span>}
        <button className="wishlist-btn" onClick={handleWishlist} title="Wishlist">
          <FiHeart />
        </button>
      </div>
      <div className="product-card-body">
        <p className="product-brand">{product.brand}</p>
        <h3 className="product-name">{product.name}</h3>
        <div className="product-rating">
          <FiStar className="star-icon" />
          <span>{product.rating?.toFixed(1)}</span>
          <span className="review-count">({product.reviewCount})</span>
        </div>
        <div className="product-price-row">
          <span className="product-price">₹{product.price?.toLocaleString('en-IN')}</span>
          {product.originalPrice && (
            <span className="product-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>
          )}
        </div>
        <button className="add-cart-btn btn btn-primary" onClick={handleAddToCart}>
          <FiShoppingCart /> Add to Cart
        </button>
      </div>
    </Link>
  );
}
