import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiTrash2, FiShoppingBag, FiTag } from 'react-icons/fi';
import { useCart } from '../contexts/CartContext';
import { couponAPI } from '../services/api';
import toast from 'react-hot-toast';
import './CartPage.css';

export default function CartPage() {
  const { cart, updateQuantity, removeItem } = useCart();
  const [coupon, setCoupon] = useState('');
  const [discount, setDiscount] = useState(null);
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  const applyCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    try {
      const res = await couponAPI.validate(coupon, cart.total);
      if (res.valid) {
        setDiscount(res.discount);
        toast.success(`Coupon applied! You save ₹${res.discount}`);
      } else {
        toast.error(res.message || 'Invalid coupon');
      }
    } catch { toast.error('Failed to validate coupon'); }
    finally { setCouponLoading(false); }
  };

  const finalTotal = discount ? cart.total - discount : cart.total;

  if (cart.items.length === 0) return (
    <div className="cart-empty container page-enter">
      <div className="empty-icon">🛒</div>
      <h2>Your cart is empty</h2>
      <p>Add some products to get started</p>
      <Link to="/products" className="btn btn-primary btn-lg">Browse Products</Link>
    </div>
  );

  return (
    <div className="cart-page container page-enter">
      <h1 className="cart-title">Shopping Cart <span>({cart.itemCount} items)</span></h1>
      <div className="cart-layout">
        <div className="cart-items">
          {cart.items.map(item => (
            <div key={item.id} className="cart-item card">
              <img src={item.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=120'} alt={item.productName} className="cart-item-img" />
              <div className="cart-item-info">
                <Link to={`/products/${item.productId}`} className="cart-item-name">{item.productName}</Link>
                <p className="cart-item-price">₹{item.price?.toLocaleString('en-IN')}</p>
              </div>
              <div className="qty-controls">
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
                <span>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <p className="cart-item-total">₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</p>
              <button className="remove-btn" onClick={() => removeItem(item.id)}><FiTrash2 /></button>
            </div>
          ))}
        </div>

        <div className="cart-summary card">
          <h2>Order Summary</h2>
          <div className="coupon-row">
            <div className="coupon-input-wrap">
              <FiTag />
              <input placeholder="Coupon code" value={coupon} onChange={e => setCoupon(e.target.value.toUpperCase())} />
            </div>
            <button className="btn btn-secondary btn-sm" onClick={applyCoupon} disabled={couponLoading}>Apply</button>
          </div>
          <div className="summary-rows">
            <div className="summary-row"><span>Subtotal</span><span>₹{cart.total?.toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Delivery</span><span className="free-tag">{cart.total >= 499 ? 'Free' : '₹49'}</span></div>
            {discount && <div className="summary-row discount-row"><span>Discount ({coupon})</span><span>−₹{discount?.toLocaleString('en-IN')}</span></div>}
            <div className="summary-row total-row">
              <span>Total</span>
              <span>₹{(finalTotal + (cart.total < 499 ? 49 : 0))?.toLocaleString('en-IN')}</span>
            </div>
          </div>
          <button className="btn btn-primary btn-lg checkout-btn" onClick={() => navigate('/checkout', { state: { discount, couponCode: coupon } })}>
            <FiShoppingBag /> Proceed to Checkout
          </button>
          <p className="secure-note">🔒 Secure checkout</p>
        </div>
      </div>
    </div>
  );
}
