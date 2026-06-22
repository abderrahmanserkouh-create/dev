import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/useCart';
import { orderAPI } from '../services/api';
import Toast from '../components/Toast';

export default function Checkout() {
  const { items, total, fetchCart } = useCart();
  const navigate = useNavigate();
  const [processing, setProcessing] = useState(false);
  const [toast, setToast] = useState('');

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const handleCheckout = async () => {
    setProcessing(true);
    try {
      await orderAPI.checkout();
      setToast('Đặt hàng thành công!');
      setTimeout(() => navigate('/account'), 1500);
    } catch (err) {
      const message = err.response?.data?.message || err.response?.data?.error || 'Có lỗi xảy ra';
      setToast(message);
    }
    setProcessing(false);
  };

  if (items.length === 0) {
    return (
      <div className="m-cart__empty">
        <h2>Giỏ hàng trống</h2>
        <p>Thêm sản phẩm trước khi thanh toán</p>
      </div>
    );
  }

  return (
    <>
      <div className="m-checkout">
        <h1 style={{ marginBottom: '24px' }}>Thanh toán</h1>
        <div style={{ marginBottom: '24px' }}>
          <h3>Đơn hàng của bạn</h3>
          {items.map(item => (
            <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgb(var(--color-border))' }}>
              <span>{item.name} x{item.quantity}</span>
              <span>{parseInt((item.sale_price || item.price) * item.quantity).toLocaleString('vi-VN')}₫</span>
            </div>
          ))}
          <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', fontWeight: 600, fontSize: '18px' }}>
            <span>Tổng cộng</span>
            <span>{parseInt(total).toLocaleString('vi-VN')}₫</span>
          </div>
        </div>
        <button
          className="m-btn m-btn--primary m-btn--lg m-btn--full"
          onClick={handleCheckout}
          disabled={processing}
        >
          {processing ? 'Đang xử lý...' : 'Đặt hàng'}
        </button>
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
    </>
  );
}
