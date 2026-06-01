import { For } from "solid-js";

const lanes = ["Inbox", "Divide", "Build", "Export"];

export default function TaskBoard(props) {
  const tasks = () => (Array.isArray(props.tasks) ? props.tasks : []);

  return (
    <div class="task-board">
      <For each={lanes}>
        {(lane) => (
          <section class="task-column">
            <h2>{lane}</h2>
            <For each={tasks().filter((task) => task.lane === lane)}>
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
