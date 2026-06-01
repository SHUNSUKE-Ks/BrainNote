import DataList from "../components/DataList";
import SectionHeader from "../components/SectionHeader";
import StatCard from "../components/StatCard";

export default function Dashboard(props) {
  const data = () => props.data || {};
  const items = (key) => (Array.isArray(data()[key]) ? data()[key] : []);

  return (
    <>
      <SectionHeader
        title="Workspace Overview"
        description="Report、Knowledge、Memory、Ticketを月内の制作判断に使える形で見渡す。"
        meta="PWA Mock v1"
      />

      <section class="stat-grid" aria-label="Workspace counts">
        <StatCard title="ReportBox" badge="INPUT" tone="blue" count={items("reports").length}>
          他アプリ・Codex・制作ログから送られてくる報告の入口。
        </StatCard>
        <StatCard title="IDIA Inbox" badge="IDEA" tone="gold" count={items("ideas").length}>
          荒いアイディアを本番開発TODOと分けて受け、タグとゲートで整理する。
        </StatCard>
        <StatCard title="Workspace Board" badge="BOARD" tone="blue" count={items("workspaceBoard").length}>
          Codex相談、資料、PWAメモ、Desktopまとめ作業をテキストで割り振る。
        </StatCard>
        <StatCard title="Knowledge" badge="INDEX" tone="green" count={items("knowledgeIndex").length}>
          ゲーム制作・アプリ制作を混ぜず、目次で検索先を決める場所。
        </StatCard>
        <StatCard title="Memory_0610" badge="SHORT" tone="purple" count={items("memories").length}>
          10日単位の短期記憶。次の10日へ持ち越す内容を精査する。
        </StatCard>
      </section>

      <section class="content-band">
        <h2 class="band-title">Recent Reports</h2>
        <DataList
          items={items("reports").slice(0, 3)}
          describe={(item) => `${item.source} / ${item.createdAt} / ${item.body}`}
          tags={(item) => item.tags}
        />
      </section>

      <section class="content-band">
        <h2 class="band-title">Recent IDIA</h2>
        <DataList
          items={items("ideas").slice(0, 3)}
          describe={(item) => `${item.gate} / ${item.body}`}
          tags={(item) => item.tags}
        />
      </section>
    </>
  );
}
