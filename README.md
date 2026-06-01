# BrainNote

2026年6月の制作・開発情報を整理するWorkspaceアプリです。

## 起動

```sh
npm install
npm run dev
```

## 構成

- `src/screens`: Dashboard、ReportBox、Knowledge Index、Memory、Function Ticket
- `src/components`: 画面共通UI
- `src/dataBridge`: PWA保存とExport/Import。Tauri保存へ後から差し替える層
- `data`: JSONサンプル
- `00_WorkSpace`: 人間が見る場所
- `01_AI_Studio`: AIが整理・検索・共通知識化する場所
- `src-tauri`: 後続のTauri実装用

## 現在できること

- ReportBoxへReportを追加
- Knowledge Indexへ共通知識を追加
- Memory_0610へ短期記憶を追加
- Function Ticketを編集
- JSON / MD Export
- JSON Import

PWA版の保存先はブラウザのlocalStorageです。Tauri Desktop版では `src/dataBridge` の保存処理をローカルファイル保存へ差し替えます。

## ロゴ

- `public/icons/brainnote-icon.svg`: PWAアイコン
- `public/icons/brainnote-wordmark.svg`: 横長ワードマーク
