/* eslint-disable no-unused-vars */
// src/api/apiClient.js
const API_BASE = "http://localhost:5000/api/discussions";

async function request(path, opts = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { "Content-Type": "application/json" },
    ...opts,
  });
  if (!res.ok) {
    const txt = await res.text();
    let json;
    try {
      json = JSON.parse(txt);
    } catch (e) {
      json = { message: txt };
    }
    const err = new Error(json.message || "API error");
    err.status = res.status;
    err.body = json;
    throw err;
  }
  return res.json();
}

export const api = {
  getSections: () => request("/sections"),
  listDiscussions: (q = {}) => {
    const params = new URLSearchParams(q).toString();
    return request(`/discussions?${params}`);
  },
  getDiscussion: (id) => request(`/discussions/${id}`),
  createDiscussion: (payload) =>
    request(`/discussions`, { method: "POST", body: JSON.stringify(payload) }),
  addAnswer: (id, payload) =>
    request(`/discussions/${id}/answers`, {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  toggleEnroll: (payload) =>
    request("/enroll/toggle", {
      method: "POST",
      body: JSON.stringify(payload),
    }),
  getEnrollments: (userId) =>
    request(`/enroll?userId=${encodeURIComponent(userId)}`),
};
