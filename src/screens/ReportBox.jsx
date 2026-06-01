import DataList from "../components/DataList";
import SectionHeader from "../components/SectionHeader";
import { Show, createSignal } from "solid-js";
import { listFromText, makeId } from "../utils/formats";

export default function ReportBox(props) {
  const [title, setTitle] = createSignal("");
  const [source, setSource] = createSignal("Codex");
  const [type, setType] = createSignal("md");
  const [tags, setTags] = createSignal("component, layout");
  const [body, setBody] = createSignal("");
  const [promoteReport, setPromoteReport] = createSignal(null);
  const [knowledgeTitle, setKnowledgeTitle] = createSignal("");
  const [knowledgeCategory, setKnowledgeCategory] = createSignal("app_development");
  const [knowledgeSummary, setKnowledgeSummary] = createSignal("");
  const [knowledgeKeywords, setKnowledgeKeywords] = createSignal("");

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

  const openPromotion = (report) => {
    setPromoteReport(report);
    setKnowledgeTitle(report.title);
    setKnowledgeCategory(suggestCategory(report));
    setKnowledgeSummary(makeSummaryDraft(report.body));
    setKnowledgeKeywords([...new Set([...(report.tags || []), report.source, report.type])].filter(Boolean).join(", "));
  };

  const promoteToKnowledge = (event) => {
    event.preventDefault();
    const report = promoteReport();
    if (!report) return;

    const nextKnowledge = {
      id: makeId("knowledge"),
      title: knowledgeTitle().trim() || report.title,
      category: knowledgeCategory().trim() || "uncategorized",
      summary: knowledgeSummary().trim(),
      sourceReports: [report.id],
      searchKeywords: listFromText(knowledgeKeywords())
    };

    props.onDataChange({
      ...props.rawData,
      knowledgeIndex: [nextKnowledge, ...props.rawData.knowledgeIndex],
      reports: props.rawData.reports.map((item) =>
        item.id === report.id
          ? { ...item, promotedToKnowledge: nextKnowledge.id, promotedAt: new Date().toISOString() }
          : item
      )
    });

    setPromoteReport(null);
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

      <Show when={promoteReport()}>
        <form class="promotion-panel" onSubmit={promoteToKnowledge}>
          <div class="promotion-header">
            <div>
              <h2>Knowledgeへ昇格</h2>
              <p>Reportの一時情報から、後で検索・再利用できる共通知識を作る。</p>
            </div>
            <button class="ghost-button" type="button" onClick={() => setPromoteReport(null)}>Cancel</button>
          </div>
          <div class="form-grid">
            <label>
              Knowledge Title
              <input value={knowledgeTitle()} onInput={(event) => setKnowledgeTitle(event.currentTarget.value)} />
            </label>
            <label>
              Category
              <input value={knowledgeCategory()} onInput={(event) => setKnowledgeCategory(event.currentTarget.value)} />
            </label>
            <label class="wide-field">
              Search Keywords
              <input value={knowledgeKeywords()} onInput={(event) => setKnowledgeKeywords(event.currentTarget.value)} />
            </label>
          </div>
          <label>
            Summary
            <textarea value={knowledgeSummary()} onInput={(event) => setKnowledgeSummary(event.currentTarget.value)} />
          </label>
          <div class="source-note">sourceReport: {promoteReport().id}</div>
          <div class="form-actions">
            <button class="primary-button" type="submit">Promote to Knowledge</button>
          </div>
        </form>
      </Show>

      <DataList
        items={props.data.reports}
        describe={(item) =>
          `${item.source} / ${item.type} / ${item.createdAt} / ${item.body}${
            item.promotedToKnowledge ? ` / promoted: ${item.promotedToKnowledge}` : ""
          }`
        }
        tags={(item) => item.promotedToKnowledge ? [...item.tags, "promoted"] : item.tags}
        actions={(item) => (
          <button class="ghost-button small-button" type="button" onClick={() => openPromotion(item)}>
            Knowledgeへ昇格
          </button>
        )}
      />
    </>
  );
}

function makeSummaryDraft(body) {
  const normalized = String(body || "").replace(/\s+/g, " ").trim();
  if (!normalized) return "";
  return normalized.length > 120 ? `${normalized.slice(0, 120)}...` : normalized;
}

function suggestCategory(report) {
  const text = `${report.title} ${(report.tags || []).join(" ")} ${report.body}`.toLowerCase();
  if (text.includes("ui") || text.includes("layout") || text.includes("component")) return "ui_design";
  if (text.includes("asset") || text.includes("prompt")) return "asset_creation";
  if (text.includes("tauri") || text.includes("solidjs") || text.includes("code")) return "app_development";
  return "general";
}
