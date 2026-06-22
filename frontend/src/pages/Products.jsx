import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import { productAPI, categoryAPI } from '../services/api';

export default function Products() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  const categoryFilter = searchParams.get('category') || '';
  const search = searchParams.get('search') || '';
  const page = parseInt(searchParams.get('page') || '1', 10);

  const [searchInput, setSearchInput] = useState(search);

  useEffect(() => {
    setSearchInput(search);
  }, [search]);

  useEffect(() => {
    setLoading(true);
    Promise.all([
      productAPI.getAll({ category: categoryFilter || undefined, search: search || undefined, page }),
      categoryAPI.getAll(),
    ])
      .then(([pRes, cRes]) => {
        const data = pRes.data;
        if (data && data.products) {
          setProducts(data.products);
          setTotal(data.total);
          setTotalPages(data.totalPages);
        } else if (Array.isArray(data)) {
          setProducts(data);
          setTotal(data.length);
          setTotalPages(1);
        }
        setCategories(cRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [categoryFilter, search, page]);

  const handleSearch = e => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ search: searchInput });
    }
  };

  const handleCategoryFilter = id => {
    const params = {};
    if (id) params.category = id;
    setSearchParams(params);
  };

  const changePage = newPage => {
    if (newPage < 1 || newPage > totalPages) return;
    const params = {};
    if (categoryFilter) params.category = categoryFilter;
    if (search) params.search = search;
    if (newPage > 1) params.page = newPage;
    setSearchParams(params);
  };

  return (
    <div className="m-section">
      <div className="m-products-header">
        <div>
          <h1>{categoryFilter ? categories.find(c => c.id == categoryFilter)?.name || 'Sản phẩm' : 'Tất cả sản phẩm'}</h1>
          <span className="m-products-count">{products.length} sản phẩm</span>
        </div>
        <form className="m-search" onSubmit={handleSearch}>
          <span className="m-search__icon">🔍</span>
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchInput}
            onChange={e => setSearchInput(e.target.value)}
          />
        </form>
      </div>

      <div style={{ display: 'flex', gap: '8px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          className={`m-btn m-btn--sm ${!categoryFilter ? 'm-btn--primary' : 'm-btn--outline'}`}
          onClick={() => handleCategoryFilter('')}
        >
          Tất cả
        </button>
        {categories.map(cat => (
          <button
            key={cat.id}
            className={`m-btn m-btn--sm ${categoryFilter == cat.id ? 'm-btn--primary' : 'm-btn--outline'}`}
            onClick={() => handleCategoryFilter(cat.id)}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="m-loading">Đang tải...</div>
      ) : products.length === 0 ? (
        <div className="m-error">
          <h2>Không tìm thấy sản phẩm</h2>
          <p>Thử tìm kiếm với từ khóa khác</p>
        </div>
      ) : (
        <>
          <div className="m-product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          <div className="m-pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '32px' }}>
            <button className="m-btn m-btn--sm m-btn--outline" disabled={page <= 1} onClick={() => changePage(page - 1)}>Trước</button>
            <span>Trang {page} / {totalPages}</span>
            <button className="m-btn m-btn--sm m-btn--outline" disabled={page >= totalPages} onClick={() => changePage(page + 1)}>Sau</button>
            <span style={{ marginLeft: '16px', color: '#888', fontSize: '14px' }}>
              Hiển thị {products.length} / {total} sản phẩm
            </span>
          </div>
        </>
      )}
    </div>
  );
}
