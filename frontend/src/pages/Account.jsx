import { useState, useEffect } from 'react';
import { orderAPI, favoriteAPI, authAPI } from '../services/api';
import { useAuth } from '../context/useAuth';
import { Link } from 'react-router-dom';
import Toast from '../components/Toast';

export default function Account() {
  const { user, login } = useAuth();
  const [orders, setOrders] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [tab, setTab] = useState('orders');
  const [toast, setToast] = useState('');
  const [profile, setProfile] = useState({ name: '', phone: '', address: '' });

  useEffect(() => {
    if (user) {
      orderAPI.getMyOrders().then(res => setOrders(res.data)).catch(() => {});
      favoriteAPI.get().then(res => setFavorites(res.data)).catch(() => {});
      setProfile({ name: user.name || '', phone: user.phone || '', address: user.address || '' });
    }
  }, [user]);

  const handleProfileSubmit = async e => {
    e.preventDefault();
    try {
      await authAPI.updateProfile(profile);
      setToast('Cập nhật thông tin thành công');
    } catch {
      setToast('Có lỗi xảy ra');
    }
  };

  if (!user) return null;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '40px 20px' }}>
      <h1 style={{ marginBottom: '8px' }}>Xin chào, {user.name}</h1>
      <p style={{ color: '#666', marginBottom: '24px' }}>{user.email}</p>

      <div style={{ display: 'flex', gap: '12px', marginBottom: '24px', flexWrap: 'wrap' }}>
        <button
          className={`m-btn m-btn--sm ${tab === 'orders' ? 'm-btn--primary' : 'm-btn--outline'}`}
          onClick={() => setTab('orders')}
        >
          Đơn hàng
        </button>
        <button
          className={`m-btn m-btn--sm ${tab === 'favorites' ? 'm-btn--primary' : 'm-btn--outline'}`}
          onClick={() => setTab('favorites')}
        >
          Yêu thích
        </button>
        <button
          className={`m-btn m-btn--sm ${tab === 'profile' ? 'm-btn--primary' : 'm-btn--outline'}`}
          onClick={() => setTab('profile')}
        >
          Thông tin
        </button>
      </div>

      {tab === 'orders' && (
        <div className="m-orders" style={{ padding: 0 }}>
          {orders.length === 0 ? (
            <p style={{ color: '#666' }}>Bạn chưa có đơn hàng nào.</p>
          ) : (
            orders.map(order => (
              <div key={order.id} className="m-order-card">
                <div className="m-order-card__header">
                  <span style={{ fontWeight: 500 }}>Đơn hàng #{order.id}</span>
                  <span className={`m-order-card__status ${order.status}`}>{order.status}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '14px', color: '#666' }}>
                  <span>{new Date(order.created_at).toLocaleDateString('vi-VN')}</span>
                  <span style={{ fontWeight: 600, color: '#222' }}>
                    {parseInt(order.total).toLocaleString('vi-VN')}₫
                  </span>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'favorites' && (
        <div className="m-product-grid">
          {favorites.length === 0 ? (
            <p style={{ color: '#666', gridColumn: '1 / -1' }}>Chưa có sản phẩm yêu thích.</p>
          ) : (
            favorites.map(fav => (
              <Link key={fav.id} to={`/product/${fav.product_id}`} className="m-product-card">
                <img className="m-product-card__image" src={fav.image || '/images/placeholder.png'} alt={fav.name} />
                <div className="m-product-card__info">
                  <div className="m-product-card__title">{fav.name}</div>
                  <div className="m-product-card__price">
                    {parseInt(fav.sale_price || fav.price).toLocaleString('vi-VN')}₫
                  </div>
                </div>
              </Link>
            ))
          )}
        </div>
      )}

      {tab === 'profile' && (
        <form onSubmit={handleProfileSubmit} style={{ maxWidth: '500px' }}>
          <div className="m-form-group">
            <label>Họ tên</label>
            <input value={profile.name} onChange={e => setProfile({ ...profile, name: e.target.value })} required />
          </div>
          <div className="m-form-group">
            <label>Số điện thoại</label>
            <input value={profile.phone} onChange={e => setProfile({ ...profile, phone: e.target.value })} />
          </div>
          <div className="m-form-group">
            <label>Địa chỉ</label>
            <textarea rows="2" value={profile.address} onChange={e => setProfile({ ...profile, address: e.target.value })} />
          </div>
          <button type="submit" className="m-btn m-btn--primary">Lưu thông tin</button>
        </form>
      )}

      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
