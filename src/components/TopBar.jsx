import ExportButtons from "./ExportButtons";

export default function TopBar(props) {
  const addTicket = () => props.setActiveScreen("Function Ticket");

  return (
    <header class="topbar">
      <input
        class="search"
        value={props.query}
        onInput={(event) => props.setQuery(event.currentTarget.value)}
        placeholder="検索：Report / Component / Memory / Ticket"
        aria-label="Workspace search"
      />
      <ExportButtons data={props.data} onDataChange={props.onDataChange} />
      <button class="primary-button" type="button" onClick={addTicket}>
        + New Ticket
      </button>
    </header>
  );
}
