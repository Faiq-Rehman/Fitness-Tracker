import PageHeader from '../PageHeader.jsx';
import StatCard from '../StatCard.jsx';

export function EmptyState({ title, text }) {
  return (
    <section className="emptyState card">
      <div className="emptyState-content">
        <h3>{title}</h3>
        <p>{text}</p>
      </div>
    </section>
  );
}

export { PageHeader, StatCard };
