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
  // Get Sections
  getSections: () => request("/sections"),

  // List Discussions
  listDiscussions: (q = {}) => {
    const params = new URLSearchParams(q).toString();
    return request(`/discussions?${params}`);
  },

  // Get a Single Discussion
  getDiscussion: (id) => request(`/discussions/${id}`),

  // Create Discussion
  createDiscussion: (payload) =>
    request(`/discussions`, { method: "POST", body: JSON.stringify(payload) }),

  // Add Answer
  addAnswer: (id, payload) => {
    return request(`/discussions/${id}/answers`, {
      method: "POST",
      body: JSON.stringify(payload),
    });
  },

  /* --------------------------------------------
     1️⃣  UPDATE ANSWER
     PUT /api/discussions/:discussionId/answers/:answerId
  -------------------------------------------- */
  updateAnswer: (discussionId, answerId, payload) => {
    return request(`/discussions/${discussionId}/answers/${answerId}`, {
      method: "PUT",
      body: JSON.stringify(payload),
    });
  },

  /* --------------------------------------------
     2️⃣  DELETE ANSWER
     DELETE /api/discussions/:discussionId/answers/:answerId
  -------------------------------------------- */
  deleteAnswer: (discussionId, answerId) => {
    return request(`/discussions/${discussionId}/answers/${answerId}`, {
      method: "DELETE",
    });
  },

  /* --------------------------------------------
     3️⃣  HIGHLIGHT ANSWER
     POST /api/discussions/:discussionId/answers/:answerId/highlight
  -------------------------------------------- */
  highlightAnswer: (discussionId, answerId) => {
    return request(
      `/discussions/${discussionId}/answers/${answerId}/highlight`,
      { method: "POST" }
    );
  },

  // Toggle Enroll
  toggleEnroll: (payload) =>
    request("/enroll/toggle", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  // Get Enrollment List
  getEnrollments: (userId) =>
    request(`/enroll?userId=${encodeURIComponent(userId)}`),
};
