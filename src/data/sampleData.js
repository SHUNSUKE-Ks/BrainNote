export const reports = [
  {
    id: "report_note00_gallerynotedb_start_20260601",
    title: "note00-gallerynotedb_vol1.1 開発開始",
    source: "Codex",
    type: "md",
    tags: ["start_report", "note_app", "NACCSystem", "UPNOTE", "gallery", "database", "relation"],
    createdAt: "2026-06-01",
    body: "NACC Systemを06_AppListへクローンし、化粧品用途ではない汎用ノートアプリとして再構成する。UPNOTE仕様ノートは既存ノートから分離し、state駆動でeditor/gallery/database/relation/sidePanelのユーザー状態を追える構成にする。"
  },
  {
    id: "report_solidjs_error_20260601_002",
    title: "BrainNoteが背景色だけ表示されSolidJS UIが描画されない",
    source: "BrainNote",
    type: "md",
    tags: ["SolidJS", "PWA", "runtime_error", "blank_screen", "localStorage"],
    createdAt: "2026-06-01",
    body: "HTML/CSSは読み込まれるがSolidJS UIが描画されない。localStorage schema、Dashboardの配列前提アクセス、AppのfilteredDataを主な原因候補として調査中。"
  },
  {
    id: "report_solidjs_error_20260601_001",
    title: "JSX placeholder内のWindowsパスでSolidJSが起動前に落ちる",
    source: "BrainNote",
    type: "md",
    tags: ["SolidJS", "JSX", "Vite", "WindowsPath", "bug"],
    createdAt: "2026-06-01",
    body: "JSX内のplaceholderにWindowsパスをそのまま書いたことで、SolidJS UIが描画されず背景だけ表示された。placeholderをC:/形式へ変更して修正。"
  },
  {
    id: "report_brainnote_self_0610_001",
    title: "BrainNoteアプリ開発Report",
    source: "BrainNote",
    type: "md",
    tags: ["self_report", "workspace", "pwa"],
    createdAt: "2026-06-01",
    body: "BrainNote自身の開発完了時に、機能・画面・データ構造・DONEをReportBoxへ提出するための自己Report枠。"
  },
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

export const devTodo = {
  updatedAt: "2026-06-01",
  groups: [
    {
      title: "DONE",
      items: [
        { id: "todo_html_mock", text: "HTMLモック作成", done: true },
        { id: "todo_solid_pwa", text: "SolidJS + Vite PWA構成", done: true },
        { id: "todo_brand", text: "BrainNote PWAロゴ作成", done: true },
        { id: "todo_goals", text: "KGI / KPI / DONE管理", done: true },
        { id: "todo_promote_knowledge", text: "ReportからKnowledgeへの昇格", done: true }
      ]
    },
    {
      title: "CURRENT",
      items: [
        { id: "todo_dev_todo_screen", text: "開発TODOをBrainNote上でも閲覧できるようにする", done: false },
        { id: "todo_report_to_memory", text: "ReportからMemoryへ昇格", done: false },
        { id: "todo_report_to_ticket", text: "ReportからFunction Ticketへ昇格", done: false }
      ]
    },
    {
      title: "NEXT DONE",
      items: [
        { id: "todo_editable_records", text: "Report / Knowledge / Memory / Ticketの既存行を編集・削除できる", done: false },
        { id: "todo_all_devstudio", text: "AllDevStudio画面の初期モックを作る", done: false },
        { id: "todo_component_bank", text: "Component Bank画面を作る", done: false }
      ]
    },
    {
      title: "BACKLOG",
      items: [
        { id: "todo_tauri", text: "Tauri Desktop本体設定", done: false },
        { id: "todo_local_save", text: "TauriでJSON/MDをローカル保存", done: false },
        { id: "todo_report_watch", text: "Reportフォルダ監視", done: false },
        { id: "todo_deploy", text: "GitHub Pages / PWAデプロイ", done: false }
      ]
    }
  ]
};

export const ideas = [
  {
    id: "idia_note_app_share_v05_001",
    title: "NaccSystemを新たなノートアプリとして進化させる",
    sourcePath: "C:\\Users\\enjoy\\InBox2026\\InBox0601\\note_app_share_v05\\note_app_share_v05",
    body: "NaccSystemを新たなノートアプリとして作るとき、Noteの書き込みを合わせていく。",
    tags: ["note_app", "NaccSystem", "writing_flow", "sample_app"],
    gate: "review",
    createdAt: "2026-06-01"
  }
];

export const workspaceBoard = [
  {
    lane: "Inbox",
    title: "外でCodexに画像生成してほしいメモ",
    kind: "idia",
    tags: ["image_generation", "outside_codex", "android_memo"],
    source: "PWA Android memo",
    body: "外出中に思いついた画像生成依頼をIDIAとしてため、帰宅後にDesktop側でフォルダへまとめる。"
  },
  {
    lane: "Inbox",
    title: "雑多なアイディアを企画書・資料・スライドにする",
    kind: "idia",
    tags: ["planning", "slides", "documents"],
    source: "PWA Android memo",
    body: "荒いメモをReport/IDIAとして蓄積し、後でCodexに企画書やスライド化を相談する。"
  },
  {
    lane: "Sort",
    title: "NaccSystemノートアプリ化資料",
    kind: "local_path",
    tags: ["NaccSystem", "note_app", "sample_app"],
    source: "C:\\Users\\enjoy\\InBox2026\\InBox0601\\note_app_share_v05\\note_app_share_v05",
    body: "NaccSystemをノートアプリへ転用するときの資料として分類する。"
  },
  {
    lane: "Codex相談",
    title: "NACCアプリ分析Report作成",
    kind: "report_request",
    tags: ["report", "component_analysis", "layout"],
    source: "C:\\05__claude_workspace\\05_app\\NACC_System\\nacc-app",
    body: "化粧品用アプリを別ジャンルのノートアプリへ進化させるサンプルとして、機能・レイアウト・ComponentをReport化する。"
  },
  {
    lane: "Folderまとめ",
    title: "DesktopでCodex相談用フォルダにまとめる",
    kind: "desktop_batch",
    tags: ["tauri", "local_folder", "codex_context"],
    source: "BrainNote Desktop",
    body: "PWAでためたIDIA/Reportを、帰宅後にTauri DesktopでlocalフォルダへMD/JSONとしてまとめる。"
  }
];
