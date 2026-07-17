import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { orderAPI } from '../services/api';
import './OrdersPage.css';

const STATUS_COLORS = {
  PENDING: 'warning', CONFIRMED: 'primary', PROCESSING: 'primary',
  SHIPPED: 'primary', DELIVERED: 'success', CANCELLED: 'danger', RETURNED: 'danger'
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    orderAPI.getAll().then(setOrders).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="container" style={{ padding: '60px 24px', textAlign: 'center', color: 'var(--text-muted)' }}>Loading orders...</div>;

  if (orders.length === 0) return (
    <div className="orders-empty container page-enter">
      <div style={{ fontSize: 64 }}>📦</div>
      <h2>No orders yet</h2>
      <Link to="/products" className="btn btn-primary btn-lg">Start Shopping</Link>
    </div>
  );

  return (
    <div className="orders-page container page-enter">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card card">
            <div className="order-card-header">
              <div>
                <p className="order-num">#{order.orderNumber}</p>
                <p className="order-date">{new Date(order.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
              <div className="order-header-right">
                <span className={`badge badge-${STATUS_COLORS[order.status] || 'primary'}`}>{order.status}</span>
                <p className="order-amount">₹{order.finalAmount?.toLocaleString('en-IN')}</p>
              </div>
            </div>
            <div className="order-items-preview">
              {order.items?.slice(0, 3).map(item => (
                <div key={item.id} className="order-item-row">
                  <img src={item.image || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=60'} alt="" />
                  <div>
                    <p className="order-item-name">{item.productName}</p>
                    <p className="order-item-meta">Qty: {item.quantity} · ₹{item.price?.toLocaleString('en-IN')}</p>
                  </div>
                </div>
              ))}
              {order.items?.length > 3 && <p className="more-items">+{order.items.length - 3} more items</p>}
            </div>
            <div className="order-card-footer">
              <span className={`badge badge-${order.paymentStatus === 'PAID' ? 'success' : 'warning'}`}>
                {order.paymentStatus}
              </span>
              <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{order.paymentMethod}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
