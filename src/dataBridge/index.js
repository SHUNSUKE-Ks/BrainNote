const STORAGE_KEY = "06_brain_workspace_data_v1";

export function createInitialWorkspace({ reports, knowledgeIndex, memories, functionTicket, goals, devTodo, ideas, workspaceBoard }) {
  return {
    reports,
    knowledgeIndex,
    memories,
    tickets: [functionTicket],
    goals,
    devTodo,
    ideas,
    workspaceBoard,
    updatedAt: new Date().toISOString()
  };
}

export async function loadWorkspaceData(fallbackData) {
  if (isTauriRuntime()) {
    return fallbackData;
  }

  const stored = window.localStorage.getItem(STORAGE_KEY);
  if (!stored) return fallbackData;

  try {
    return normalizeWorkspaceData(JSON.parse(stored), fallbackData);
  } catch {
    return fallbackData;
  }
}

export function resetWorkspaceData() {
  if (!isTauriRuntime()) {
    window.localStorage.removeItem(STORAGE_KEY);
  }
}

export async function saveWorkspaceData(data) {
  const payload = { ...data, updatedAt: new Date().toISOString() };

  if (isTauriRuntime()) {
    // Tauri file APIs can be wired here without changing screen components.
    return payload;
  }

  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  return payload;
}

export function exportJson(filename, data) {
  downloadFile(filename, JSON.stringify(data, null, 2), "application/json");
}

export function exportMarkdown(filename, data) {
  const markdown = [
    "# BrainNote Export",
    "",
    `Updated: ${data.updatedAt || new Date().toISOString()}`,
    "",
    "## Reports",
    ...data.reports.map((item) => `- ${item.title} (${item.source})`),
    "",
    "## Knowledge Index",
    ...data.knowledgeIndex.map((item) => `- ${item.title}: ${item.summary}`),
    "",
    "## Memory_0610",
    ...data.memories.map((item) => `- ${item.title}: ${item.nextAction}`),
    "",
    "## Goals",
    `KGI: ${data.goals?.kgi || ""}`,
    "",
    "### KPI",
    ...(data.goals?.kpis || []).map((item) => `- ${item.label}: ${item.current} / ${item.target}`),
    "",
    "### DONE",
    ...(data.goals?.doneDefinitions || []).map((item) => `- ${item.milestone}: ${item.outcome}`),
    "",
    "## Development TODO",
    ...((data.devTodo?.groups || []).flatMap((group) => [
      `### ${group.title}`,
      ...group.items.map((item) => `- [${item.done ? "x" : " "}] ${item.text}`),
      ""
    ])),
    "## IDIA Inbox",
    ...(data.ideas || []).map((item) => `- [${item.gate}] ${item.title}: ${(item.tags || []).join(", ")}`),
    "",
    "## Workspace Board",
    ...(data.workspaceBoard || []).map((item) => `- [${item.lane}] ${item.title}: ${(item.tags || []).join(", ")}`),
    "",
    "## Function Tickets",
    ...data.tickets.map((item) => `- ${item.title}: ${item.request}`)
  ].join("\n");

  downloadFile(filename, markdown, "text/markdown");
}

export function readImportedJson(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => {
      try {
        resolve(JSON.parse(String(reader.result)));
      } catch (error) {
        reject(error);
      }
    };
    reader.onerror = reject;
    reader.readAsText(file);
  });
}

function downloadFile(filename, content, type) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}

function isTauriRuntime() {
  return Boolean(window.__TAURI__ || window.__TAURI_INTERNALS__);
}

export function normalizeWorkspaceData(data, fallbackData) {
  const source = data && typeof data === "object" && !Array.isArray(data) ? data : {};

  return {
    reports: arrayOrFallback(source.reports, fallbackData.reports),
    knowledgeIndex: arrayOrFallback(source.knowledgeIndex, fallbackData.knowledgeIndex),
    memories: arrayOrFallback(source.memories, fallbackData.memories),
    tickets: arrayOrFallback(source.tickets, fallbackData.tickets),
    goals: source.goals || fallbackData.goals,
    devTodo: source.devTodo || fallbackData.devTodo,
    ideas: arrayOrFallback(source.ideas, fallbackData.ideas),
    workspaceBoard: arrayOrFallback(source.workspaceBoard, fallbackData.workspaceBoard),
    updatedAt: source.updatedAt || fallbackData.updatedAt
  };
}

function arrayOrFallback(value, fallbackValue) {
  return Array.isArray(value) ? value : fallbackValue;
}
