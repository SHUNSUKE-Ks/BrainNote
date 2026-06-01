# FIX_SOLIDJS_20260601_002 — エラー根本原因と解決案

## Status

implemented（2026-06-01）

## Date

2026-06-01

## Observed Error

```
BrainNote render error
Cannot read properties of undefined (reading 'data')
```

スクリーンショットで確認されたエラーは `AppErrorBoundary` が catch して表示している。
つまり **SolidJS の render 中に throw** が起きている。

---

## 根本原因の特定

### ★ 最有力原因：`Screen` コンポーネントへの `props.data` アクセスパターン

エラーメッセージ `Cannot read properties of undefined (reading 'data')` は、
**あるコンポーネントが `props` 自体を `undefined` として受け取っている**、
もしくは **`props.data` が `undefined` の状態でプロパティアクセスしている** ことを示す。

#### 発生箇所の特定

[App.jsx:71](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/App.jsx#L71) で動的コンポーネントを描画している：

```jsx
<Screen data={filteredData()} rawData={workspaceData()} onDataChange={updateWorkspace} />
```

ここで `Screen` は `createMemo` で取得した**コンポーネント参照**：

```jsx
const Screen = createMemo(() => screens[activeScreen()] || Dashboard);
```

**問題点：SolidJS では動的コンポーネントを JSX で使う場合、`createMemo` の戻り値をそのまま `<Screen ... />` として使うと、SolidJS コンパイラが `Screen` を通常の関数呼び出しとして処理する場合がある。** しかし、この書き方自体はSolidJSで一般的に許容されるため、これが直接原因の可能性は中程度。

#### より確実な原因：`filteredData()` 内の `data` が初期描画時に不完全

[App.jsx:37-53](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/App.jsx#L37-L53) の `filteredData` 内で：

```js
const filteredData = createMemo(() => {
  const term = query().trim().toLowerCase();
  const data = workspaceData();
  if (!term) return data;

  const includesTerm = (value) => JSON.stringify(value).toLowerCase().includes(term);
  return {
    ...data,
    reports: data.reports.filter(includesTerm),
    goals: includesTerm(data.goals) ? data.goals : data.goals,
    ideas: data.ideas.filter(includesTerm),
    workspaceBoard: data.workspaceBoard.filter(includesTerm),
    knowledgeIndex: data.knowledgeIndex.filter(includesTerm),
    memories: data.memories.filter(includesTerm),
    tickets: data.tickets.filter(includesTerm)
  };
});
```

**`term` が空の場合は `data` がそのまま返される。** つまり初期表示では `workspaceData()` がそのまま各画面に渡る。

### ★★ 最有力の直接原因：localStorage に保存された古いデータに `data` キーが存在する

`normalizeWorkspaceData` は以下の処理を行う：

```js
function normalizeWorkspaceData(data, fallbackData) {
  return {
    ...fallbackData,
    ...data,          // ← ★ ここで localStorage の全キーが上書きされる
    reports: arrayOrFallback(data.reports, fallbackData.reports),
    ...
  };
}
```

**`...data` のスプレッドにより、localStorage 側に意図しないキー（例：`tickets` が配列でなくオブジェクトになっている、`devTodo` が `null`、あるいは古いバージョンで保存された不完全なデータ）が混入し、個別の `arrayOrFallback` で上書きされないプロパティが壊れた状態で残る可能性がある。**

特に、Import 機能 ([ExportButtons.jsx:7-9](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/components/ExportButtons.jsx#L7-L9)) では：

```js
const nextData = await readImportedJson(file);
const saved = await saveWorkspaceData(nextData);
props.onDataChange(saved);
```

**Import されたJSON は `normalizeWorkspaceData` を通さずにそのまま `saveWorkspaceData` → `setWorkspaceData` へ流れる。** Import JSON にフィールドが不足していれば、次回のロード時に壊れたデータがそのまま使われる。

---

## 全エラー箇所の一覧

以下は、`props.data` のプロパティに安全ガードなく直接アクセスしている全箇所。

### 危険度 A（初期描画で即 throw する箇所）

| # | ファイル | 行 | コード | 理由 |
|---|---------|-----|--------|------|
| A1 | [Dashboard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/Dashboard.jsx#L17) | 17 | `data().reports.length` | `reports` が `undefined` なら throw |
| A2 | [Dashboard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/Dashboard.jsx#L20) | 20 | `data().ideas.length` | 同上 |
| A3 | [Dashboard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/Dashboard.jsx#L23) | 23 | `data().workspaceBoard.length` | 同上 |
| A4 | [Dashboard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/Dashboard.jsx#L26) | 26 | `data().knowledgeIndex.length` | 同上 |
| A5 | [Dashboard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/Dashboard.jsx#L29) | 29 | `data().memories.length` | 同上 |
| A6 | [Dashboard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/Dashboard.jsx#L37) | 37 | `data().reports.slice(0, 3)` | 同上 |
| A7 | [Dashboard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/Dashboard.jsx#L46) | 46 | `data().ideas.slice(0, 3)` | 同上 |
| A8 | [FunctionTicket.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/FunctionTicket.jsx#L7) | 7 | `props.data.tickets[0]` | `tickets` が `undefined` なら throw |
| A9 | [ReportBox.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/ReportBox.jsx#L79) | 79 | `props.data.reports.length` | 同上 |
| A10 | [KnowledgeIndex.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/KnowledgeIndex.jsx#L37) | 37 | `props.data.knowledgeIndex.length` | 同上 |
| A11 | [MemoryView.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/MemoryView.jsx#L39) | 39 | `props.data.memories.filter(...)` | 同上 |
| A12 | [WorkspaceBoard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/WorkspaceBoard.jsx#L52) | 52 | `props.data.workspaceBoard.length` | 同上 |

### 危険度 B（画面遷移やデータ操作で throw する箇所）

| # | ファイル | 行 | コード | 理由 |
|---|---------|-----|--------|------|
| B1 | [App.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/App.jsx#L45) | 45 | `data.reports.filter(includesTerm)` | 検索時 |
| B2 | [App.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/App.jsx#L47) | 47 | `data.ideas.filter(includesTerm)` | 検索時 |
| B3 | [App.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/App.jsx#L48) | 48 | `data.workspaceBoard.filter(...)` | 検索時 |
| B4 | [App.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/App.jsx#L49) | 49 | `data.knowledgeIndex.filter(...)` | 検索時 |
| B5 | [App.jsx](file:///C:/Users/enjoy/InBox0601/06_Brain/src/App.jsx#L50) | 50 | `data.memories.filter(...)` | 検索時 |
| B6 | [App.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/App.jsx#L51) | 51 | `data.tickets.filter(...)` | 検索時 |
| B7 | [TaskBoard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/components/TaskBoard.jsx#L2) | 2 | `import { devTasks } from "../data/sampleData"` | `devTasks` は **export されていない** → `undefined` |

### 危険度 C（間接的に不整合を起こす箇所）

| # | ファイル | 行 | コード | 理由 |
|---|---------|-----|--------|------|
| C1 | [ExportButtons.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/components/ExportButtons.jsx#L7-L9) | 7-9 | `readImportedJson` → `saveWorkspaceData` | normalize なしで保存 |
| C2 | [normalizeWorkspaceData](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/dataBridge/index.js#L128-L129) | 128-129 | `...fallbackData, ...data` | 古いキーが上書きされる |

---

## ★ 今回のエラーの最も可能性が高いシナリオ

1. **開発途中で localStorage にデータが保存された**（`ideas`, `workspaceBoard`, `tickets` 等が追加される前のバージョン）
2. **新しいコードが追加されたが、ブラウザの localStorage には古いデータが残っている**
3. `loadWorkspaceData` → `normalizeWorkspaceData` で `...data` のスプレッドにより、**古いデータ側に存在しないキーが fallback で補完されるはずだが、`...data` が後にスプレッドされるので個別フィールドで上書き**… いや、実は個別フィールド（`reports`, `ideas` 等）は `arrayOrFallback` で後から再設定しているので正しく上書きされるはず。
4. **ただし `normalizeWorkspaceData` の `...data` スプレッドの順序問題**：

```js
return {
  ...fallbackData,   // (1) fallback全キーを展開
  ...data,           // (2) localStorage全キーで上書き ← ここで未定義キーが入る
  reports: arrayOrFallback(data.reports, fallbackData.reports),  // (3) 個別に再設定
  ...
};
```

**(2) の `...data` で `tickets: undefined` のようなキーが入ると、(3) で上書きされるので問題ない。**

**→ つまり `normalizeWorkspaceData` 自体は正しく動作するはず。**

### ★★★ 真の原因：Import 経路の normalize 漏れ

[ExportButtons.jsx L7-9](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/components/ExportButtons.jsx#L7-L9):

```js
const importJson = async (event) => {
  const file = event.currentTarget.files?.[0];
  if (!file) return;
  const nextData = await readImportedJson(file);     // ← JSON をそのまま parse
  const saved = await saveWorkspaceData(nextData);    // ← normalize せずに保存
  props.onDataChange(saved);                          // ← setWorkspaceData に直接渡す
  event.currentTarget.value = "";
};
```

**Import した JSON に `reports`, `ideas`, `tickets` 等が存在しない場合、`undefined` のまま `workspaceData` signal に設定される。**
次に Dashboard が `data().reports.length` を呼んだ瞬間に **`Cannot read properties of undefined`** が発生する。

**しかし、Import を使っていなくても発生しうるもう一つの経路がある：**

### もう一つの可能性：localStorage に手動で不正なデータが入った

localStorage のキー `06_brain_workspace_data_v1` に直接ブラウザの DevTools から値を書いた、または古いバージョンの export JSON をそのまま Import した場合、`normalizeWorkspaceData` では対処できないレベルの不整合（例：`data` 自体が null / string）が発生しうる。

---

## 解決案

### 解決案 1：Import 経路に `normalizeWorkspaceData` を追加（★ 最優先）

**対象ファイル：** [ExportButtons.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/components/ExportButtons.jsx)

```jsx
// 修正前
const nextData = await readImportedJson(file);
const saved = await saveWorkspaceData(nextData);

// 修正後
const rawImport = await readImportedJson(file);
const normalized = normalizeWorkspaceData(rawImport, fallbackData);
const saved = await saveWorkspaceData(normalized);
```

**課題：** `fallbackData` と `normalizeWorkspaceData` を ExportButtons に渡す必要がある。

**実装方法：**
- `normalizeWorkspaceData` を `dataBridge/index.js` から export する
- `App.jsx` から `fallbackData` を props 経由で渡す
- または `dataBridge/index.js` に `importAndNormalize(file, fallbackData)` 関数を新設する

---

### 解決案 2：`normalizeWorkspaceData` の `...data` スプレッド順序を修正

**対象ファイル：** [dataBridge/index.js](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/dataBridge/index.js#L126-L139)

```js
// 修正前
function normalizeWorkspaceData(data, fallbackData) {
  return {
    ...fallbackData,
    ...data,  // ← 不要なキーまで入る
    reports: arrayOrFallback(data.reports, fallbackData.reports),
    ...
  };
}

// 修正後：...data のスプレッドを削除し、必要なキーだけ明示的に設定
function normalizeWorkspaceData(data, fallbackData) {
  return {
    reports: arrayOrFallback(data.reports, fallbackData.reports),
    knowledgeIndex: arrayOrFallback(data.knowledgeIndex, fallbackData.knowledgeIndex),
    memories: arrayOrFallback(data.memories, fallbackData.memories),
    tickets: arrayOrFallback(data.tickets, fallbackData.tickets),
    goals: data.goals || fallbackData.goals,
    devTodo: data.devTodo || fallbackData.devTodo,
    ideas: arrayOrFallback(data.ideas, fallbackData.ideas),
    workspaceBoard: arrayOrFallback(data.workspaceBoard, fallbackData.workspaceBoard),
    updatedAt: data.updatedAt || fallbackData.updatedAt
  };
}
```

**利点：** 未知のキーが workspace data に混入しない。schema が明示的になる。

---

### 解決案 3：各画面コンポーネントに safe accessor を追加

**対象ファイル：** [Dashboard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/Dashboard.jsx), 他全画面

```jsx
// 修正前
const data = () => props.data;
// data().reports.length  ← reports が undefined なら throw

// 修正後
const data = () => props.data || {};
const safeArray = (key) => Array.isArray(data()[key]) ? data()[key] : [];
// safeArray("reports").length  ← 必ず安全
```

**利点：** 画面単位で即落ちを防げる。ErrorBoundary と組み合わせると段階的に復旧できる。

---

### 解決案 4：`filteredData` memo 内に安全ガードを追加

**対象ファイル：** [App.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/App.jsx#L37-L53)

```js
// 修正後
const filteredData = createMemo(() => {
  const term = query().trim().toLowerCase();
  const data = workspaceData();
  if (!data) return fallbackData;  // ← null/undefined ガード追加
  if (!term) return data;

  const safe = (key) => Array.isArray(data[key]) ? data[key] : [];
  const includesTerm = (value) => JSON.stringify(value).toLowerCase().includes(term);
  return {
    ...data,
    reports: safe("reports").filter(includesTerm),
    goals: includesTerm(data.goals) ? data.goals : data.goals,
    ideas: safe("ideas").filter(includesTerm),
    workspaceBoard: safe("workspaceBoard").filter(includesTerm),
    knowledgeIndex: safe("knowledgeIndex").filter(includesTerm),
    memories: safe("memories").filter(includesTerm),
    tickets: safe("tickets").filter(includesTerm)
  };
});
```

---

### 解決案 5：`TaskBoard.jsx` の未定義 import を修正

**対象ファイル：** [TaskBoard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/components/TaskBoard.jsx#L2)

```js
// 修正前
import { devTasks } from "../data/sampleData";  // ← devTasks は export されていない
```

`sampleData.js` には `devTasks` という export は存在しない。現在 `TaskBoard` は Sidebar から直接呼ばれていないため即 crash しないが、**将来この画面を有効にした瞬間に throw する**。

**修正案：**
- `devTasks` を使わず、props 経由でデータを受け取る設計に変更する
- または `sampleData.js` に `devTasks` を追加する

---

### 解決案 6：localStorage リセットで即時復旧（応急処置）

ブラウザの DevTools Console で以下を実行すると、古いデータを消して fallback に戻る：

```js
localStorage.removeItem("06_brain_workspace_data_v1");
location.reload();
```

**利点：** コード変更不要で即時復旧。
**欠点：** 保存済みデータが消える。根本修正にはならない。

---

### 解決案 7：AppErrorBoundary にリセットボタンを追加

**対象ファイル：** [AppErrorBoundary.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/components/AppErrorBoundary.jsx)

```jsx
function AppError(props) {
  const resetStorage = () => {
    localStorage.removeItem("06_brain_workspace_data_v1");
    location.reload();
  };

  return (
    <main class="app-error">
      <section class="app-error-panel">
        <h1>BrainNote render error</h1>
        <p>...</p>
        <pre>{String(props.error?.message || props.error)}</pre>
        <button onClick={resetStorage}>
          localStorageをリセットして再起動
        </button>
      </section>
    </main>
  );
}
```

---

## 推奨実施順序

| 優先度 | 解決案 | 効果 | 工数 |
|--------|--------|------|------|
| ★★★ | 案6：localStorage リセット | 即時復旧（応急処置） | 0分 |
| ★★★ | 案1：Import normalize 追加 | 再発防止の根本修正 | 15分 |
| ★★☆ | 案2：normalize スプレッド修正 | schema を明示化 | 10分 |
| ★★☆ | 案4：filteredData 安全ガード | 検索時 crash 防止 | 5分 |
| ★☆☆ | 案3：各画面 safe accessor | 防御的プログラミング | 30分 |
| ★☆☆ | 案7：エラー画面にリセットボタン | UX 改善 | 10分 |
| ★☆☆ | 案5：TaskBoard import 修正 | 将来の crash 防止 | 5分 |

---

## まとめ

今回のエラー `Cannot read properties of undefined (reading 'data')` の原因は、**localStorage に保存された古いデータ、または Import された不完全な JSON が `normalizeWorkspaceData` を通らずに `workspaceData` signal に設定され、各画面コンポーネントが `undefined` プロパティに `.length` / `.filter` / `.slice` を呼んで throw している**ことが最も可能性が高い。

**まず案6（localStorage リセット）で即時復旧し、その後 案1 + 案2 + 案4 を適用して再発を防止する**のが推奨手順。

---

## 実行結果

2026-06-01 に以下を実装した。

- [App.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/App.jsx) の動的画面描画を `<Dynamic component={CurrentScreen()} />` に変更
- `filteredData` に配列安全ガードを追加
- [dataBridge/index.js](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/dataBridge/index.js) の `normalizeWorkspaceData` を export し、schemaを明示的に返す形へ変更
- [ExportButtons.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/components/ExportButtons.jsx) のImport経路で `normalizeWorkspaceData` を通すよう変更
- [AppErrorBoundary.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/components/AppErrorBoundary.jsx) に localStorage reset button を追加
- [TaskBoard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/components/TaskBoard.jsx) の存在しない `devTasks` import を削除
- [Dashboard.jsx](file:///C:/Users/enjoy/InBox2026/InBox0601/06_Brain/src/screens/Dashboard.jsx) に safe accessor を追加

確認結果：

```txt
npm run build: pass
http://127.0.0.1:5187/: 200
http://127.0.0.1:5187/src/App.jsx: Dynamic版が配信されていることを確認
```
