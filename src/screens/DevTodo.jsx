import SectionHeader from "../components/SectionHeader";

export default function DevTodo(props) {
  const todo = () => props.rawData.devTodo || { groups: [] };

  const toggleItem = (itemId) => {
    props.onDataChange({
      ...props.rawData,
      devTodo: {
        ...todo(),
        updatedAt: new Date().toISOString().slice(0, 10),
        groups: todo().groups.map((group) => ({
          ...group,
          items: group.items.map((item) => (item.id === itemId ? { ...item, done: !item.done } : item))
        }))
      }
    });
  };

  return (
    <>
      <SectionHeader
        title="Dev TODO"
        description="開発の現在地を見る場所。DONEは成果物の定義、CURRENTは今触っている流れ。"
        meta={`Updated: ${todo().updatedAt}`}
      />

      <section class="todo-grid">
        {todo().groups.map((group) => (
          <article class="todo-panel">
            <h2>{group.title}</h2>
            <div class="todo-list">
              {group.items.map((item) => (
                <button classList={{ "todo-row": true, done: item.done }} type="button" onClick={() => toggleItem(item.id)}>
                  <span>{item.done ? "DONE" : "TODO"}</span>
                  <strong>{item.text}</strong>
                </button>
              ))}
            </div>
          </article>
        ))}
      </section>
    </>
  );
}
