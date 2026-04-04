// src/api/agents.js
import { apiClient } from "./client";

export const agentsApi = {
  // GET /api/agents — fetch all agents
  getAll: () => apiClient.get("/agents"),

  // POST /api/agents — create a new agent
  create: (data) => apiClient.post("/agents", data),

  // DELETE /api/agents/:id — delete an agent
  delete: (id) => apiClient.delete(`/agents/${id}`),
};