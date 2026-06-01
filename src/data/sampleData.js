export const reports = [
  {
    id: "report_0610_001",
    title: "Codex作業報告",
    source: "Codex",
    type: "md",
    tags: ["component", "layout"],
    createdAt: "2026-06-01",
    body: "06_BrainのHTMLモックをSolidJS Componentへ分解する。"
  },
  {
    id: "report_0610_002",
    title: "Prompt Gallery Report",
    source: "PromptGallery",
    type: "json",
    tags: ["asset", "prompt"],
    createdAt: "2026-06-01",
    body: "素材制作プロンプトと生成結果を再利用可能な単位で整理する。"
  }
];

export const knowledgeIndex = [
  {
    id: "knowledge_app_dev_001",
    title: "SolidJS Component設計",
    category: "app_development",
    summary: "SolidJSでComponentを分ける考え方",
    sourceReports: ["report_0610_001"],
    searchKeywords: ["SolidJS", "Component", "UI"]
  },
  {
    id: "knowledge_ui_design_001",
    title: "Workspace分類設計",
    category: "ui_design",
    summary: "人間向けWorkspaceとAI向けStudioを分け、迷わず入力できる画面構成にする。",
    sourceReports: ["report_0610_001"],
    searchKeywords: ["Workspace", "AI Studio", "分類"]
  }
];

export const memories = [
  {
    id: "memory_0610_001",
    period: "0610",
    title: "Component再利用方針",
    keepNext: true,
    summary: "ReportをComponentに分けて再利用する",
    nextAction: "ComponentBankへ登録"
  },
  {
    id: "memory_0610_002",
    period: "0610",
    title: "Tauri保存はdataBridgeへ隔離",
    keepNext: true,
    summary: "PWAではlocalStorage、Tauriではファイル保存へ差し替える。",
    nextAction: "Desktop版でsaveJson/saveMarkdownを実装"
  }
];

export const functionTicket = {
  id: "ticket_function_layout_0610",
  title: "Function Ticket",
  type: "requirement_card",
  image: "svg_layout_ticket_1280x720",
  dict: {
    ReportBox: "他アプリからの報告入口",
    Knowledge: "AIが共通知識化するIndex",
    Memory: "10日単位の短期記憶",
    ComponentBank: "再利用できるUI/コード置き場"
  },
  request: "このTicketをもとにSolidJS Componentへ分解する",
  output: ["SolidJS Component", "JSON Schema", "MD仕様書"]
};

export const goals = {
  kgi: "BrainNoteを、6月の制作・開発情報を迷わず集約し、次の制作判断に使えるWorkspaceにする。",
  kpis: [
    { id: "kpi_report_count", label: "Report登録数", target: "30件", current: "2件" },
    { id: "kpi_knowledge_count", label: "Knowledge昇格数", target: "12件", current: "2件" },
    { id: "kpi_memory_review", label: "Memory精査", target: "0610 / 0620 / 0630", current: "0610準備中" }
  ],
  doneDefinitions: [
    {
      id: "done_pwa_mock",
      milestone: "PWA Mock",
      outcome: "Dashboard、ReportBox、Knowledge、Memory、Ticketをブラウザで触れる",
      releaseReady: true
    },
    {
      id: "done_report_to_knowledge",
      milestone: "Report to Knowledge",
      outcome: "Reportを読み、共通知識としてKnowledge Indexへ昇格できる",
      releaseReady: false
    },
    {
      id: "done_tauri_save",
      milestone: "Tauri Local Save",
      outcome: "JSON/MDをローカルフォルダへ直接保存できる",
      releaseReady: false
    }
  ]
};

export const devTasks = [
  { lane: "Inbox", title: "Reportを集める", meta: "source: ReportBox" },
  { lane: "Inbox", title: "DevStudioを読む", meta: "source: AllDevStudio" },
  { lane: "Divide", title: "Componentに分解", meta: "target: reusable UI/code" },
  { lane: "Divide", title: "機能Ticket化", meta: "target: requirement card" },
  { lane: "Build", title: "SVG + JSON Layout", meta: "output: layout_ticket.json" },
  { lane: "Export", title: "Codexへ渡す", meta: "format: MD + JSON" }
];
