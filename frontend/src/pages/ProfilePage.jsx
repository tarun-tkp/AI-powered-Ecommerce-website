import React from 'react';
import { Link } from 'react-router-dom';
import { FiPackage, FiHeart, FiShoppingCart, FiUser } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import './ProfilePage.css';

export default function ProfilePage() {
  const { user } = useAuth();

  return (
    <div className="profile-page container page-enter">
      <div className="profile-header card">
        <div className="profile-avatar">{user?.name?.[0]?.toUpperCase()}</div>
        <div>
          <h1>{user?.name}</h1>
          <p>{user?.email}</p>
          <span className={`badge badge-${user?.role === 'ADMIN' ? 'warning' : 'primary'}`}>{user?.role}</span>
        </div>
      </div>

      <div className="profile-grid">
        {[
          { to: '/orders', icon: <FiPackage />, label: 'My Orders', desc: 'View and track your orders' },
          { to: '/wishlist', icon: <FiHeart />, label: 'Wishlist', desc: 'Products you love' },
          { to: '/cart', icon: <FiShoppingCart />, label: 'Cart', desc: 'Items ready to checkout' },
        ].map(item => (
          <Link key={item.to} to={item.to} className="profile-tile card">
            <div className="profile-tile-icon">{item.icon}</div>
            <h3>{item.label}</h3>
            <p>{item.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
