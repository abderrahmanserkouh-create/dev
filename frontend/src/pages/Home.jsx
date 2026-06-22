import { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import ProductCard from '../components/ProductCard';
import CollectionCard from '../components/CollectionCard';
import { productAPI, categoryAPI } from '../services/api';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([productAPI.getAll(), categoryAPI.getAll()])
      .then(([pRes, cRes]) => {
        setProducts(pRes.data.slice(0, 8));
        setCategories(cRes.data);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Hero />
      <section className="m-section">
        <div className="m-section__title">
          <h2>Danh mục sản phẩm</h2>
          <p>Khám phá bộ sưu tập của chúng tôi</p>
        </div>
        <div className="m-collection-grid">
          {categories.map(cat => (
            <CollectionCard key={cat.id} category={cat} />
          ))}
        </div>
      </section>
      <section className="m-section">
        <div className="m-section__title">
          <h2>Sản phẩm mới nhất</h2>
          <p>Những sản phẩm mới nhất từ Xưởng May Nhà Công</p>
        </div>
        {loading ? (
          <div className="m-loading">Đang tải...</div>
        ) : (
          <div className="m-product-grid">
            {products.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </>
  );
}
