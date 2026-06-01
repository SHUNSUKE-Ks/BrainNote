import DataList from "../components/DataList";
import SectionHeader from "../components/SectionHeader";
import { createSignal } from "solid-js";
import { makeId } from "../utils/formats";

export default function MemoryView(props) {
  const [title, setTitle] = createSignal("");
  const [summary, setSummary] = createSignal("");
  const [nextAction, setNextAction] = createSignal("");
  const [keepNext, setKeepNext] = createSignal(true);

  const addMemory = (event) => {
    event.preventDefault();
    const nextMemory = {
      id: makeId("memory_0610"),
      period: "0610",
      title: title().trim() || "Untitled Memory",
      keepNext: keepNext(),
      summary: summary().trim(),
      nextAction: nextAction().trim()
    };

    props.onDataChange({
      ...props.rawData,
      memories: [nextMemory, ...props.rawData.memories]
    });

    setTitle("");
    setSummary("");
    setNextAction("");
    setKeepNext(true);
  };

  return (
    <>
      <SectionHeader
        title="Memory_0610"
        description="10日単位の短期記憶。持ち越す情報だけを次のMemoryへ残す。"
        meta={`${props.data.memories.filter((item) => item.keepNext).length} keep next`}
      />

      <form class="composer-panel" onSubmit={addMemory}>
        <div class="form-grid">
          <label>
            Title
            <input value={title()} onInput={(event) => setTitle(event.currentTarget.value)} placeholder="Component再利用方針" />
          </label>
          <label>
            Next Action
            <input value={nextAction()} onInput={(event) => setNextAction(event.currentTarget.value)} placeholder="ComponentBankへ登録" />
          </label>
          <label class="check-field">
            <input type="checkbox" checked={keepNext()} onChange={(event) => setKeepNext(event.currentTarget.checked)} />
            keepNext
          </label>
        </div>
        <label>
          Summary
          <textarea value={summary()} onInput={(event) => setSummary(event.currentTarget.value)} placeholder="10日単位で残す判断・方針・次に渡す情報" />
        </label>
        <div class="form-actions">
          <button class="primary-button" type="submit">Add Memory</button>
        </div>
      </form>

      <DataList
        items={props.data.memories}
        describe={(item) => `${item.summary} / next: ${item.nextAction}`}
        tags={(item) => [item.period, item.keepNext ? "keepNext" : "archive"]}
      />
    </>
  );
}
