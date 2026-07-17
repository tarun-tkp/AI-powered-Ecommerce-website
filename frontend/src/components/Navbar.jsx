import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiUser, FiSearch, FiLogOut, FiPackage, FiSettings } from 'react-icons/fi';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import './Navbar.css';

export default function Navbar() {
  const { user, logout, isAdmin } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [search, setSearch] = useState('');
  const [menuOpen, setMenuOpen] = useState(false);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) {
      navigate(`/products?search=${encodeURIComponent(search.trim())}`);
      setSearch('');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    setMenuOpen(false);
  };

  return (
    <nav className="navbar">
      <div className="navbar-inner container">
        <Link to="/" className="navbar-logo">
          <span className="logo-icon">⚡</span>
          <span className="logo-text">ShopAI</span>
        </Link>

        <form className="navbar-search" onSubmit={handleSearch}>
          <FiSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search products, brands..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
          <button type="submit" className="search-btn">Search</button>
        </form>

        <div className="navbar-actions">
          {user ? (
            <>
              <Link to="/wishlist" className="nav-icon-btn" title="Wishlist">
                <FiHeart />
              </Link>
              <Link to="/cart" className="nav-icon-btn cart-btn" title="Cart">
                <FiShoppingCart />
                {cart.itemCount > 0 && <span className="cart-badge">{cart.itemCount}</span>}
              </Link>
              <div className="user-menu-wrap">
                <button className="user-menu-btn" onClick={() => setMenuOpen(p => !p)}>
                  <div className="user-avatar">{user.name?.[0]?.toUpperCase()}</div>
                </button>
                {menuOpen && (
                  <div className="user-dropdown">
                    <div className="dropdown-header">
                      <p className="dropdown-name">{user.name}</p>
                      <p className="dropdown-email">{user.email}</p>
                    </div>
                    <Link to="/profile" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      <FiUser /> My Profile
                    </Link>
                    <Link to="/orders" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                      <FiPackage /> My Orders
                    </Link>
                    {isAdmin && (
                      <Link to="/admin" className="dropdown-item" onClick={() => setMenuOpen(false)}>
                        <FiSettings /> Admin Panel
                      </Link>
                    )}
                    <button className="dropdown-item danger" onClick={handleLogout}>
                      <FiLogOut /> Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn btn-secondary btn-sm">Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm">Sign Up</Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
