import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { favoriteAPI } from '../services/api';
import { useAuth } from '../context/useAuth';
import ProductCard from '../components/ProductCard';

export default function Favorites() {
  const { user } = useAuth();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      favoriteAPI.get()
        .then(res => setFavorites(res.data))
        .catch(() => {})
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [user]);

  if (!user) {
    return (
      <div className="m-cart__empty">
        <h2>Yêu thích</h2>
        <p>Vui lòng đăng nhập để xem danh sách yêu thích</p>
        <Link to="/login" className="m-btn m-btn--primary">Đăng nhập</Link>
      </div>
    );
  }

  if (loading) return <div className="m-loading">Đang tải...</div>;

  return (
    <div className="m-section">
      <div className="m-section__title">
        <h2>Sản phẩm yêu thích</h2>
      </div>
      {favorites.length === 0 ? (
        <div className="m-cart__empty">
          <p>Chưa có sản phẩm yêu thích nào.</p>
          <Link to="/products" className="m-btn m-btn--primary">Khám phá sản phẩm</Link>
        </div>
      ) : (
        <div className="m-product-grid">
          {favorites.map(fav => (
            <ProductCard key={fav.id} product={fav} />
          ))}
        </div>
      )}
    </div>
  );
}
