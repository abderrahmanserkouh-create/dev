import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async e => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await register(name, email, password, phone, address);
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Đăng ký thất bại');
    }
    setLoading(false);
  };

  return (
    <div className="m-auth">
      <div className="m-auth__box">
        <h1>Đăng ký</h1>
        <p>Tạo tài khoản để mua sắm</p>
        <form onSubmit={handleSubmit}>
          <div className="m-form-group">
            <label>Họ tên</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} required />
          </div>
          <div className="m-form-group">
            <label>Email</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="m-form-group">
            <label>Mật khẩu</label>
            <input type="password" value={password} onChange={e => setPassword(e.target.value)} required minLength={6} />
          </div>
          <div className="m-form-group">
            <label>Số điện thoại</label>
            <input type="tel" value={phone} onChange={e => setPhone(e.target.value)} />
          </div>
          <div className="m-form-group">
            <label>Địa chỉ</label>
            <textarea rows="2" value={address} onChange={e => setAddress(e.target.value)} />
          </div>
          {error && <p style={{ color: 'rgb(var(--color-price-sale))', marginBottom: '12px', fontSize: '14px' }}>{error}</p>}
          <button type="submit" className="m-btn m-btn--primary m-btn--full m-btn--lg" disabled={loading}>
            {loading ? 'Đang xử lý...' : 'Đăng ký'}
          </button>
        </form>
        <p style={{ marginTop: '16px' }}>
          Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
        </p>
      </div>
    </div>
  );
}
