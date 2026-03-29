// src/api/agents.js
import { apiClient } from "./client";

export const agentsApi = {
  // GET /api/agents — fetch all agents
  getAll: () => apiClient.get("/agents"),
};