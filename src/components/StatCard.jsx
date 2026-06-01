export default function StatCard(props) {
  return (
    <article class="stat-card">
      <div class="card-header">
        <h2>{props.title}</h2>
        <span class={`badge ${props.tone || ""}`}>{props.badge}</span>
      </div>
      <p>{props.children}</p>
      <div class="stat-number">{props.count}</div>
    </article>
  );
}
