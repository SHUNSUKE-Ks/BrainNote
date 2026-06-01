import { createMemo, createSignal, onMount } from "solid-js";
import { Dynamic } from "solid-js/web";
import AppShell from "./components/AppShell";
import Dashboard from "./screens/Dashboard";
import ReportBox from "./screens/ReportBox";
import KnowledgeIndex from "./screens/KnowledgeIndex";
import MemoryView from "./screens/MemoryView";
import FunctionTicket from "./screens/FunctionTicket";
import Goals from "./screens/Goals";
import DevTodo from "./screens/DevTodo";
import IdiaInbox from "./screens/IdiaInbox";
import WorkspaceBoard from "./screens/WorkspaceBoard";
import { createInitialWorkspace, loadWorkspaceData, saveWorkspaceData } from "./dataBridge";
import { devTodo, functionTicket, goals, ideas, knowledgeIndex, memories, reports, workspaceBoard } from "./data/sampleData";

const screens = {
  Dashboard,
  ReportBox,
  Goals,
  "IDIA Inbox": IdiaInbox,
  "Workspace Board": WorkspaceBoard,
  "Dev TODO": DevTodo,
  "Knowledge Index": KnowledgeIndex,
  Memory_0610: MemoryView,
  "Function Ticket": FunctionTicket
};

export default function App() {
  const fallbackData = createInitialWorkspace({ reports, knowledgeIndex, memories, functionTicket, goals, devTodo, ideas, workspaceBoard });
  const [activeScreen, setActiveScreen] = createSignal("Dashboard");
  const [query, setQuery] = createSignal("");
  const [workspaceData, setWorkspaceData] = createSignal(fallbackData);

  onMount(async () => {
    setWorkspaceData(await loadWorkspaceData(fallbackData));
  });

  const filteredData = createMemo(() => {
    const term = query().trim().toLowerCase();
    const data = workspaceData() || fallbackData;
    if (!term) return data;

    const includesTerm = (value) => JSON.stringify(value).toLowerCase().includes(term);
    const safeArray = (key) => (Array.isArray(data[key]) ? data[key] : []);

    return {
      ...data,
      reports: safeArray("reports").filter(includesTerm),
      goals: includesTerm(data.goals) ? data.goals : data.goals,
      ideas: safeArray("ideas").filter(includesTerm),
      workspaceBoard: safeArray("workspaceBoard").filter(includesTerm),
      knowledgeIndex: safeArray("knowledgeIndex").filter(includesTerm),
      memories: safeArray("memories").filter(includesTerm),
      tickets: safeArray("tickets").filter(includesTerm)
    };
  });

  const CurrentScreen = createMemo(() => screens[activeScreen()] || Dashboard);

  const updateWorkspace = async (nextData) => {
    const saved = await saveWorkspaceData(nextData);
    setWorkspaceData(saved);
  };

  return (
    <AppShell
      activeScreen={activeScreen()}
      setActiveScreen={setActiveScreen}
      query={query()}
      setQuery={setQuery}
      data={workspaceData()}
      fallbackData={fallbackData}
      onDataChange={updateWorkspace}
    >
      <Dynamic component={CurrentScreen()} data={filteredData()} rawData={workspaceData()} onDataChange={updateWorkspace} />
    </AppShell>
  );
}
