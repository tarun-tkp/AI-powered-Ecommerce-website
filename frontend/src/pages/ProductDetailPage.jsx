import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingCart, FiStar, FiTruck, FiShield, FiZap } from 'react-icons/fi';
import { productAPI, reviewAPI, wishlistAPI } from '../services/api';
import { useCart } from '../contexts/CartContext';
import { useAuth } from '../contexts/AuthContext';
import { useChat } from '../contexts/ChatContext';
import ProductCard from '../components/ProductCard';
import toast from 'react-hot-toast';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import './ProductDetailPage.css';

export default function ProductDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user } = useAuth();
  const { toggleChat, sendMessage } = useChat();

  const [product, setProduct] = useState(null);
  const [similar, setSimilar] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [selectedImg, setSelectedImg] = useState(0);
  const [qty, setQty] = useState(1);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState('');
  const [summaryLoading, setSummaryLoading] = useState(false);
  const [newReview, setNewReview] = useState({ rating: 5, title: '', comment: '' });
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    setLoading(true);
    window.scrollTo(0, 0);
    productAPI.getById(id).then(p => {
      setProduct(p);
      setLoading(false);
      if (p.categoryId) {
        productAPI.getSimilar(id, p.categoryId).then(setSimilar).catch(() => {});
      }
    }).catch(() => { setLoading(false); });
    reviewAPI.getByProduct(id).then(setReviews).catch(() => {});
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { toast.error('Please login'); navigate('/login'); return; }
    const ok = await addToCart(product.id, qty);
    if (ok) toast.success('Added to cart!');
    else toast.error('Failed to add to cart');
  };

  const handleBuyNow = async () => {
    if (!user) { toast.error('Please login'); navigate('/login'); return; }
    const ok = await addToCart(product.id, qty);
    if (ok) navigate('/cart');
  };

  const handleWishlist = async () => {
    if (!user) { toast.error('Please login'); return; }
    try {
      const res = await wishlistAPI.toggle(product.id);
      toast.success(res.added ? 'Added to wishlist' : 'Removed from wishlist');
    } catch { toast.error('Error'); }
  };

  const handleAskAI = () => {
    toggleChat();
    sendMessage(`Tell me about the ${product.name}. Is it a good buy?`);
  };

  const loadAISummary = async () => {
    if (reviews.length === 0) { toast('No reviews to summarize'); return; }
    setSummaryLoading(true);
    try {
      const res = await reviewAPI.getSummary(id, product.name);
      setAiSummary(res.summary);
    } catch { toast.error('Failed to get summary'); }
    finally { setSummaryLoading(false); }
  };

  const submitReview = async () => {
    if (!user) { toast.error('Please login to review'); return; }
    setSubmittingReview(true);
    try {
      const added = await reviewAPI.add(id, newReview);
      setReviews(prev => [added, ...prev]);
      setNewReview({ rating: 5, title: '', comment: '' });
      toast.success('Review submitted!');
    } catch (e) { toast.error(e.message || 'Failed to submit review'); }
    finally { setSubmittingReview(false); }
  };

  if (loading) return (
    <div className="container" style={{ padding: '60px 24px' }}>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
        <div className="skeleton" style={{ aspectRatio: '1', borderRadius: '16px' }} />
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {[80, 40, 60, 100, 200].map((w, i) => (
            <div key={i} className="skeleton" style={{ height: '20px', width: `${w}%` }} />
          ))}
        </div>
      </div>
    </div>
  );

  if (!product) return <div className="container" style={{ padding: '60px 24px', textAlign: 'center' }}>Product not found</div>;

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100) : 0;

  return (
    <div className="product-detail page-enter">
      <div className="container">
        <div className="pd-grid">
          {/* Images */}
          <div className="pd-images">
            <div className="pd-main-img">
              <img src={product.images?.[selectedImg] || product.images?.[0] || 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=600'} alt={product.name} />
              {discount > 0 && <span className="pd-discount-badge">-{discount}% OFF</span>}
            </div>
            {product.images?.length > 1 && (
              <div className="pd-thumbnails">
                {product.images.map((img, i) => (
                  <button key={i} className={`pd-thumb ${selectedImg === i ? 'active' : ''}`} onClick={() => setSelectedImg(i)}>
                    <img src={img} alt="" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="pd-info">
            <p className="pd-brand">{product.brand}</p>
            <h1 className="pd-title">{product.name}</h1>
            <div className="pd-rating-row">
              <div className="stars">{'★'.repeat(Math.round(product.rating || 0))}{'☆'.repeat(5 - Math.round(product.rating || 0))}</div>
              <span className="pd-rating-val">{product.rating?.toFixed(1)}</span>
              <span className="pd-review-count">({product.reviewCount} reviews)</span>
            </div>

            <div className="pd-price-section">
              <span className="pd-price">₹{product.price?.toLocaleString('en-IN')}</span>
              {product.originalPrice && <span className="pd-original">₹{product.originalPrice?.toLocaleString('en-IN')}</span>}
              {discount > 0 && <span className="badge badge-danger">{discount}% off</span>}
            </div>

            <div className={`pd-stock ${product.stock > 0 ? 'in-stock' : 'out-stock'}`}>
              {product.stock > 0 ? `✓ In Stock (${product.stock} left)` : '✗ Out of Stock'}
            </div>

            <div className="pd-qty">
              <label>Quantity</label>
              <div className="qty-controls">
                <button onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <span>{qty}</span>
                <button onClick={() => setQty(q => Math.min(product.stock, q + 1))}>+</button>
              </div>
            </div>

            <div className="pd-actions">
              <button className="btn btn-secondary pd-wishlist" onClick={handleWishlist}><FiHeart /> Wishlist</button>
              <button className="btn btn-secondary" onClick={handleAddToCart} disabled={product.stock === 0}><FiShoppingCart /> Add to Cart</button>
              <button className="btn btn-primary btn-lg" onClick={handleBuyNow} disabled={product.stock === 0}><FiZap /> Buy Now</button>
            </div>

            <button className="ask-ai-btn" onClick={handleAskAI}><span>🤖</span> Ask AI about this product</button>

            <div className="pd-perks">
              <div className="perk"><FiTruck /> Free delivery above ₹499</div>
              <div className="perk"><FiShield /> 7-day easy returns</div>
            </div>
          </div>
        </div>

        {/* Description & Specs */}
        <div className="pd-tabs">
          <div className="pd-tab-section">
            <h2>Description</h2>
            <p className="pd-description">{product.description}</p>
          </div>
          {product.specifications && (
            <div className="pd-tab-section">
              <h2>Specifications</h2>
              <div className="pd-specs">
                {product.specifications.split('\n').map((line, i) => {
                  const [key, ...rest] = line.split(':');
                  return rest.length > 0 ? (
                    <div key={i} className="spec-row">
                      <span className="spec-key">{key}</span>
                      <span className="spec-val">{rest.join(':').trim()}</span>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          )}
        </div>

        {/* Reviews */}
        <div className="pd-reviews">
          <div className="reviews-header">
            <h2>Customer Reviews</h2>
            <button className="btn btn-secondary btn-sm" onClick={loadAISummary} disabled={summaryLoading}>
              {summaryLoading ? 'Summarizing...' : '🤖 AI Summary'}
            </button>
          </div>

          {aiSummary && (
            <div className="ai-review-summary">
              <h4>🤖 AI Review Summary</h4>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{aiSummary}</ReactMarkdown>
            </div>
          )}

          {/* Add Review */}
          {user && (
            <div className="add-review card">
              <h3>Write a Review</h3>
              <div className="review-stars-input">
                {[1,2,3,4,5].map(s => (
                  <button key={s} className={`star-btn ${s <= newReview.rating ? 'active' : ''}`}
                    onClick={() => setNewReview(r => ({ ...r, rating: s }))}>★</button>
                ))}
              </div>
              <input placeholder="Review title" value={newReview.title}
                onChange={e => setNewReview(r => ({ ...r, title: e.target.value }))} className="review-input" />
              <textarea placeholder="Share your experience..." value={newReview.comment}
                onChange={e => setNewReview(r => ({ ...r, comment: e.target.value }))} className="review-input" rows={3} />
              <button className="btn btn-primary" onClick={submitReview} disabled={submittingReview}>
                {submittingReview ? 'Submitting...' : 'Submit Review'}
              </button>
            </div>
          )}

          <div className="reviews-list">
            {reviews.length === 0 ? <p className="no-reviews">No reviews yet. Be the first!</p> :
              reviews.map(r => (
                <div key={r.id} className="review-item card">
                  <div className="review-header">
                    <div className="review-user-avatar">{r.userName?.[0]?.toUpperCase()}</div>
                    <div>
                      <p className="review-user">{r.userName}</p>
                      <div className="stars" style={{ fontSize: '12px' }}>{'★'.repeat(r.rating)}{'☆'.repeat(5-r.rating)}</div>
                    </div>
                    <span className="review-date">{new Date(r.createdAt).toLocaleDateString()}</span>
                  </div>
                  {r.title && <p className="review-title">{r.title}</p>}
                  <p className="review-comment">{r.comment}</p>
                </div>
              ))
            }
          </div>
        </div>

        {/* Similar */}
        {similar.length > 0 && (
          <div className="pd-similar">
            <h2>Similar Products</h2>
            <div className="grid-4">
              {similar.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
