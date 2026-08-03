export default function PageHeader({ eyebrow, title, text, action }) {
  return (
    <div className="pageHeader">
      <div>
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
      {action && <div className="pageAction">{action}</div>}
    </div>
  );
}
