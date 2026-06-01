import { For, createSignal } from "solid-js";
import SectionHeader from "../components/SectionHeader";
import { listFromText, makeId } from "../utils/formats";

const lanes = ["Inbox", "Sort", "Codex相談", "Folderまとめ", "Done"];

export default function WorkspaceBoard(props) {
  const [title, setTitle] = createSignal("");
  const [lane, setLane] = createSignal("Inbox");
  const [kind, setKind] = createSignal("idia");
  const [source, setSource] = createSignal("");
  const [tags, setTags] = createSignal("android_memo, codex相談");
  const [body, setBody] = createSignal("");

  const addCard = (event) => {
    event.preventDefault();
    const nextCard = {
      id: makeId("board"),
      lane: lane(),
      title: title().trim() || "Untitled Card",
      kind: kind().trim() || "memo",
      source: source().trim(),
      tags: listFromText(tags()),
      body: body().trim()
    };

    props.onDataChange({
      ...props.rawData,
      workspaceBoard: [nextCard, ...(props.rawData.workspaceBoard || [])]
    });

    setTitle("");
    setSource("");
    setBody("");
    setLane("Inbox");
  };

  const moveCard = (cardId, nextLane) => {
    props.onDataChange({
      ...props.rawData,
      workspaceBoard: (props.rawData.workspaceBoard || []).map((card) =>
        card.id === cardId ? { ...card, lane: nextLane } : card
      )
    });
  };

  return (
    <>
      <SectionHeader
        title="Workspace Board"
        description="開発タスクとは別に、資料・Report・IDIA・Codex相談メモをmdテキストとして割り振る場所。"
        meta={`${props.data.workspaceBoard.length} cards`}
      />

      <form class="composer-panel" onSubmit={addCard}>
        <div class="form-grid">
          <label class="wide-field">
            Title
            <input value={title()} onInput={(event) => setTitle(event.currentTarget.value)} placeholder="外でCodexに画像生成してほしいメモ" />
          </label>
          <label>
            Lane
            <select value={lane()} onChange={(event) => setLane(event.currentTarget.value)}>
              <For each={lanes}>{(item) => <option value={item}>{item}</option>}</For>
            </select>
          </label>
          <label>
            Kind
            <input value={kind()} onInput={(event) => setKind(event.currentTarget.value)} placeholder="idia / report / local_path" />
          </label>
        </div>
        <label>
          Source / Local Path
          <input value={source()} onInput={(event) => setSource(event.currentTarget.value)} placeholder="C:\05__claude_workspace\..." />
        </label>
        <label>
          Tags
          <input value={tags()} onInput={(event) => setTags(event.currentTarget.value)} placeholder="image_generation, slides, codex相談" />
        </label>
        <label>
          Markdown Memo
          <textarea value={body()} onInput={(event) => setBody(event.currentTarget.value)} placeholder="あとでCodexに相談するためのテキストだけを書く。画像・資料・企画・スライド化の希望もここへ。" />
        </label>
        <div class="form-actions">
          <button class="primary-button" type="submit">Add Board Card</button>
        </div>
      </form>

      <section class="workspace-board">
        <For each={lanes}>
          {(laneName) => (
            <article class="workspace-column">
              <h2>{laneName}</h2>
              <For each={(props.data.workspaceBoard || []).filter((card) => card.lane === laneName)}>
                {(card) => (
                  <div class="workspace-card">
                    <div class="card-header">
                      <h3>{card.title}</h3>
                      <span class="badge">{card.kind}</span>
                    </div>
                    <p>{card.body}</p>
                    {card.source && <code>{card.source}</code>}
                    <div class="tag-row">
                      <For each={card.tags}>{(tag) => <span class="tag">{tag}</span>}</For>
                    </div>
                    <div class="board-move-actions">
                      <For each={lanes.filter((item) => item !== laneName)}>
                        {(targetLane) => (
                          <button class="ghost-button small-button" type="button" onClick={() => moveCard(card.id, targetLane)}>
                            {targetLane}
                          </button>
                        )}
                      </For>
                    </div>
                  </div>
                )}
              </For>
            </article>
          )}
        </For>
      </section>
    </>
  );
}
