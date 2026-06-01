import DataList from "../components/DataList";
import SectionHeader from "../components/SectionHeader";
import { createSignal } from "solid-js";
import { listFromText, makeId } from "../utils/formats";

export default function ReportBox(props) {
  const [title, setTitle] = createSignal("");
  const [source, setSource] = createSignal("Codex");
  const [type, setType] = createSignal("md");
  const [tags, setTags] = createSignal("component, layout");
  const [body, setBody] = createSignal("");

  const addReport = (event) => {
    event.preventDefault();
    const nextReport = {
      id: makeId("report_0610"),
      title: title().trim() || "Untitled Report",
      source: source().trim() || "Unknown",
      type: type(),
      tags: listFromText(tags()),
      createdAt: new Date().toISOString().slice(0, 10),
      body: body().trim()
    };

    props.onDataChange({
      ...props.rawData,
      reports: [nextReport, ...props.rawData.reports]
    });

    setTitle("");
    setBody("");
  };

  return (
    <>
      <SectionHeader
        title="ReportBox"
        description="他アプリやCodexから送られてくるReportの入口。MD/JSONを同じ一覧で扱う。"
        meta={`${props.data.reports.length} reports`}
      />

      <form class="composer-panel" onSubmit={addReport}>
        <div class="form-grid">
          <label>
            Title
            <input value={title()} onInput={(event) => setTitle(event.currentTarget.value)} placeholder="Codex作業報告" />
          </label>
          <label>
            Source
            <input value={source()} onInput={(event) => setSource(event.currentTarget.value)} placeholder="Codex" />
          </label>
          <label>
            Type
            <select value={type()} onChange={(event) => setType(event.currentTarget.value)}>
              <option value="md">md</option>
              <option value="json">json</option>
              <option value="txt">txt</option>
            </select>
          </label>
          <label>
            Tags
            <input value={tags()} onInput={(event) => setTags(event.currentTarget.value)} placeholder="component, layout" />
          </label>
        </div>
        <label>
          Body
          <textarea value={body()} onInput={(event) => setBody(event.currentTarget.value)} placeholder="Report本文、要約、Codexからの受け取り内容" />
        </label>
        <div class="form-actions">
          <button class="primary-button" type="submit">Add Report</button>
        </div>
      </form>

      <DataList
        items={props.data.reports}
        describe={(item) => `${item.source} / ${item.type} / ${item.createdAt} / ${item.body}`}
        tags={(item) => item.tags}
      />
    </>
  );
}
