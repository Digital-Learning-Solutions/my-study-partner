/* eslint-disable react-refresh/only-export-components */
// src/context/DiscussionContext.jsx
import React, { createContext, useContext, useEffect, useState } from "react";
import { api } from "../api/discussionsApi.js";

const DiscussionContext = createContext();

export const useDiscussion = () => useContext(DiscussionContext);

export const DiscussionProvider = ({ children }) => {
  const [sections, setSections] = useState([]);
  const [enrolled, setEnrolled] = useState([]); // section keys user is enrolled in
  const [listState, setListState] = useState({
    data: [],
    page: 1,
    total: 0,
    limit: 10,
  });
  const userId = localStorage.getItem("userId") || null;

  useEffect(() => {
    (async () => {
      try {
        const s = await api.getSections();
        setSections(s.sections || []);
      } catch (e) {
        console.error(e);
      }
    })();
    if (userId) {
      api
        .getEnrollments(userId)
        .then((res) => setEnrolled(res.sections || []))
        .catch(() => setEnrolled([]));
    }
  }, [userId]);

  const toggleEnroll = async (sectionKey) => {
    if (!userId) return alert("Please login (userId missing)");
    const res = await api.toggleEnroll({ userId, section: sectionKey });
    setEnrolled(res.sections || []);
    return res;
  };

  const fetchDiscussions = async (opts = {}) => {
    const res = await api.listDiscussions(opts);
    setListState({
      data: res.data || [],
      page: res.page,
      total: res.total,
      limit: res.limit,
    });
    return res;
  };

  const createDiscussion = async (payload) => {
    return api.createDiscussion(payload);
  };

  const addAnswer = async (id, payload) => {
    return api.addAnswer(id, payload);
  };

  return (
    <DiscussionContext.Provider
      value={{
        sections,
        enrolled,
        toggleEnroll,
        listState,
        fetchDiscussions,
        createDiscussion,
        addAnswer,
        userId,
      }}
    >
      {children}
    </DiscussionContext.Provider>
  );
};
