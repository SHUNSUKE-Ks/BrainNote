import JsonPanel from "./JsonPanel";

export default function Inspector(props) {
  const ticket = () => props.data.tickets?.[0] || {};

  return (
    <aside class="inspector">
      <div class="brand-title">Ticket Inspector</div>
      <div class="brand-subtitle">AIに渡すための意味共有カード</div>

      <div class="preview-box">
        <div class="preview-title">選択中：{ticket().title || "Function Ticket"}</div>
        <div class="preview-text">
          1枚に Title / Image / Dict / Request / Output をまとめる。コードなしでもAIが機能を理解できる資料にする。
        </div>
      </div>

      <JsonPanel value={ticket()} />
    </aside>
  );
}
