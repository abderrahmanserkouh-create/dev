import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { productAPI, categoryAPI, orderAPI } from '../services/api';
import Toast from '../components/Toast';

export default function Admin() {
  const [tab, setTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [orders, setOrders] = useState([]);
  const [toast, setToast] = useState('');

  const [form, setForm] = useState({ name: '', description: '', price: '', sale_price: '', image: '', category_id: '', stock: '', sku: '' });
  const [catForm, setCatForm] = useState({ name: '', image: '' });
  const [editingId, setEditingId] = useState(null);

  const [prodPage, setProdPage] = useState(1);
  const [prodTotal, setProdTotal] = useState(0);
  const [prodTotalPages, setProdTotalPages] = useState(0);
  const [orderPage, setOrderPage] = useState(1);
  const [orderTotal, setOrderTotal] = useState(0);
  const [orderTotalPages, setOrderTotalPages] = useState(0);
  const limit = 10;

  const loadProducts = () => {
    productAPI.getAllAdmin({ page: prodPage, limit }).then(res => {
      const d = res.data;
      setProducts(d.products || d);
      setProdTotal(d.total || 0);
      setProdTotalPages(d.totalPages || 1);
    }).catch(() => {});
  };

  const loadData = () => {
    loadProducts();
    categoryAPI.getAll().then(res => setCategories(res.data)).catch(() => {});
  };

  useEffect(() => {
    loadData();
  }, [prodPage]);

  useEffect(() => {
    setProdPage(1);
    setOrderPage(1);
  }, [tab]);

  useEffect(() => {
    if (tab === 'orders') {
      orderAPI.getAll({ page: orderPage, limit }).then(res => {
        const d = res.data;
        setOrders(d.orders || d);
        setOrderTotal(d.total || 0);
        setOrderTotalPages(d.totalPages || 1);
      }).catch(() => {});
    }
  }, [tab, orderPage]);

  const handleProductSubmit = async e => {
    e.preventDefault();
    try {
      if (editingId) {
        await productAPI.update(editingId, form);
        setToast('Cập nhật sản phẩm thành công');
      } else {
        await productAPI.create(form);
        setToast('Thêm sản phẩm thành công');
      }
      setForm({ name: '', description: '', price: '', sale_price: '', image: '', category_id: '', stock: '', sku: '' });
      setEditingId(null);
      loadData();
    } catch { setToast('Có lỗi xảy ra'); }
  };

  const editProduct = p => {
    setForm({
      name: p.name, description: p.description || '', price: p.price, sale_price: p.sale_price || '',
      image: p.image || '', category_id: p.category_id || '', stock: p.stock, sku: p.sku || '',
    });
    setEditingId(p.id);
  };

  const deleteProduct = async id => {
    if (!window.confirm('Xóa sản phẩm?')) return;
    await productAPI.delete(id);
    setToast('Đã xóa sản phẩm');
    loadData();
  };

  const handleCatSubmit = async e => {
    e.preventDefault();
    try {
      await categoryAPI.create(catForm);
      setToast('Thêm danh mục thành công');
      setCatForm({ name: '', image: '' });
      loadData();
    } catch { setToast('Có lỗi xảy ra'); }
  };

  const handleOrderStatus = async (id, status) => {
    await orderAPI.updateStatus(id, status);
    setToast('Cập nhật trạng thái đơn hàng');
    orderAPI.getAll({ page: orderPage, limit }).then(res => {
      const d = res.data;
      setOrders(d.orders || d);
      setOrderTotal(d.total || 0);
      setOrderTotalPages(d.totalPages || 1);
    }).catch(() => {});
  };

  return (
    <div className="m-admin">
      <div className="m-admin__sidebar">
        <h2 style={{ marginBottom: '20px' }}>Admin</h2>
        <Link to="/">← Về trang chủ</Link>
        <a href="#" className={tab === 'products' ? 'active' : ''} onClick={e => { e.preventDefault(); setTab('products'); }}>Sản phẩm</a>
        <a href="#" className={tab === 'categories' ? 'active' : ''} onClick={e => { e.preventDefault(); setTab('categories'); }}>Danh mục</a>
        <a href="#" className={tab === 'orders' ? 'active' : ''} onClick={e => { e.preventDefault(); setTab('orders'); }}>Đơn hàng</a>
      </div>
      <div className="m-admin__content">
        {tab === 'products' && (
          <>
            <h2>{editingId ? 'Sửa sản phẩm' : 'Thêm sản phẩm'}</h2>
            <form onSubmit={handleProductSubmit} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '30px', maxWidth: '600px' }}>
              <div className="m-form-group" style={{ margin: 0 }}>
                <label>Tên</label>
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} required />
              </div>
              <div className="m-form-group" style={{ margin: 0 }}>
                <label>Giá</label>
                <input type="number" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} required />
              </div>
              <div className="m-form-group" style={{ margin: 0 }}>
                <label>Giá sale</label>
                <input type="number" value={form.sale_price} onChange={e => setForm({ ...form, sale_price: e.target.value })} />
              </div>
              <div className="m-form-group" style={{ margin: 0 }}>
                <label>SKU</label>
                <input value={form.sku} onChange={e => setForm({ ...form, sku: e.target.value })} />
              </div>
              <div className="m-form-group" style={{ margin: 0 }}>
                <label>Tồn kho</label>
                <input type="number" value={form.stock} onChange={e => setForm({ ...form, stock: e.target.value })} />
              </div>
              <div className="m-form-group" style={{ margin: 0 }}>
                <label>Danh mục</label>
                <select value={form.category_id} onChange={e => setForm({ ...form, category_id: e.target.value })}>
                  <option value="">Chọn danh mục</option>
                  {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="m-form-group" style={{ margin: 0 }}>
                <label>Hình ảnh URL</label>
                <input value={form.image} onChange={e => setForm({ ...form, image: e.target.value })} />
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <div className="m-form-group" style={{ margin: 0 }}>
                  <label>Mô tả</label>
                  <textarea rows="3" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
                </div>
              </div>
              <div style={{ gridColumn: '1 / -1' }}>
                <button type="submit" className="m-btn m-btn--primary">
                  {editingId ? 'Cập nhật' : 'Thêm sản phẩm'}
                </button>
                {editingId && <button type="button" className="m-btn m-btn--outline" style={{ marginLeft: '8px' }} onClick={() => { setEditingId(null); setForm({ name: '', description: '', price: '', sale_price: '', image: '', category_id: '', stock: '', sku: '' }); }}>Hủy</button>}
              </div>
            </form>
            <table>
              <thead>
                <tr><th>ID</th><th>Tên</th><th>Giá</th><th>SKU</th><th>Tồn kho</th><th>Trạng thái</th><th>Hành động</th></tr>
              </thead>
              <tbody>
                {products.map(p => (
                  <tr key={p.id}>
                    <td>{p.id}</td>
                    <td>{p.name}</td>
                    <td>{parseInt(p.price).toLocaleString('vi-VN')}₫</td>
                    <td>{p.sku || '-'}</td>
                    <td>{p.stock}</td>
                    <td>{p.status || 'active'}</td>
                    <td>
                      <button className="m-btn m-btn--sm m-btn--outline" onClick={() => editProduct(p)} style={{ marginRight: '8px' }}>Sửa</button>
                      <button className="m-btn m-btn--sm m-btn--outline" onClick={() => deleteProduct(p.id)}>Xóa</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {prodTotalPages > 1 && (
              <div className="m-pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                <button className="m-btn m-btn--sm m-btn--outline" disabled={prodPage <= 1} onClick={() => setProdPage(prev => prev - 1)}>Trước</button>
                <span>Trang {prodPage} / {prodTotalPages}</span>
                <button className="m-btn m-btn--sm m-btn--outline" disabled={prodPage >= prodTotalPages} onClick={() => setProdPage(prev => prev + 1)}>Sau</button>
                <span style={{ marginLeft: '16px', color: '#888', fontSize: '14px' }}>Hiển thị {products.length} / {prodTotal} sản phẩm</span>
              </div>
            )}
          </>
        )}
        {tab === 'categories' && (
          <>
            <h2>Thêm danh mục</h2>
            <form onSubmit={handleCatSubmit} style={{ display: 'flex', gap: '12px', marginBottom: '30px', maxWidth: '500px' }}>
              <div className="m-form-group" style={{ margin: 0, flex: 1 }}>
                <label>Tên</label>
                <input value={catForm.name} onChange={e => setCatForm({ ...catForm, name: e.target.value })} required />
              </div>
              <div className="m-form-group" style={{ margin: 0, flex: 1 }}>
                <label>Hình ảnh URL</label>
                <input value={catForm.image} onChange={e => setCatForm({ ...catForm, image: e.target.value })} />
              </div>
              <div style={{ alignSelf: 'flex-end' }}>
                <button type="submit" className="m-btn m-btn--primary">Thêm</button>
              </div>
            </form>
            <table>
              <thead>
                <tr><th>ID</th><th>Tên</th><th>Hành động</th></tr>
              </thead>
              <tbody>
                {categories.map(c => (
                  <tr key={c.id}>
                    <td>{c.id}</td>
                    <td>{c.name}</td>
                    <td><button className="m-btn m-btn--sm m-btn--outline" onClick={async () => { await categoryAPI.delete(c.id); setToast('Đã xóa'); loadData(); }}>Xóa</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        )}
        {tab === 'orders' && (
          <>
            <h2>Quản lý đơn hàng</h2>
            <table>
              <thead>
                <tr><th>ID</th><th>Người dùng</th><th>Tổng</th><th>Trạng thái</th><th>Ngày</th><th>Hành động</th></tr>
              </thead>
              <tbody>
                {orders.map(o => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.user_id}</td>
                    <td>{parseInt(o.total).toLocaleString('vi-VN')}₫</td>
                    <td><span className={`m-order-card__status ${o.status}`}>{o.status}</span></td>
                    <td>{new Date(o.created_at).toLocaleDateString('vi-VN')}</td>
                    <td>
                      <select value={o.status} onChange={e => handleOrderStatus(o.id, e.target.value)} style={{ padding: '4px', borderRadius: '4px', border: '1px solid #ddd' }}>
                        <option value="pending">Pending</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="shipping">Shipping</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {orderTotalPages > 1 && (
              <div className="m-pagination" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', marginTop: '16px' }}>
                <button className="m-btn m-btn--sm m-btn--outline" disabled={orderPage <= 1} onClick={() => setOrderPage(prev => prev - 1)}>Trước</button>
                <span>Trang {orderPage} / {orderTotalPages}</span>
                <button className="m-btn m-btn--sm m-btn--outline" disabled={orderPage >= orderTotalPages} onClick={() => setOrderPage(prev => prev + 1)}>Sau</button>
                <span style={{ marginLeft: '16px', color: '#888', fontSize: '14px' }}>Hiển thị {orders.length} / {orderTotal} đơn hàng</span>
              </div>
            )}
          </>
        )}
      </div>
      <Toast message={toast} onClose={() => setToast('')} />
    </div>
  );
}
