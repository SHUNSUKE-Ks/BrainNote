export default function JsonPanel(props) {
  return <textarea class="json-panel" readOnly value={JSON.stringify(props.value, null, 2)} />;
}
