# SolidJS Error Reports

SolidJS / Vite / JSX / PWA開発中に発生したエラーを、再現・再利用・Knowledge化できる形で保存するフォルダーです。

## ID方針

エラーIDはBrainNote側で安定IDを作ります。

形式:

```txt
ERR_SOLIDJS_YYYYMMDD_###_short_name
```

例:

```txt
ERR_SOLIDJS_20260601_001_windows_path_placeholder
```

実ログがある場合は、ログ本文やDevToolsのエラーを `observedLog` に添付します。ログがない場合でも、現象・原因・修正・再発防止が書けるならReport化します。

## 送信粒度

小さなエラーも送信してよいです。ただし、すべてを同じ重さで扱わず、以下に分けます。

- `note`: 小さい気づき。単発でも残す価値がある
- `bug`: 再現条件があり、修正した不具合
- `knowledge`: 他プロジェクトでも使える注意点
- `pattern`: 繰り返し出る設計・実装パターン

頻繁に送る場合は、1件ごとにReportBoxへ入れ、10日単位でMemoryまたはKnowledgeへ昇格します。

## Report必須項目

- Error ID
- Title
- Project
- Environment
- Symptom
- Trigger
- Root Cause
- Fix
- Files Changed
- Prevention
- Knowledge Candidate
- Optional Log
