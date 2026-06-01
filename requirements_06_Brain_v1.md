# requirements_06_Brain_v1

## 目的

06_Brainは、2026年6月の制作・開発情報を整理するためのWorkspaceアプリである。

PWAでは持ち歩き・閲覧・軽い編集を行い、Tauri Desktopではローカルファイル管理・JSON/MD保存・Report集約を行う。

## 基本方針

- 分類で迷わないUIにする
- 人間が見る場所は `00_WorkSpace`
- AIが整理・検索・共通知識化する場所は `01_AI_Studio`
- Reportを集め、Component化し、再利用できる形にする
- JSON/MDを共通データ形式にする
- 最初はHTMLモックで本番に近いレイアウトを作る

## 主要機能

### ReportBox

他アプリやCodexから送られてくるReportの入口。

### Knowledge Index

AI側が管理する共通知識の目次。

### Memory_0610

10日単位の短期記憶。10日ごとに内容を精査し、次へ持ち越す情報だけ残す。

### AllDevStudio

各プロジェクト内にあるDevStudio情報を集約し、現在状況を把握する。

### Component Bank

Reportから再利用できるUI・コード・設計をComponentとして集める。

### Function Ticket

コードなしでもAIに機能を伝える要件カード。

## 今回の優先実装

1. HTMLモック作成
2. ReportBox画面
3. Knowledge Index画面
4. Memory_0610画面
5. Function Ticket画面
6. JSON/MD Export
7. Tauri用ローカル保存
