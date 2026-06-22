import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { useAuth } from '../context/useAuth';

export default function Cart() {
  const { items, loading, total, fetchCart, updateQuantity, removeItem } = useCart();
  const { user } = useAuth();

  useEffect(() => { fetchCart(); }, [fetchCart]);

  if (!user) {
    return (
      <div className="m-cart__empty">
        <h2>Giỏ hàng trống</h2>
        <p>Vui lòng đăng nhập để xem giỏ hàng</p>
        <Link to="/login" className="m-btn m-btn--primary">Đăng nhập</Link>
      </div>
    );
  }

  if (loading) return <div className="m-loading">Đang tải...</div>;

  if (items.length === 0) {
    return (
      <div className="m-cart__empty">
        <h2>Giỏ hàng trống</h2>
        <p>Bạn chưa có sản phẩm nào trong giỏ hàng</p>
        <Link to="/products" className="m-btn m-btn--primary">Mua sắm ngay</Link>
      </div>
    );
  }

  return (
    <div className="m-cart">
      <h1 className="m-cart__title">Giỏ hàng ({items.length})</h1>
      {items.map(item => (
        <div key={item.id} className="m-cart__item">
          <img src={item.image || '/images/placeholder.png'} alt={item.name} />
          <div className="m-cart__item-info">
            <div className="m-cart__item-name">{item.name}</div>
            <div className="m-cart__item-price">
              {parseInt(item.sale_price || item.price).toLocaleString('vi-VN')}₫
            </div>
          </div>
          <div className="m-cart__item-qty">
            <button onClick={() => updateQuantity(item.id, item.quantity - 1)}>−</button>
            <span>{item.quantity}</span>
            <button onClick={() => updateQuantity(item.id, item.quantity + 1)}>+</button>
          </div>
          <button className="m-cart__item-remove" onClick={() => removeItem(item.id)}>Xóa</button>
        </div>
      ))}
      <div className="m-cart__footer">
        <div className="m-cart__total">Tổng: {parseInt(total).toLocaleString('vi-VN')}₫</div>
        <Link to="/checkout" className="m-btn m-btn--primary m-btn--lg">Thanh toán</Link>
      </div>
    </div>
  );
}
