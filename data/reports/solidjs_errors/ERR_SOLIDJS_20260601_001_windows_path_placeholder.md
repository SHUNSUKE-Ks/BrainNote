# ERR_SOLIDJS_20260601_001_windows_path_placeholder

## Title

JSX placeholder内のWindowsパスでSolidJSが起動前に落ちる

## Project

- App: BrainNote
- Stack: SolidJS + Vite + PWA
- Date: 2026-06-01
- Status: fixed
- Severity: bug

## Summary

BrainNoteを `http://127.0.0.1:5186/` で開いたとき、背景色だけ表示され、SolidJSのUIが描画されなかった。原因は、JSX内の `placeholder` 属性にWindowsパスをそのまま書いたことだった。

## Symptom

- HTMLとCSSは読み込まれていた
- 背景色は表示された
- `#root` にSolidJS UIが描画されなかった
- 画面は空に見えた

## Trigger

以下のようなWindowsパスをJSX属性文字列として直接書いた。

```jsx
<input placeholder="C:\05__claude_workspace\..." />
<input placeholder="C:\Users\enjoy\InBox2026\..." />
```

## Root Cause

JSX内の文字列で `\` がエスケープ文字として解釈され、ブラウザ側で実行されるJavaScriptのパースまたは実行に悪影響を与えた。SolidJSが起動する前にJS moduleが失敗したため、画面にはCSSの背景だけが残った。

## Fix

placeholderのパス表記を、ブラウザ・JSXで安全なスラッシュ表記へ変更した。

```jsx
<input placeholder="C:/05__claude_workspace/..." />
<input placeholder="C:/Users/enjoy/InBox2026/..." />
```

## Files Changed

- `src/screens/IdiaInbox.jsx`
- `src/screens/WorkspaceBoard.jsx`

## Prevention

- JSX属性にWindowsパスを書く場合は `/` 表記にする
- 実ファイルパスをデータとして保存する場合はJSON側で `\\` を使う
- UIのplaceholderは実パスではなく例示用の安全な短縮表記にする
- 画面が背景だけ表示される場合は、CSSではなくJS runtime errorを疑う

## Knowledge Candidate

SolidJS + ViteのPWAで背景だけ表示される場合、HTML/CSSは成功し、JS moduleの初期化に失敗している可能性が高い。JSX属性内のWindowsパス、未定義データ、localStorageの古いschemaを優先して確認する。

## Observed Log

直接のDevToolsログは未保存。関連して、Vite dev server起動時にはsandbox内で以下のエラーも観測された。

```txt
Cannot read directory "../../..": Access is denied.
Could not resolve "C:\\Users\\enjoy\\InBox2026\\InBox0601\\06_Brain\\vite.config.js"
```

このVite起動エラーは別原因であり、sandbox外権限で起動することで回避した。

## ReportBox Entry

```json
{
  "id": "report_solidjs_error_20260601_001",
  "title": "JSX placeholder内のWindowsパスでSolidJSが起動前に落ちる",
  "source": "BrainNote",
  "type": "md",
  "tags": ["SolidJS", "JSX", "Vite", "WindowsPath", "bug"],
  "createdAt": "2026-06-01",
  "body": "JSX内のplaceholderにWindowsパスをそのまま書いたことで、SolidJS UIが描画されず背景だけ表示された。placeholderをC:/形式へ変更して修正。"
}
```
