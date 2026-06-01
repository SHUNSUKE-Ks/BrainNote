import Sidebar from "./Sidebar";
import TopBar from "./TopBar";
import Inspector from "./Inspector";

export default function AppShell(props) {
  return (
    <div class="app-shell">
      <Sidebar activeScreen={props.activeScreen} setActiveScreen={props.setActiveScreen} />
      <main class="main-panel">
        <TopBar
          query={props.query}
          setQuery={props.setQuery}
          data={props.data}
          fallbackData={props.fallbackData}
          onDataChange={props.onDataChange}
          setActiveScreen={props.setActiveScreen}
        />
        {props.children}
      </main>
      <Inspector data={props.data} />
    </div>
  );
}
