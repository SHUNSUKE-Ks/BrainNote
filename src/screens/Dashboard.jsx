import DataList from "../components/DataList";
import SectionHeader from "../components/SectionHeader";
import StatCard from "../components/StatCard";
import TaskBoard from "../components/TaskBoard";

export default function Dashboard(props) {
  const data = () => props.data;

  return (
    <>
      <SectionHeader
        title="Workspace Overview"
        description="Report、Knowledge、Memory、Ticketを月内の制作判断に使える形で見渡す。"
        meta="PWA Mock v1"
      />

      <section class="stat-grid" aria-label="Workspace counts">
        <StatCard title="ReportBox" badge="INPUT" tone="blue" count={data().reports.length}>
          他アプリ・Codex・制作ログから送られてくる報告の入口。
        </StatCard>
        <StatCard title="Knowledge" badge="INDEX" tone="green" count={data().knowledgeIndex.length}>
          ゲーム制作・アプリ制作を混ぜず、目次で検索先を決める場所。
        </StatCard>
        <StatCard title="Memory_0610" badge="SHORT" tone="purple" count={data().memories.length}>
          10日単位の短期記憶。次の10日へ持ち越す内容を精査する。
        </StatCard>
        <StatCard title="Function Ticket" badge="CARD" tone="gold" count={data().tickets.length}>
          コードなしでAIに機能を伝える要件カード。
        </StatCard>
      </section>

      <section class="content-band">
        <h2 class="band-title">Recent Reports</h2>
        <DataList
          items={data().reports.slice(0, 3)}
          describe={(item) => `${item.source} / ${item.createdAt} / ${item.body}`}
          tags={(item) => item.tags}
        />
      </section>

      <section class="content-band">
        <h2 class="band-title">June Tasks</h2>
        <TaskBoard />
      </section>
    </>
  );
}
