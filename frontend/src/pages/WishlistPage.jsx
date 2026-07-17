import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { wishlistAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './WishlistPage.css';

export default function WishlistPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    wishlistAPI.getAll().then(setProducts).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading...</div>;

  return (
    <div className="wishlist-page container page-enter">
      <h1>My Wishlist <span>({products.length})</span></h1>
      {products.length === 0 ? (
        <div className="wishlist-empty">
          <div style={{ fontSize: 64 }}>❤️</div>
          <h2>Your wishlist is empty</h2>
          <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
        </div>
      ) : (
        <div className="grid-4">{products.map(p => <ProductCard key={p.id} product={p} />)}</div>
      )}
    </div>
  );
}
