import React, { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FiFilter, FiX, FiSearch } from 'react-icons/fi';
import { productAPI, categoryAPI } from '../services/api';
import ProductCard from '../components/ProductCard';
import './ProductsPage.css';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'popular', label: 'Most Popular' },
];

export default function ProductsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [totalElements, setTotalElements] = useState(0);
  const [showFilters, setShowFilters] = useState(false);

  const page = parseInt(searchParams.get('page') || '0');
  const sort = searchParams.get('sort') || 'newest';
  const categoryId = searchParams.get('categoryId');
  const search = searchParams.get('search') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const minRating = searchParams.get('minRating') || '';

  const [localMin, setLocalMin] = useState(minPrice);
  const [localMax, setLocalMax] = useState(maxPrice);
  const [localSearch, setLocalSearch] = useState(search);

  useEffect(() => { categoryAPI.getAll().then(setCategories).catch(() => {}); }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, size: 12, sort };
      if (categoryId) params.categoryId = categoryId;
      if (search) params.search = search;
      if (minPrice) params.minPrice = minPrice;
      if (maxPrice) params.maxPrice = maxPrice;
      if (minRating) params.minRating = minRating;
      const data = await productAPI.getAll(params);
      setProducts(data.content || []);
      setTotalPages(data.totalPages || 0);
      setTotalElements(data.totalElements || 0);
    } catch { setProducts([]); }
    finally { setLoading(false); }
  }, [page, sort, categoryId, search, minPrice, maxPrice, minRating]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const setParam = (key, value) => {
    const p = new URLSearchParams(searchParams);
    if (value) p.set(key, value); else p.delete(key);
    p.delete('page');
    setSearchParams(p);
  };

  const applyPriceFilter = () => {
    const p = new URLSearchParams(searchParams);
    if (localMin) p.set('minPrice', localMin); else p.delete('minPrice');
    if (localMax) p.set('maxPrice', localMax); else p.delete('maxPrice');
    p.delete('page');
    setSearchParams(p);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setParam('search', localSearch);
  };

  const clearFilters = () => {
    setLocalMin(''); setLocalMax(''); setLocalSearch('');
    setSearchParams({ sort });
  };

  const hasFilters = categoryId || minPrice || maxPrice || minRating || search;

  return (
    <div className="products-page container page-enter">
      <div className="products-layout">
        {/* Sidebar Filters */}
        <aside className={`filters-sidebar ${showFilters ? 'open' : ''}`}>
          <div className="filters-header">
            <h3>Filters</h3>
            {hasFilters && <button className="clear-filters" onClick={clearFilters}>Clear all</button>}
          </div>

          {/* Search */}
          <div className="filter-section">
            <h4>Search</h4>
            <form onSubmit={handleSearchSubmit} className="filter-search">
              <input value={localSearch} onChange={e => setLocalSearch(e.target.value)} placeholder="Search products..." />
              <button type="submit"><FiSearch /></button>
            </form>
          </div>

          {/* Categories */}
          <div className="filter-section">
            <h4>Category</h4>
            <div className="filter-options">
              <label className="filter-option">
                <input type="radio" checked={!categoryId} onChange={() => setParam('categoryId', '')} />
                <span>All Categories</span>
              </label>
              {categories.map(cat => (
                <label key={cat.id} className="filter-option">
                  <input type="radio" checked={categoryId === String(cat.id)} onChange={() => setParam('categoryId', cat.id)} />
                  <span>{cat.name}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Price */}
          <div className="filter-section">
            <h4>Price Range (₹)</h4>
            <div className="price-inputs">
              <input type="number" placeholder="Min" value={localMin} onChange={e => setLocalMin(e.target.value)} />
              <span>—</span>
              <input type="number" placeholder="Max" value={localMax} onChange={e => setLocalMax(e.target.value)} />
            </div>
            <button className="btn btn-secondary btn-sm apply-btn" onClick={applyPriceFilter}>Apply</button>
          </div>

          {/* Rating */}
          <div className="filter-section">
            <h4>Min Rating</h4>
            {[4, 3, 2].map(r => (
              <label key={r} className="filter-option">
                <input type="radio" checked={minRating === String(r)} onChange={() => setParam('minRating', r)} />
                <span>{'⭐'.repeat(r)} & above</span>
              </label>
            ))}
          </div>
        </aside>

        {/* Main content */}
        <div className="products-main">
          <div className="products-toolbar">
            <div className="toolbar-left">
              <button className="filter-toggle" onClick={() => setShowFilters(p => !p)}>
                <FiFilter /> Filters {hasFilters && <span className="filter-dot" />}
              </button>
              <p className="result-count">{totalElements} products</p>
              {search && (
                <span className="search-tag">
                  "{search}" <button onClick={() => { setLocalSearch(''); setParam('search', ''); }}><FiX /></button>
                </span>
              )}
            </div>
            <select value={sort} onChange={e => setParam('sort', e.target.value)} className="sort-select">
              {SORT_OPTIONS.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
            </select>
          </div>

          {loading ? (
            <div className="grid-4">
              {Array(8).fill(0).map((_, i) => (
                <div key={i} className="product-skeleton card">
                  <div className="skeleton" style={{ aspectRatio: '1', borderRadius: '8px' }} />
                  <div style={{ padding: '14px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <div className="skeleton" style={{ height: '12px', width: '60%' }} />
                    <div className="skeleton" style={{ height: '16px' }} />
                    <div className="skeleton" style={{ height: '16px', width: '80%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="empty-products">
              <p>😕 No products found</p>
              <button className="btn btn-secondary" onClick={clearFilters}>Clear Filters</button>
            </div>
          ) : (
            <div className="grid-4">
              {products.map(p => <ProductCard key={p.id} product={p} />)}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="pagination">
              <button disabled={page === 0} onClick={() => setParam('page', page - 1)} className="btn btn-secondary btn-sm">Prev</button>
              {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                const p = Math.max(0, Math.min(page - 2, totalPages - 5)) + i;
                return (
                  <button key={p} onClick={() => setParam('page', p)}
                    className={`btn btn-sm ${p === page ? 'btn-primary' : 'btn-secondary'}`}>
                    {p + 1}
                  </button>
                );
              })}
              <button disabled={page >= totalPages - 1} onClick={() => setParam('page', page + 1)} className="btn btn-secondary btn-sm">Next</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
