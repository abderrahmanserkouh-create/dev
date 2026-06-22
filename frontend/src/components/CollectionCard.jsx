import { Link } from 'react-router-dom';

export default function CollectionCard({ category }) {
  return (
    <Link to={`/products?category=${category.id}`} className="m-collection-card">
      <img
        src={category.image || '/images/placeholder.png'}
        alt={category.name}
        loading="lazy"
      />
      <div className="m-collection-card__title">{category.name}</div>
    </Link>
  );
}
