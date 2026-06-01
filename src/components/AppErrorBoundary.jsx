import { ErrorBoundary } from "solid-js";
import { resetWorkspaceData } from "../dataBridge";

export default function AppErrorBoundary(props) {
  return (
    <ErrorBoundary fallback={(error) => <AppError error={error} />}>
      {props.children}
    </ErrorBoundary>
  );
}

function AppError(props) {
  const resetAndReload = () => {
    resetWorkspaceData();
    window.location.reload();
  };

  return (
    <main class="app-error">
      <section class="app-error-panel">
        <h1>BrainNote render error</h1>
        <p>SolidJSの初期描画でエラーが発生しました。localStorageの古いschemaか、初期データの型不一致が原因候補です。</p>
        <pre>{String(props.error?.message || props.error)}</pre>
        <button class="primary-button" type="button" onClick={resetAndReload}>
          localStorageをリセットして再起動
        </button>
      </section>
    </main>
  );
}
