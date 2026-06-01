import { For, createMemo, createSignal } from "solid-js";
import SectionHeader from "../components/SectionHeader";
import { listFromText, makeId } from "../utils/formats";

const gateOptions = [
  { value: "inbox", label: "Inbox" },
  { value: "review", label: "Review" },
  { value: "approved", label: "開発に通す" },
  { value: "parked", label: "保留" }
];

export default function IdiaInbox(props) {
  const [title, setTitle] = createSignal("");
  const [sourcePath, setSourcePath] = createSignal("");
  const [body, setBody] = createSignal("");
  const [tags, setTags] = createSignal("note_app, idea");
  const [gate, setGate] = createSignal("inbox");
  const [activeTag, setActiveTag] = createSignal("all");
  const [activeGate, setActiveGate] = createSignal("all");

  const allTags = createMemo(() => {
    const tags = new Set();
    (props.data.ideas || []).forEach((item) => (item.tags || []).forEach((tag) => tags.add(tag)));
    return ["all", ...Array.from(tags).sort()];
  });

  const filteredIdeas = createMemo(() =>
    (props.data.ideas || []).filter((item) => {
      const tagMatch = activeTag() === "all" || (item.tags || []).includes(activeTag());
      const gateMatch = activeGate() === "all" || item.gate === activeGate();
      return tagMatch && gateMatch;
    })
  );

  const addIdea = (event) => {
    event.preventDefault();
    const nextIdea = {
      id: makeId("idia"),
      title: title().trim() || "Untitled IDIA",
      sourcePath: sourcePath().trim(),
      body: body().trim(),
      tags: listFromText(tags()),
      gate: gate(),
      createdAt: new Date().toISOString().slice(0, 10)
    };

    props.onDataChange({
      ...props.rawData,
      ideas: [nextIdea, ...(props.rawData.ideas || [])]
    });

    setTitle("");
    setSourcePath("");
    setBody("");
    setGate("inbox");
  };

  const updateGate = (ideaId, nextGate) => {
    props.onDataChange({
      ...props.rawData,
      ideas: (props.rawData.ideas || []).map((item) => (item.id === ideaId ? { ...item, gate: nextGate } : item))
    });
  };

  return (
    <>
      <SectionHeader
        title="IDIA Inbox"
        description="荒いメモを本番開発TODOと分けて受ける場所。タグとゲートで、開発へ通すかを判断する。"
        meta={`${filteredIdeas().length} ideas`}
      />

      <form class="composer-panel" onSubmit={addIdea}>
        <div class="form-grid">
          <label class="wide-field">
            Title
            <input value={title()} onInput={(event) => setTitle(event.currentTarget.value)} placeholder="NaccSystemをノートアプリへ進化" />
          </label>
          <label>
            Gate
            <select value={gate()} onChange={(event) => setGate(event.currentTarget.value)}>
              <For each={gateOptions}>{(option) => <option value={option.value}>{option.label}</option>}</For>
            </select>
          </label>
          <label>
            Tags
            <input value={tags()} onInput={(event) => setTags(event.currentTarget.value)} placeholder="note_app, NaccSystem" />
          </label>
        </div>
        <label>
          Source Path
          <input value={sourcePath()} onInput={(event) => setSourcePath(event.currentTarget.value)} placeholder="C:/Users/enjoy/InBox2026/..." />
        </label>
        <label>
          IDIA Memo
          <textarea value={body()} onInput={(event) => setBody(event.currentTarget.value)} placeholder="まだ荒いアイディアをここに置く。本番開発TODOには直接混ぜない。" />
        </label>
        <div class="form-actions">
          <button class="primary-button" type="submit">Add IDIA</button>
        </div>
      </form>

      <section class="filter-panel">
        <div>
          <h2>Tag Filter</h2>
          <div class="tag-row">
            <For each={allTags()}>
              {(tag) => (
                <button classList={{ "filter-chip": true, active: activeTag() === tag }} type="button" onClick={() => setActiveTag(tag)}>
                  {tag}
                </button>
              )}
            </For>
          </div>
        </div>
        <div>
          <h2>Gate Filter</h2>
          <div class="tag-row">
            <button classList={{ "filter-chip": true, active: activeGate() === "all" }} type="button" onClick={() => setActiveGate("all")}>all</button>
            <For each={gateOptions}>
              {(option) => (
                <button classList={{ "filter-chip": true, active: activeGate() === option.value }} type="button" onClick={() => setActiveGate(option.value)}>
                  {option.label}
                </button>
              )}
            </For>
          </div>
        </div>
      </section>

      <section class="idia-list">
        <For each={filteredIdeas()}>
          {(idea) => (
            <article class="idia-card">
              <div class="idia-card-main">
                <div class="card-header">
                  <h2>{idea.title}</h2>
                  <span class={`badge ${idea.gate === "approved" ? "green" : idea.gate === "review" ? "gold" : ""}`}>{gateLabel(idea.gate)}</span>
                </div>
                <p>{idea.body}</p>
                {idea.sourcePath && <code>{idea.sourcePath}</code>}
                <div class="tag-row">
                  <For each={idea.tags}>{(tag) => <span class="tag">{tag}</span>}</For>
                </div>
              </div>
              <div class="gate-actions">
                <For each={gateOptions}>
                  {(option) => (
                    <button class="ghost-button small-button" type="button" onClick={() => updateGate(idea.id, option.value)}>
                      {option.label}
                    </button>
                  )}
                </For>
              </div>
            </article>
          )}
        </For>
      </section>
    </>
  );
}

function gateLabel(gate) {
  return gateOptions.find((option) => option.value === gate)?.label || gate;
}
