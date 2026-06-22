import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="m-footer">
      <div className="m-footer__grid">
        <div className="m-footer__brand">
          <img src="/images/logo.svg" alt="Xưởng May Nhà Công" />
          <p>Xưởng May Nhà Công - Đồng phục chất lượng cao, may theo yêu cầu số lượng lớn.</p>
          <div className="social-media-links">
            <a href="https://facebook.com/xuongmaynhacong" target="_blank" rel="noopener noreferrer" aria-label="Facebook">f</a>
            <a href="https://instagram.com/xuongmaynhacong" target="_blank" rel="noopener noreferrer" aria-label="Instagram">ig</a>
            <a href="https://tiktok.com/@xuongmaynhacong" target="_blank" rel="noopener noreferrer" aria-label="TikTok">tk</a>
          </div>
        </div>
        <div className="m-footer__block">
          <h3>Danh mục</h3>
          <ul>
            <li><Link to="/products">Áo Đồng Phục</Link></li>
            <li><Link to="/products">Áo Sơ Mi</Link></li>
            <li><Link to="/products">Quần Đồng Phục</Link></li>
            <li><Link to="/products">Áo Khoác</Link></li>
            <li><Link to="/products">Đồ Bảo Hộ</Link></li>
          </ul>
        </div>
        <div className="m-footer__block">
          <h3>Hỗ trợ</h3>
          <ul>
            <li><Link to="/pages/chinh-sach-doi-tra">Chính sách đổi trả</Link></li>
            <li><Link to="/pages/chinh-sach-giao-nhan">Chính sách giao nhận</Link></li>
            <li><Link to="/pages/chinh-sach-thanh-toan">Chính sách thanh toán</Link></li>
            <li><Link to="/pages/chinh-sach-bao-mat">Chính sách bảo mật</Link></li>
            <li><Link to="/pages/dieu-khoan-dich-vu">Điều khoản dịch vụ</Link></li>
          </ul>
        </div>
        <div className="m-footer__block">
          <h3>Về chúng tôi</h3>
          <ul>
            <li><Link to="/about">Giới thiệu</Link></li>
            <li><Link to="/contact">Liên hệ</Link></li>
          </ul>
          <div style={{ marginTop: '16px', fontSize: '13px', color: '#666', lineHeight: 1.6 }}>
            <p>📧 info@xuongmaynhacong.com</p>
            <p>📞 0900 000 000</p>
            <p>📍 Số 1 Lê Văn Lương, Nhân Chính, Thanh Xuân, Hà Nội</p>
          </div>
        </div>
      </div>
      <div className="m-footer__bottom">
        &copy; {new Date().getFullYear()} Xưởng May Nhà Công. All rights reserved.
      </div>
    </footer>
  );
}
