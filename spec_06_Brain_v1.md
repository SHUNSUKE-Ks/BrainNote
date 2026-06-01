# spec_06_Brain_v1

## アプリ名

`06_Brain`

## 技術構成

`SolidJS + Vite + PWA + Tauri + JSON / MD`

## ディレクトリ案

```txt
06_Brain
├─ 00_WorkSpace
├─ 01_AI_Studio
├─ data
├─ src
└─ src-tauri
```

## 画面構成

- Dashboard: 全体状況を見る画面
- ReportBox: Reportを一覧表示する
- Knowledge Index: AIが共通知識化した資料の目次
- Memory_0610: 10日単位の短期記憶
- Function Ticket: AIに渡す要件カード

## PWAとTauriの役割

PWAは閲覧、軽い編集、JSON/MD Import/Exportを担う。Tauriはローカルフォルダ管理、Report収集、JSON/MD直接保存、DevStudio読み取り、Codexへ渡す資料生成を担う。

## 成果物

- `06_Brain_workspace_layout.html`
- `requirements_06_Brain_v1.md`
- `spec_06_Brain_v1.md`
- `ticket_function_layout_0610.json`
- `sample_report_0610.json`
- `sample_memory_0610.json`
- `sample_knowledge_index.json`
