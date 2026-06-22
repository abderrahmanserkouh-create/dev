import { useState, useEffect } from 'react';

const slides = [
  { id: 1, title: 'Đồng Phục Chất Lượng Cao', subtitle: 'May theo yêu cầu - Số lượng lớn', color: '#1a1a2e' },
  { id: 2, title: 'Áo Sơ Mi - Áo Polo - Quần Tây', subtitle: 'Đa dạng mẫu mã, thiết kế riêng', color: '#16213e' },
  { id: 3, title: 'Đặt May Theo Yêu Cầu', subtitle: 'In thêu logo, nhận hàng nhanh chóng', color: '#0f3460' },
  { id: 4, title: 'Giao Hàng Toàn Quốc', subtitle: 'Cam kết chất lượng - Đúng tiến độ', color: '#533483' },
];

export default function Hero() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="m-hero">
      <div style={{ position: 'relative', width: '100%', overflow: 'hidden' }}>
        <div style={{ display: 'flex', transition: 'transform 0.6s ease', transform: `translateX(-${current * 100}%)` }}>
          {slides.map(slide => (
            <div key={slide.id} style={{ minWidth: '100%', position: 'relative', height: '420px', background: slide.color, display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center' }}>
              <div style={{ padding: '20px' }}>
                <h1 style={{ color: '#fff', fontSize: 'clamp(28px, 5vw, 52px)', fontWeight: 700, marginBottom: '12px' }}>{slide.title}</h1>
                <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: 'clamp(16px, 2vw, 22px)', marginBottom: '24px' }}>{slide.subtitle}</p>
                <a href="/products" className="m-btn m-btn--primary m-btn--lg" style={{ fontSize: '16px', padding: '12px 32px' }}>Xem sản phẩm</a>
              </div>
            </div>
          ))}
        </div>
        <div className="swiper-pagination">
          {slides.map((_, idx) => (
            <span
              key={idx}
              className={`swiper-pagination-bullet${idx === current ? ' swiper-pagination-bullet-active' : ''}`}
              onClick={() => setCurrent(idx)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
