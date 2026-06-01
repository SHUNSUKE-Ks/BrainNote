import { createSignal } from "solid-js";
import SectionHeader from "../components/SectionHeader";
import { makeId } from "../utils/formats";

export default function Goals(props) {
  const goals = () => props.rawData.goals || { kgi: "", kpis: [], doneDefinitions: [] };
  const [kgi, setKgi] = createSignal(goals().kgi || "");
  const [kpiLabel, setKpiLabel] = createSignal("");
  const [kpiTarget, setKpiTarget] = createSignal("");
  const [kpiCurrent, setKpiCurrent] = createSignal("");
  const [milestone, setMilestone] = createSignal("");
  const [outcome, setOutcome] = createSignal("");

  const saveKgi = (event) => {
    event.preventDefault();
    saveGoals({ ...goals(), kgi: kgi().trim() });
  };

  const addKpi = (event) => {
    event.preventDefault();
    const nextKpi = {
      id: makeId("kpi"),
      label: kpiLabel().trim() || "Untitled KPI",
      target: kpiTarget().trim(),
      current: kpiCurrent().trim()
    };
    saveGoals({ ...goals(), kpis: [nextKpi, ...goals().kpis] });
    setKpiLabel("");
    setKpiTarget("");
    setKpiCurrent("");
  };

  const addDone = (event) => {
    event.preventDefault();
    const nextDone = {
      id: makeId("done"),
      milestone: milestone().trim() || "Untitled Milestone",
      outcome: outcome().trim(),
      releaseReady: false
    };
    saveGoals({ ...goals(), doneDefinitions: [nextDone, ...goals().doneDefinitions] });
    setMilestone("");
    setOutcome("");
  };

  const toggleDone = (id) => {
    saveGoals({
      ...goals(),
      doneDefinitions: goals().doneDefinitions.map((item) =>
        item.id === id ? { ...item, releaseReady: !item.releaseReady } : item
      )
    });
  };

  const saveGoals = (nextGoals) => {
    props.onDataChange({
      ...props.rawData,
      goals: nextGoals
    });
  };

  return (
    <>
      <SectionHeader
        title="Goals"
        description="KGI、KPI、DONEを1枚で見る。途中マイルストーンは、リリース可能な成果物の定義として扱う。"
        meta="Solo Agile"
      />

      <section class="goal-grid">
        <article class="goal-panel goal-kgi">
          <h2>KGI</h2>
          <p>最終的に達成したい成果。迷ったときの北極星。</p>
          <form class="compact-form" onSubmit={saveKgi}>
            <textarea value={kgi()} onInput={(event) => setKgi(event.currentTarget.value)} />
            <button class="primary-button" type="submit">Save KGI</button>
          </form>
        </article>

        <article class="goal-panel">
          <h2>KPI</h2>
          <p>進み具合を確認する数字。増やしすぎず、行動に効くものだけ。</p>
          <form class="compact-form" onSubmit={addKpi}>
            <input value={kpiLabel()} onInput={(event) => setKpiLabel(event.currentTarget.value)} placeholder="Knowledge昇格数" />
            <div class="form-grid two-col">
              <input value={kpiCurrent()} onInput={(event) => setKpiCurrent(event.currentTarget.value)} placeholder="現在: 2件" />
              <input value={kpiTarget()} onInput={(event) => setKpiTarget(event.currentTarget.value)} placeholder="目標: 12件" />
            </div>
            <button class="primary-button" type="submit">Add KPI</button>
          </form>
          <div class="metric-list">
            {goals().kpis.map((item) => (
              <div class="metric-row">
                <strong>{item.label}</strong>
                <span>{item.current} / {item.target}</span>
              </div>
            ))}
          </div>
        </article>

        <article class="goal-panel goal-done">
          <h2>DONE</h2>
          <p>途中完成の定義。ここに書ける単位まで小さくして、完成後にグレードアップする。</p>
          <form class="compact-form" onSubmit={addDone}>
            <input value={milestone()} onInput={(event) => setMilestone(event.currentTarget.value)} placeholder="Report to Knowledge" />
            <textarea value={outcome()} onInput={(event) => setOutcome(event.currentTarget.value)} placeholder="Reportを読み、共通知識としてKnowledge Indexへ昇格できる" />
            <button class="primary-button" type="submit">Add DONE</button>
          </form>
          <div class="done-list">
            {goals().doneDefinitions.map((item) => (
              <button classList={{ "done-row": true, complete: item.releaseReady }} type="button" onClick={() => toggleDone(item.id)}>
                <span>{item.releaseReady ? "DONE" : "NEXT"}</span>
                <strong>{item.milestone}</strong>
                <small>{item.outcome}</small>
              </button>
            ))}
          </div>
        </article>
      </section>
    </>
  );
}
