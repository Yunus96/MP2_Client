// src/api/leads.js
// All lead-related API calls live here.
// Components never call fetch directly — they go through these functions.

import { apiClient } from "./client";

export const leadsApi = {
  // GET /api/leads — fetch all leads
  getAll: () => apiClient.get("/leads"),

  // GET /api/leads/:id — fetch single lead
  getById: (id) => apiClient.get(`/leads/${id}`),

  // POST /api/leads — create a new lead
  create: (data) => apiClient.post("/leads", data),

  // PUT /api/leads/:id — update a lead
  update: (id, body) => apiClient.put(`/leads/${id}`, body),

  // PATCH /api/leads/:id — update a lead
  //update: (id, data) => apiClient.patch(`/leads/${id}`, data),

  // DELETE /api/leads/:id — delete a lead
  delete: (id) => apiClient.delete(`/leads/${id}`),

    // GET /api/leads/:id/comments — fetch all comments for a lead
  getComments: (leadId) => apiClient.get(`/leads/${leadId}/comments`),
 
  // POST /api/leads/:id/comments — add a comment
  // Body: { commentText: string, author: string (agent ID) }
  addComment: (leadId, body) => apiClient.post(`/leads/${leadId}/comments`, body)
};