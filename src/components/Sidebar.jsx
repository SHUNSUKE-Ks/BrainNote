import { For } from "solid-js";

const groups = [
  {
    label: "00_WorkSpace",
    items: ["Dashboard", "ReportBox", "Goals", "Knowledge Index", "Memory_0610"]
  },
  {
    label: "01_AI_Studio",
    items: ["AllDevStudio", "Component Bank", "Function Ticket", "SVG + JSON Layout"]
  },
  {
    label: "Output",
    items: ["Export JSON", "Export MD", "Send to Codex"]
  }
];

export default function Sidebar(props) {
  const selectable = new Set(["Dashboard", "ReportBox", "Goals", "Knowledge Index", "Memory_0610", "Function Ticket"]);

  return (
    <aside class="sidebar">
      <div class="brand-lockup">
        <img class="brand-icon" src="/icons/brainnote-icon.svg" alt="" />
        <div>
          <div class="brand-title">BrainNote</div>
          <div class="brand-subtitle">Workspace / AI Studio</div>
        </div>
      </div>

      <For each={groups}>
        {(group) => (
          <nav class="nav-group" aria-label={group.label}>
            <div class="nav-label">{group.label}</div>
            <For each={group.items}>
              {(item) => (
                <button
                  classList={{ "nav-item": true, active: props.activeScreen === item, disabled: !selectable.has(item) }}
                  type="button"
                  disabled={!selectable.has(item)}
                  onClick={() => selectable.has(item) && props.setActiveScreen(item)}
                >
                  {item}
                </button>
              )}
            </For>
          </nav>
        )}
      </For>
    </aside>
  );
}
