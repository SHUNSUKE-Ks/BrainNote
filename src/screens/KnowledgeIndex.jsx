import DataList from "../components/DataList";
import SectionHeader from "../components/SectionHeader";
import { createSignal } from "solid-js";
import { listFromText, makeId } from "../utils/formats";

export default function KnowledgeIndex(props) {
  const [title, setTitle] = createSignal("");
  const [category, setCategory] = createSignal("app_development");
  const [summary, setSummary] = createSignal("");
  const [keywords, setKeywords] = createSignal("SolidJS, Component, UI");

  const addKnowledge = (event) => {
    event.preventDefault();
    const nextEntry = {
      id: makeId("knowledge"),
      title: title().trim() || "Untitled Knowledge",
      category: category().trim() || "uncategorized",
      summary: summary().trim(),
      sourceReports: props.rawData.reports.slice(0, 1).map((report) => report.id),
      searchKeywords: listFromText(keywords())
    };

    props.onDataChange({
      ...props.rawData,
      knowledgeIndex: [nextEntry, ...props.rawData.knowledgeIndex]
    });

    setTitle("");
    setSummary("");
  };

  return (
    <>
      <SectionHeader
        title="Knowledge Index"
        description="AIがReportや資料を読み、共通知識として参照しやすい目次へ整理する。"
        meta={`${props.data.knowledgeIndex.length} entries`}
      />

      <form class="composer-panel" onSubmit={addKnowledge}>
        <div class="form-grid">
          <label>
            Title
            <input value={title()} onInput={(event) => setTitle(event.currentTarget.value)} placeholder="SolidJS Component設計" />
          </label>
          <label>
            Category
            <input value={category()} onInput={(event) => setCategory(event.currentTarget.value)} placeholder="app_development" />
          </label>
          <label class="wide-field">
            Search Keywords
            <input value={keywords()} onInput={(event) => setKeywords(event.currentTarget.value)} placeholder="SolidJS, Component, UI" />
          </label>
        </div>
        <label>
          Summary
          <textarea value={summary()} onInput={(event) => setSummary(event.currentTarget.value)} placeholder="共通知識として残す要点" />
        </label>
        <div class="form-actions">
          <button class="primary-button" type="submit">Add Knowledge</button>
        </div>
      </form>

      <DataList
        items={props.data.knowledgeIndex}
        describe={(item) => `${item.category} / ${item.summary}`}
        tags={(item) => item.searchKeywords}
      />
    </>
  );
}
