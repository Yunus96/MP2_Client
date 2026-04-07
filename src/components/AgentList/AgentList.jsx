import "./AgentList.css";
import "../LeadManagement/LeadManagement.css";
import SectionTitle    from "../SectionTitle/SectionTitle";
import AddAgentModal   from "./AddAgentModal";
import { useAgents } from "../../hooks/useAgents";

const initials = (name) =>
  name.split(" ").map((w) => w[0]).slice(0, 2).join("");

export default function AgentList() {
  const {
    agents,
    isLoading,
    error,
    showAddModal,
    setShowAddModal,
    addAgent,
  } = useAgents();

  return (
    <div className="agent-list">

      {/* Title + toolbar */}
      <SectionTitle>Sales Agents</SectionTitle>

      <div className="agent-list__toolbar">
        <span className="agent-list__count">
          {isLoading ? "Loading…" : `${agents.length} agent${agents.length !== 1 ? "s" : ""}`}
        </span>
        <button
          className="btn btn--primary"
          onClick={() => setShowAddModal(true)}
        >
          + Add New Agent
        </button>
      </div>

      {/* Table */}
      <div className="agent-table">

        {/* Head */}
        <div className="agent-table__head">
          <div className="agent-table__th" />
          <div className="agent-table__th">Name</div>
          <div className="agent-table__th">Email</div>
        </div>

        {/* Body */}
        <div>

          {/* Loading */}
          {isLoading && (
            <div className="agent-table__state">
              <div className="agent-table__spinner" />
              Loading agents…
            </div>
          )}

          {/* Error */}
          {!isLoading && error && (
            <div className="agent-table__state agent-table__state--error">
              ⚠ Failed to load agents: {error}
            </div>
          )}

          {/* Empty */}
          {!isLoading && !error && agents.length === 0 && (
            <div className="agent-table__state">
              No agents found. Add one to get started.
            </div>
          )}

          {/* Rows */}
          {!isLoading && !error && agents.map((agent) => (
            <div key={agent.id} className="agent-row">

              {/* Avatar */}
              <div className="agent-row__avatar">
                {initials(agent.name)}
              </div>

              {/* Name */}
              <div className="agent-row__name">{agent.name}</div>

              {/* Email */}
              <div className="agent-row__email">{agent.email ?? "—"}</div>

            </div>
          ))}

        </div>
      </div>

      {/* Add Agent Modal */}
      {showAddModal && (
        <AddAgentModal
          onClose={() => setShowAddModal(false)}
          onAdd={addAgent}
        />
      )}

    </div>
  );
}