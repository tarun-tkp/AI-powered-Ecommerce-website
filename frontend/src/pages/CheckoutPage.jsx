import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FiCheck } from 'react-icons/fi';
import { orderAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import toast from 'react-hot-toast';
import './CheckoutPage.css';

const PAYMENT_METHODS = [
  { id: 'COD', label: 'Cash on Delivery', icon: '💵' },
  { id: 'UPI', label: 'UPI', icon: '📱' },
  { id: 'CARD', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'NETBANKING', label: 'Net Banking', icon: '🏦' },
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { cart, clearCart } = useCart();
  const { discount, couponCode } = location.state || {};

  const [address, setAddress] = useState({ addressLine1: '', addressLine2: '', city: '', state: '', pincode: '', country: 'India' });
  const [paymentMethod, setPaymentMethod] = useState('COD');
  const [loading, setLoading] = useState(false);
  const [placed, setPlaced] = useState(null);

  const delivery = cart.total >= 499 ? 0 : 49;
  const finalTotal = (cart.total - (discount || 0)) + delivery;

  const handlePlace = async () => {
    if (!address.addressLine1 || !address.city || !address.state || !address.pincode) {
      toast.error('Please fill all address fields'); return;
    }
    setLoading(true);
    try {
      const res = await orderAPI.place({ ...address, paymentMethod, couponCode: couponCode || '' });
      setPlaced(res);
      clearCart();
    } catch (e) { toast.error(e.message || 'Failed to place order'); }
    finally { setLoading(false); }
  };

  if (placed) return (
    <div className="order-success page-enter">
      <div className="success-card card">
        <div className="success-icon"><FiCheck /></div>
        <h1>Order Placed!</h1>
        <p className="success-order-num">Order #{placed.orderNumber}</p>
        <p className="success-msg">Thank you for your order. You'll receive a confirmation soon.</p>
        <p className="success-total">Total Paid: <strong>₹{placed.finalAmount?.toLocaleString('en-IN')}</strong></p>
        <div className="success-actions">
          <button className="btn btn-primary" onClick={() => navigate('/orders')}>View Orders</button>
          <button className="btn btn-secondary" onClick={() => navigate('/')}>Continue Shopping</button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="checkout-page container page-enter">
      <h1 className="checkout-title">Checkout</h1>
      <div className="checkout-layout">
        <div className="checkout-left">
          {/* Address */}
          <div className="checkout-section card">
            <h2>Delivery Address</h2>
            <div className="address-form">
              <input placeholder="Address Line 1 *" value={address.addressLine1} onChange={e => setAddress(a => ({ ...a, addressLine1: e.target.value }))} />
              <input placeholder="Address Line 2 (optional)" value={address.addressLine2} onChange={e => setAddress(a => ({ ...a, addressLine2: e.target.value }))} />
              <div className="addr-row">
                <input placeholder="City *" value={address.city} onChange={e => setAddress(a => ({ ...a, city: e.target.value }))} />
                <input placeholder="State *" value={address.state} onChange={e => setAddress(a => ({ ...a, state: e.target.value }))} />
              </div>
              <div className="addr-row">
                <input placeholder="Pincode *" value={address.pincode} onChange={e => setAddress(a => ({ ...a, pincode: e.target.value }))} />
                <input placeholder="Country" value={address.country} onChange={e => setAddress(a => ({ ...a, country: e.target.value }))} />
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="checkout-section card">
            <h2>Payment Method</h2>
            <div className="payment-methods">
              {PAYMENT_METHODS.map(pm => (
                <label key={pm.id} className={`payment-option ${paymentMethod === pm.id ? 'selected' : ''}`}>
                  <input type="radio" value={pm.id} checked={paymentMethod === pm.id} onChange={() => setPaymentMethod(pm.id)} />
                  <span className="pm-icon">{pm.icon}</span>
                  <span>{pm.label}</span>
                </label>
              ))}
            </div>
          </div>
        </div>

        {/* Summary */}
        <div className="checkout-summary card">
          <h2>Order Summary</h2>
          <div className="checkout-items">
            {cart.items.map(item => (
              <div key={item.id} className="checkout-item">
                <img src={item.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=60'} alt="" />
                <div className="checkout-item-info">
                  <p className="checkout-item-name">{item.productName}</p>
                  <p className="checkout-item-qty">Qty: {item.quantity}</p>
                </div>
                <p className="checkout-item-price">₹{(item.price * item.quantity)?.toLocaleString('en-IN')}</p>
              </div>
            ))}
          </div>
          <div className="checkout-totals">
            <div className="summary-row"><span>Subtotal</span><span>₹{cart.total?.toLocaleString('en-IN')}</span></div>
            <div className="summary-row"><span>Delivery</span><span>{delivery === 0 ? <span className="free-tag">Free</span> : `₹${delivery}`}</span></div>
            {discount > 0 && <div className="summary-row discount-row"><span>Discount</span><span>−₹{discount?.toLocaleString('en-IN')}</span></div>}
            <div className="summary-row total-row"><span>Total</span><span>₹{finalTotal?.toLocaleString('en-IN')}</span></div>
          </div>
          <button className="btn btn-primary btn-lg place-btn" onClick={handlePlace} disabled={loading || cart.items.length === 0}>
            {loading ? 'Placing Order...' : `Place Order • ₹${finalTotal?.toLocaleString('en-IN')}`}
          </button>
        </div>
      </div>
    </div>
  );
}
