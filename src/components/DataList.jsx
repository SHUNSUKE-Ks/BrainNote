import { For } from "solid-js";

export default function DataList(props) {
  return (
    <div class="data-list">
      <For each={props.items}>
        {(item) => (
          <article class="data-row">
            <div>
              <h2>{item.title}</h2>
              <p>{props.describe(item)}</p>
            </div>
            <div class="data-row-side">
              <div class="tag-row">
                <For each={props.tags(item)}>{(tag) => <span class="tag">{tag}</span>}</For>
              </div>
              {props.actions && <div class="row-actions">{props.actions(item)}</div>}
            </div>
          </article>
        )}
      </For>
    </div>
  );
}
