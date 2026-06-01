import JsonPanel from "../components/JsonPanel";
import SectionHeader from "../components/SectionHeader";
import { createMemo, createSignal } from "solid-js";
import { listFromText, makeId, textFromList } from "../utils/formats";

export default function FunctionTicket(props) {
  const ticket = () => props.data.tickets[0] || {};
  const dictEntries = () => Object.entries(ticket().dict || {});
  const [title, setTitle] = createSignal(ticket().title || "Function Ticket");
  const [image, setImage] = createSignal(ticket().image || "svg_layout_ticket_1280x720");
  const [request, setRequest] = createSignal(ticket().request || "");
  const [output, setOutput] = createSignal(textFromList(ticket().output));
  const [dictText, setDictText] = createSignal(
    dictEntries()
      .map(([key, value]) => `${key}: ${value}`)
      .join("\n")
  );

  const editedTicket = createMemo(() => ({
    id: ticket().id || makeId("ticket_function"),
    title: title().trim() || "Function Ticket",
    type: "requirement_card",
    image: image().trim() || "svg_layout_ticket_1280x720",
    dict: parseDict(dictText()),
    request: request().trim(),
    output: listFromText(output())
  }));

  const saveTicket = (event) => {
    event.preventDefault();
    const currentId = ticket().id;
    const nextTickets = currentId
      ? props.rawData.tickets.map((item) => (item.id === currentId ? editedTicket() : item))
      : [editedTicket(), ...props.rawData.tickets];

    props.onDataChange({
      ...props.rawData,
      tickets: nextTickets
    });
  };

  return (
    <>
      <SectionHeader
        title="Function Ticket"
        description="Title / Image / Dict / Request / Outputを1枚にまとめ、AIへ機能意図を渡す。"
        meta={ticket().id}
      />

      <form class="composer-panel" onSubmit={saveTicket}>
        <div class="form-grid">
          <label>
            Title
            <input value={title()} onInput={(event) => setTitle(event.currentTarget.value)} />
          </label>
          <label>
            Image / SVG
            <input value={image()} onInput={(event) => setImage(event.currentTarget.value)} />
          </label>
          <label class="wide-field">
            Output
            <input value={output()} onInput={(event) => setOutput(event.currentTarget.value)} placeholder="SolidJS Component, JSON Schema, MD仕様書" />
          </label>
        </div>
        <div class="form-grid two-col">
          <label>
            Request
            <textarea value={request()} onInput={(event) => setRequest(event.currentTarget.value)} />
          </label>
          <label>
            Dict
            <textarea value={dictText()} onInput={(event) => setDictText(event.currentTarget.value)} placeholder="ReportBox: 他アプリからの報告入口" />
          </label>
        </div>
        <div class="form-actions">
          <button class="primary-button" type="submit">Save Ticket</button>
        </div>
      </form>

      <section class="ticket-layout">
        <article class="ticket-card-large">
          <div class="ticket-image-placeholder">{editedTicket().image}</div>
          <h2>{editedTicket().title}</h2>
          <p>{editedTicket().request}</p>
          <div class="tag-row">
            {editedTicket().output.map((item) => (
              <span class="tag">{item}</span>
            ))}
          </div>
        </article>

        <article class="dict-panel">
          <h2>Dict</h2>
          {Object.entries(editedTicket().dict).map(([key, value]) => (
            <div class="dict-row">
              <strong>{key}</strong>
              <span>{value}</span>
            </div>
          ))}
        </article>

        <article class="json-export-panel">
          <h2>JSON</h2>
          <JsonPanel value={editedTicket()} />
        </article>
      </section>
    </>
  );
}

function parseDict(value) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .reduce((dict, line) => {
      const separatorIndex = line.indexOf(":");
      if (separatorIndex === -1) return dict;
      const key = line.slice(0, separatorIndex).trim();
      const description = line.slice(separatorIndex + 1).trim();
      if (key && description) dict[key] = description;
      return dict;
    }, {});
}
