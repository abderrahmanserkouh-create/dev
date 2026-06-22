import { Link } from 'react-router-dom';

export default function NotFound() {
  return (
    <div className="m-error">
      <h1 style={{ fontSize: '72px', marginBottom: '8px' }}>404</h1>
      <h2 style={{ marginBottom: '12px' }}>Trang không tồn tại</h2>
      <p>Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.</p>
      <Link to="/" className="m-btn m-btn--primary" style={{ marginTop: '24px', display: 'inline-block' }}>
        Về trang chủ
      </Link>
    </div>
  );
}
