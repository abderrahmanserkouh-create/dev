import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { productAPI } from '../services/api';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';
import Toast from '../components/Toast';

export default function ProductDetail() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToCart } = useCart();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);
  const [toast, setToast] = useState('');

  useEffect(() => {
    productAPI.getById(id)
      .then(res => setProduct(res.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [id]);

  const handleAddToCart = async () => {
    if (!user) { setToast('Vui lòng đăng nhập để thêm vào giỏ hàng'); return; }
    try {
      await addToCart(product.id, quantity);
      setToast('Đã thêm vào giỏ hàng');
    } catch { setToast('Có lỗi xảy ra'); }
  };

  if (loading) return <div className="m-loading">Đang tải...</div>;
  if (!product) return <div className="m-error"><h2>Không tìm thấy sản phẩm</h2></div>;

  const hasSale = product.sale_price && product.sale_price < product.price;

  return (
    <>
      <div className="m-product-detail">
        <div className="m-product-detail__gallery">
          <img src={product.image || '/images/placeholder.png'} alt={product.name} />
        </div>
        <div className="m-product-detail__info">
          <h1>{product.name}</h1>
          <div className="m-product-detail__price">
            {hasSale ? (
              <>
                <span style={{ color: 'rgb(var(--color-price-sale))' }}>
                  {parseInt(product.sale_price).toLocaleString('vi-VN')}₫
                </span>
                <span style={{ textDecoration: 'line-through', color: '#999', fontSize: '18px', marginLeft: '12px' }}>
                  {parseInt(product.price).toLocaleString('vi-VN')}₫
                </span>
              </>
            ) : (
              <span>{parseInt(product.price).toLocaleString('vi-VN')}₫</span>
            )}
          </div>
          {product.description && (
            <div className="m-product-detail__description">{product.description}</div>
          )}
          <div className="m-product-detail__actions">
            <input
              type="number"
              min="1"
              value={quantity}
              onChange={e => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
            />
            <button className="m-btn m-btn--primary m-btn--lg" onClick={handleAddToCart}>
              Thêm vào giỏ hàng
            </button>
          </div>
        </div>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
    </>
  );
}
