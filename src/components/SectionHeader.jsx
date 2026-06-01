export default function SectionHeader(props) {
  return (
    <div class="section-header">
      <div>
        <h1>{props.title}</h1>
        <p>{props.description}</p>
      </div>
      {props.meta && <span class="section-meta">{props.meta}</span>}
    </div>
  );
}
