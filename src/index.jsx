import { render } from "solid-js/web";
import App from "./App";
import AppErrorBoundary from "./components/AppErrorBoundary";
import "./styles/index.css";

render(() => (
  <AppErrorBoundary>
    <App />
  </AppErrorBoundary>
), document.getElementById("root"));
