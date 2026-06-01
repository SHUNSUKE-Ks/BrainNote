# ERR_SOLIDJS_20260601_002_blank_screen_runtime_investigation

## Title

BrainNoteが背景色だけ表示され、SolidJS UIが描画されない

## Status

investigating

## Date

2026-06-01

## Project

- App: BrainNote
- Stack: SolidJS + Vite + PWA
- URL: `http://127.0.0.1:5187/`

## Observed Symptom

ブラウザでBrainNoteを開くと、ページ背景色だけが表示され、Sidebar / Dashboard / ReportBoxなどのUIが表示されない。

確認できていること:

- HTMLは配信されている
- `<title>BrainNote</title>` は取得できる
- CSSの背景色は適用されている
- `#root` 内のSolidJS UIが描画されていない
- DevTools上ではエラーが1件表示されているが、スクリーンショットでは詳細メッセージは未確認

## Current Interpretation

HTML/CSSは読み込めているため、問題はレイアウトCSSではなく、SolidJSのJavaScript module初期化または初回render中のruntime errorである可能性が高い。

## Confirmed Previous Issue

直前に以下の不具合を修正した。

```jsx
<input placeholder="C:\05__claude_workspace\..." />
```

JSX属性内のWindowsパスを `/` 表記へ変更した。

```jsx
<input placeholder="C:/05__claude_workspace/..." />
```

ただし、修正後も画面が空のため、別のruntime errorが残っている。

## Main Suspects

### 1. 古いlocalStorage schema

BrainNoteはPWA保存にlocalStorageを使っている。開発途中で以下のデータが増えた。

- `ideas`
- `workspaceBoard`
- `devTodo`
- `goals`

古いlocalStorageデータや手動ImportしたJSONにこれらが存在しない、または配列ではない場合、初期描画で落ちる可能性がある。

関連ファイル:

- [src/dataBridge/index.js](../../../src/dataBridge/index.js)
- [src/App.jsx](../../../src/App.jsx)
- [src/screens/Dashboard.jsx](../../../src/screens/Dashboard.jsx)

特に確認すべき箇所:

```js
reports: data.reports.filter(includesTerm)
ideas: data.ideas.filter(includesTerm)
workspaceBoard: data.workspaceBoard.filter(includesTerm)
```

```jsx
count={data().ideas.length}
count={data().workspaceBoard.length}
items={data().ideas.slice(0, 3)}
```

### 2. Dashboardが配列前提で描画している

Dashboardは初期画面なので、ここで例外が出るとアプリ全体が空になる。

関連ファイル:

- [src/screens/Dashboard.jsx](../../../src/screens/Dashboard.jsx)
- [src/components/DataList.jsx](../../../src/components/DataList.jsx)
- [src/components/StatCard.jsx](../../../src/components/StatCard.jsx)

疑う箇所:

```jsx
data().reports.length
data().ideas.length
data().workspaceBoard.length
data().knowledgeIndex.length
data().memories.length
```

### 3. DataListに渡すtagsが配列でない

DataListは `props.tags(item)` の戻り値を `<For>` に渡している。

関連ファイル:

- [src/components/DataList.jsx](../../../src/components/DataList.jsx)
- [src/screens/Dashboard.jsx](../../../src/screens/Dashboard.jsx)
- [src/screens/ReportBox.jsx](../../../src/screens/ReportBox.jsx)
- [src/screens/KnowledgeIndex.jsx](../../../src/screens/KnowledgeIndex.jsx)
- [src/screens/MemoryView.jsx](../../../src/screens/MemoryView.jsx)

疑う箇所:

```jsx
<For each={props.tags(item)}>{(tag) => <span class="tag">{tag}</span>}</For>
```

### 4. App全体のfallbackDataに未定義データが混ざる

`createInitialWorkspace` の引数が増えているため、importや初期値に漏れがあると描画前に落ちる。

関連ファイル:

- [src/App.jsx](../../../src/App.jsx)
- [src/data/sampleData.js](../../../src/data/sampleData.js)
- [src/dataBridge/index.js](../../../src/dataBridge/index.js)

確認箇所:

```js
const fallbackData = createInitialWorkspace({
  reports,
  knowledgeIndex,
  memories,
  functionTicket,
  goals,
  devTodo,
  ideas,
  workspaceBoard
});
```

### 5. JSX内のWindowsパス再発

現時点で `placeholder` 由来のWindowsパスは修正済み。ただし、今後再発しやすいので継続確認が必要。

関連ファイル:

- [src/screens/IdiaInbox.jsx](../../../src/screens/IdiaInbox.jsx)
- [src/screens/WorkspaceBoard.jsx](../../../src/screens/WorkspaceBoard.jsx)

確認済み:

```jsx
placeholder="C:/Users/enjoy/InBox2026/..."
placeholder="C:/05__claude_workspace/..."
```

## Proposed Fix Direction

### A. schema normalizeを強化する

`normalizeWorkspaceData` で、存在チェックだけでなく `Array.isArray` まで見る。

現在:

```js
reports: data.reports || fallbackData.reports
```

改善案:

```js
reports: Array.isArray(data.reports) ? data.reports : fallbackData.reports
```

対象:

- `reports`
- `knowledgeIndex`
- `memories`
- `tickets`
- `ideas`
- `workspaceBoard`

### B. Dashboard側も安全にする

Dashboardで直接 `.length` や `.slice` を呼ばず、安全な配列にしてから使う。

改善案:

```js
const reports = () => Array.isArray(data().reports) ? data().reports : [];
```

### C. Error Boundaryを追加する

SolidJSの描画エラーを真っ暗画面にせず、画面上にエラー内容を表示する。

候補:

- [src/App.jsx](../../../src/App.jsx)
- [src/index.jsx](../../../src/index.jsx)

### D. localStorage resetボタンを追加する

開発中はschemaが変わるため、UIからBrainNote保存データを初期化できると復旧が早い。

候補:

- [src/dataBridge/index.js](../../../src/dataBridge/index.js)
- [src/components/TopBar.jsx](../../../src/components/TopBar.jsx)

## Next Action

1. `normalizeWorkspaceData` を `Array.isArray` ベースに修正する
2. Dashboardの配列アクセスをsafe helper化する
3. Error Boundaryを追加する
4. ブラウザDevToolsのエラー本文を取得し、このReportの `Observed Log` に追記する

## Applied Mitigation

2026-06-01に以下を実施した。

- `normalizeWorkspaceData` で配列データを `Array.isArray` で検証するように変更
- `AppErrorBoundary` を追加し、SolidJS render errorを画面に表示するように変更

関連ファイル:

- [src/dataBridge/index.js](../../../src/dataBridge/index.js)
- [src/components/AppErrorBoundary.jsx](../../../src/components/AppErrorBoundary.jsx)
- [src/index.jsx](../../../src/index.jsx)
- [src/styles/index.css](../../../src/styles/index.css)

これにより、古いlocalStorage schemaが原因の場合はfallbackDataへ戻し、別のruntime errorの場合は画面にエラー本文を表示できる見込み。

## ReportBox Entry

```json
{
  "id": "report_solidjs_error_20260601_002",
  "title": "BrainNoteが背景色だけ表示されSolidJS UIが描画されない",
  "source": "BrainNote",
  "type": "md",
  "tags": ["SolidJS", "PWA", "runtime_error", "blank_screen", "localStorage"],
  "createdAt": "2026-06-01",
  "body": "HTML/CSSは読み込まれるがSolidJS UIが描画されない。localStorage schema、Dashboardの配列前提アクセス、AppのfilteredDataを主な原因候補として調査中。"
}
```
