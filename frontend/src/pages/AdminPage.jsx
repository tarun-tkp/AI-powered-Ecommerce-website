import React, { useEffect, useState } from 'react';
import { adminAPI, categoryAPI } from '../services/api';
import toast from 'react-hot-toast';
import './AdminPage.css';

const TABS = ['Dashboard', 'Products', 'Categories', 'Orders', 'Users', 'Coupons'];

export default function AdminPage() {
  const [tab, setTab] = useState('Dashboard');
  const [stats, setStats] = useState({});
  const [products, setProducts] = useState({ content: [] });
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState({ content: [] });
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);
  const [productForm, setProductForm] = useState({ name: '', brand: '', price: '', originalPrice: '', stock: '', categoryId: '', description: '', specifications: '', images: '', featured: false, active: true });
  const [couponForm, setCouponForm] = useState({ code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '', maxDiscount: '' });
  const [catForm, setCatForm] = useState({ name: '', description: '', image: '' });

  useEffect(() => {
    adminAPI.getDashboard().then(setStats).catch(() => {});
    categoryAPI.getAll().then(setCategories).catch(() => {});
  }, []);

  useEffect(() => {
    if (tab === 'Products') adminAPI.getProducts({ size: 50 }).then(setProducts).catch(() => {});
    if (tab === 'Orders') adminAPI.getOrders({ size: 50 }).then(setOrders).catch(() => {});
    if (tab === 'Users') adminAPI.getUsers().then(setUsers).catch(() => {});
    if (tab === 'Coupons') adminAPI.getCoupons().then(setCoupons).catch(() => {});
    if (tab === 'Categories') adminAPI.getCategories().then(setCategories).catch(() => {});
  }, [tab]);

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createProduct({ ...productForm, price: +productForm.price, originalPrice: +productForm.originalPrice, stock: +productForm.stock, categoryId: +productForm.categoryId, images: productForm.images.split(',').map(s => s.trim()) });
      toast.success('Product created!');
      adminAPI.getProducts({ size: 50 }).then(setProducts);
      setProductForm({ name: '', brand: '', price: '', originalPrice: '', stock: '', categoryId: '', description: '', specifications: '', images: '', featured: false, active: true });
    } catch (e) { toast.error(e.message); }
  };

  const handleDeleteProduct = async (id) => {
    if (!confirm('Delete this product?')) return;
    try { await adminAPI.deleteProduct(id); adminAPI.getProducts({ size: 50 }).then(setProducts); toast.success('Deleted'); }
    catch (e) { toast.error(e.message); }
  };

  const handleOrderStatus = async (id, status) => {
    try { await adminAPI.updateOrderStatus(id, status); adminAPI.getOrders({ size: 50 }).then(setOrders); toast.success('Status updated'); }
    catch (e) { toast.error(e.message); }
  };

  const handleCreateCoupon = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createCoupon({ ...couponForm, discountValue: +couponForm.discountValue, minOrderAmount: +couponForm.minOrderAmount || null, maxDiscount: +couponForm.maxDiscount || null });
      toast.success('Coupon created!');
      adminAPI.getCoupons().then(setCoupons);
      setCouponForm({ code: '', discountType: 'PERCENTAGE', discountValue: '', minOrderAmount: '', maxDiscount: '' });
    } catch (e) { toast.error(e.message); }
  };

  const handleCreateCategory = async (e) => {
    e.preventDefault();
    try {
      await adminAPI.createCategory(catForm);
      toast.success('Category created!');
      adminAPI.getCategories().then(setCategories);
      setCatForm({ name: '', description: '', image: '' });
    } catch (e) { toast.error(e.message); }
  };

  return (
    <div className="admin-page container page-enter">
      <div className="admin-header">
        <h1>⚙️ Admin Panel</h1>
      </div>
      <div className="admin-tabs">
        {TABS.map(t => <button key={t} className={`admin-tab ${tab === t ? 'active' : ''}`} onClick={() => setTab(t)}>{t}</button>)}
      </div>

      {/* Dashboard */}
      {tab === 'Dashboard' && (
        <div className="admin-section">
          <div className="stats-grid">
            {[
              { label: 'Total Revenue', value: `₹${stats.revenue?.toLocaleString('en-IN') || 0}`, color: '#6366f1' },
              { label: 'Total Orders', value: stats.totalOrders || 0, color: '#10b981' },
              { label: 'Total Products', value: stats.totalProducts || 0, color: '#f59e0b' },
              { label: 'Total Users', value: stats.totalUsers || 0, color: '#3b82f6' },
              { label: 'Pending Orders', value: stats.pendingOrders || 0, color: '#ef4444' },
            ].map(s => (
              <div key={s.label} className="stat-card card">
                <p className="stat-label">{s.label}</p>
                <p className="stat-value" style={{ color: s.color }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Products */}
      {tab === 'Products' && (
        <div className="admin-section">
          <div className="admin-split">
            <div className="admin-form-panel card">
              <h3>Add Product</h3>
              <form onSubmit={handleCreateProduct} className="admin-form">
                {[['name','Name *'],['brand','Brand'],['price','Price *'],['originalPrice','Original Price'],['stock','Stock *'],['images','Image URLs (comma separated)']].map(([k,p]) => (
                  <input key={k} placeholder={p} value={productForm[k]} onChange={e => setProductForm(f => ({ ...f, [k]: e.target.value }))} required={p.includes('*')} />
                ))}
                <select value={productForm.categoryId} onChange={e => setProductForm(f => ({ ...f, categoryId: e.target.value }))}>
                  <option value="">Select Category</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
                <textarea placeholder="Description" value={productForm.description} onChange={e => setProductForm(f => ({ ...f, description: e.target.value }))} rows={2} />
                <textarea placeholder="Specifications (Key: Value per line)" value={productForm.specifications} onChange={e => setProductForm(f => ({ ...f, specifications: e.target.value }))} rows={3} />
                <label className="admin-checkbox"><input type="checkbox" checked={productForm.featured} onChange={e => setProductForm(f => ({ ...f, featured: e.target.checked }))} /> Featured</label>
                <button type="submit" className="btn btn-primary">Add Product</button>
              </form>
            </div>
            <div className="admin-table-panel">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Price</th><th>Stock</th><th>Category</th><th></th></tr></thead>
                <tbody>
                  {(products.content || []).map(p => (
                    <tr key={p.id}>
                      <td>{p.name}</td>
                      <td>₹{p.price?.toLocaleString('en-IN')}</td>
                      <td>{p.stock}</td>
                      <td>{p.categoryName}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={() => handleDeleteProduct(p.id)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Categories */}
      {tab === 'Categories' && (
        <div className="admin-section">
          <div className="admin-split">
            <div className="admin-form-panel card">
              <h3>Add Category</h3>
              <form onSubmit={handleCreateCategory} className="admin-form">
                <input placeholder="Name *" value={catForm.name} onChange={e => setCatForm(f => ({ ...f, name: e.target.value }))} required />
                <input placeholder="Description" value={catForm.description} onChange={e => setCatForm(f => ({ ...f, description: e.target.value }))} />
                <input placeholder="Image URL" value={catForm.image} onChange={e => setCatForm(f => ({ ...f, image: e.target.value }))} />
                <button type="submit" className="btn btn-primary">Add Category</button>
              </form>
            </div>
            <div className="admin-table-panel">
              <table className="admin-table">
                <thead><tr><th>Name</th><th>Slug</th><th>Description</th><th></th></tr></thead>
                <tbody>
                  {categories.map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td><td>{c.slug}</td><td>{c.description}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={async () => { if(confirm('Delete?')) { await adminAPI.deleteCategory(c.id); adminAPI.getCategories().then(setCategories); }}}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Orders */}
      {tab === 'Orders' && (
        <div className="admin-section">
          <table className="admin-table">
            <thead><tr><th>Order #</th><th>Amount</th><th>Status</th><th>Payment</th><th>Date</th><th>Update</th></tr></thead>
            <tbody>
              {(orders.content || []).map(o => (
                <tr key={o.id}>
                  <td>{o.orderNumber}</td>
                  <td>₹{o.finalAmount?.toLocaleString('en-IN')}</td>
                  <td><span className="badge badge-primary">{o.status}</span></td>
                  <td>{o.paymentStatus}</td>
                  <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td>
                    <select defaultValue={o.status} onChange={e => handleOrderStatus(o.id, e.target.value)} className="sort-select" style={{ padding: '4px 8px', fontSize: '12px' }}>
                      {['PENDING','CONFIRMED','PROCESSING','SHIPPED','DELIVERED','CANCELLED'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Users */}
      {tab === 'Users' && (
        <div className="admin-section">
          <table className="admin-table">
            <thead><tr><th>Name</th><th>Email</th><th>Role</th><th>Joined</th></tr></thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id}>
                  <td>{u.name}</td><td>{u.email}</td>
                  <td><span className={`badge badge-${u.role === 'ADMIN' ? 'warning' : 'primary'}`}>{u.role}</span></td>
                  <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Coupons */}
      {tab === 'Coupons' && (
        <div className="admin-section">
          <div className="admin-split">
            <div className="admin-form-panel card">
              <h3>Create Coupon</h3>
              <form onSubmit={handleCreateCoupon} className="admin-form">
                <input placeholder="Code (e.g. SAVE20) *" value={couponForm.code} onChange={e => setCouponForm(f => ({ ...f, code: e.target.value.toUpperCase() }))} required />
                <select value={couponForm.discountType} onChange={e => setCouponForm(f => ({ ...f, discountType: e.target.value }))}>
                  <option value="PERCENTAGE">Percentage</option>
                  <option value="FLAT">Flat Amount</option>
                </select>
                <input placeholder="Discount Value *" type="number" value={couponForm.discountValue} onChange={e => setCouponForm(f => ({ ...f, discountValue: e.target.value }))} required />
                <input placeholder="Min Order Amount" type="number" value={couponForm.minOrderAmount} onChange={e => setCouponForm(f => ({ ...f, minOrderAmount: e.target.value }))} />
                <input placeholder="Max Discount (for %)" type="number" value={couponForm.maxDiscount} onChange={e => setCouponForm(f => ({ ...f, maxDiscount: e.target.value }))} />
                <button type="submit" className="btn btn-primary">Create Coupon</button>
              </form>
            </div>
            <div className="admin-table-panel">
              <table className="admin-table">
                <thead><tr><th>Code</th><th>Type</th><th>Value</th><th>Min Order</th><th></th></tr></thead>
                <tbody>
                  {coupons.map(c => (
                    <tr key={c.id}>
                      <td><strong>{c.code}</strong></td>
                      <td>{c.discountType}</td>
                      <td>{c.discountType === 'PERCENTAGE' ? `${c.discountValue}%` : `₹${c.discountValue}`}</td>
                      <td>{c.minOrderAmount ? `₹${c.minOrderAmount}` : '-'}</td>
                      <td><button className="btn btn-danger btn-sm" onClick={async () => { await adminAPI.deleteCoupon(c.id); adminAPI.getCoupons().then(setCoupons); }}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
