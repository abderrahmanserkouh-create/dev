import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { useCart } from '../context/useCart';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { items } = useCart();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="m-header">
      <div className="m-header__wrapper">
        <button className="hamburger" onClick={() => setMobileOpen(true)} aria-label="Menu">
          <span /><span /><span />
        </button>
        <Link to="/" className="m-header__logo">
          <img src="/images/logo.svg" alt="Xưởng May Nhà Công" height="40" />
        </Link>
        <nav className="m-header__nav">
          <Link to="/">Trang chủ</Link>
          <Link to="/products">Sản phẩm</Link>
          <Link to="/collections">Bộ sưu tập</Link>
          <Link to="/about">Về chúng tôi</Link>
          <Link to="/contact">Liên hệ</Link>
        </nav>
        <div className="m-header__actions">
          {user ? (
            <>
              <Link to="/favorites" title="Yêu thích">♡</Link>
              <Link to="/cart" title="Giỏ hàng">
                🛒
                {items.length > 0 && <span className="count-badge">{items.length}</span>}
              </Link>
              <Link to="/account" className="m-header__user-name">{user.name}</Link>
              {user.role === 'admin' && <Link to="/admin" className="m-btn m-btn--sm m-btn--outline">Admin</Link>}
              <button onClick={logout} className="m-header__logout-btn">Đăng xuất</button>
            </>
          ) : (
            <>
              <Link to="/cart" title="Giỏ hàng">
                🛒
                {items.length > 0 && <span className="count-badge">{items.length}</span>}
              </Link>
              <Link to="/login" className="m-btn m-btn--sm m-btn--primary">Đăng nhập</Link>
            </>
          )}
        </div>
      </div>

      <div className={`m-mobile-nav${mobileOpen ? ' open' : ''}`} onClick={() => setMobileOpen(false)}>
        <div className="m-mobile-nav__inner" onClick={e => e.stopPropagation()}>
          <button className="m-mobile-nav__close" onClick={() => setMobileOpen(false)}>×</button>
          <Link to="/" onClick={() => setMobileOpen(false)}>Trang chủ</Link>
          <Link to="/products" onClick={() => setMobileOpen(false)}>Sản phẩm</Link>
          <Link to="/collections" onClick={() => setMobileOpen(false)}>Bộ sưu tập</Link>
          <Link to="/about" onClick={() => setMobileOpen(false)}>Về chúng tôi</Link>
          <Link to="/contact" onClick={() => setMobileOpen(false)}>Liên hệ</Link>
          {user ? (
            <>
              <Link to="/favorites" onClick={() => setMobileOpen(false)}>Yêu thích</Link>
              <Link to="/account" onClick={() => setMobileOpen(false)}>Tài khoản</Link>
              {user.role === 'admin' && <Link to="/admin" onClick={() => setMobileOpen(false)}>Admin</Link>}
              <button onClick={() => { logout(); setMobileOpen(false); }} className="m-btn m-btn--sm m-btn--outline" style={{ marginTop: '12px' }}>Đăng xuất</button>
            </>
          ) : (
            <Link to="/login" onClick={() => setMobileOpen(false)} className="m-btn m-btn--sm m-btn--primary" style={{ marginTop: '12px', display: 'inline-block' }}>Đăng nhập</Link>
          )}
        </div>
      </div>
    </div>
  );
}
