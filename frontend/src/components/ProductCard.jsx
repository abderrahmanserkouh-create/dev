import { Link } from 'react-router-dom';

export default function ProductCard({ product }) {
  const price = product.sale_price || product.price;
  const hasSale = product.sale_price && product.sale_price < product.price;

  return (
    <Link to={`/product/${product.id}`} className="m-product-card">
      <div style={{ position: 'relative' }}>
        <img
          className="m-product-card__image"
          src={product.image || '/images/placeholder.png'}
          alt={product.name}
          loading="lazy"
        />
        {hasSale && <span className="m-product-card__badge m-product-card__badge--sale">Giảm</span>}
      </div>
      <div className="m-product-card__info">
        <div className="m-product-card__title">{product.name}</div>
        <div className="m-product-card__price">
          {hasSale ? (
            <>
              <span className="m-product-card__price--sale">
                {parseInt(price).toLocaleString('vi-VN')}₫
              </span>
              <span className="m-product-card__price--compare">
                {parseInt(product.price).toLocaleString('vi-VN')}₫
              </span>
            </>
          ) : (
            <span>{parseInt(price).toLocaleString('vi-VN')}₫</span>
          )}
        </div>
      </div>
    </Link>
  );
}
