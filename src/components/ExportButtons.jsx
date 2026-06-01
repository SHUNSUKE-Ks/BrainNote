import { exportJson, exportMarkdown, readImportedJson, saveWorkspaceData } from "../dataBridge";

export default function ExportButtons(props) {
  const importJson = async (event) => {
    const file = event.currentTarget.files?.[0];
    if (!file) return;
    const nextData = await readImportedJson(file);
    const saved = await saveWorkspaceData(nextData);
    props.onDataChange(saved);
    event.currentTarget.value = "";
  };

  return (
    <div class="export-actions">
      <button class="ghost-button" type="button" onClick={() => exportJson("BrainNote_export.json", props.data)}>
        JSON
      </button>
      <button class="ghost-button" type="button" onClick={() => exportMarkdown("BrainNote_export.md", props.data)}>
        MD
      </button>
      <label class="ghost-button file-button">
        Import
        <input type="file" accept="application/json,.json" onChange={importJson} />
      </label>
    </div>
  );
}
