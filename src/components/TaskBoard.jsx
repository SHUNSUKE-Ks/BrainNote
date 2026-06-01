import { For } from "solid-js";
import { devTasks } from "../data/sampleData";

const lanes = ["Inbox", "Divide", "Build", "Export"];

export default function TaskBoard() {
  return (
    <div class="task-board">
      <For each={lanes}>
        {(lane) => (
          <section class="task-column">
            <h2>{lane}</h2>
            <For each={devTasks.filter((task) => task.lane === lane)}>
              {(task) => (
                <article class="task-ticket">
                  <h3>{task.title}</h3>
                  <p>{task.meta}</p>
                </article>
              )}
            </For>
          </section>
        )}
      </For>
    </div>
  );
}
