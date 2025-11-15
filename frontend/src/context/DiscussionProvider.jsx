import React, { useEffect, useState, useCallback } from "react";
import { api } from "../api/discussionsApi.js";
import { DiscussionContext } from "./DiscussionContext.jsx";

export const DiscussionProvider = ({ children }) => {
  const [sections, setSections] = useState([]);
  const [enrolled, setEnrolled] = useState([]);
  const [listState, setListState] = useState({
    data: [],
    page: 1,
    total: 0,
    limit: 5,
    totalPages: 1,
  });

  const userId = localStorage.getItem("userId") || null;

  // Load sections + enrollments once
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

  // ⭐ FIXED: useCallback prevents infinite re-renders
  const fetchDiscussions = useCallback(
    async (opts = {}, selectedSection = null) => {
      const query = { ...opts };

      query.page = query.page || listState.page || 1;
      query.limit = query.limit || listState.limit || 5;

      if (!selectedSection) delete query.section;
      else query.section = selectedSection;

      const res = await api.listDiscussions(query);

      const page = res.page || query.page || 1;
      const limit = res.limit || query.limit || 5;
      const total = typeof res.total === "number" ? res.total : 0;
      const totalPages =
        res.totalPages || Math.max(1, Math.ceil(total / limit));

      setListState({
        data: res.data || [],
        page,
        total,
        limit,
        totalPages,
      });

      return res;
    },
    [listState.page, listState.limit] // stable deps
  );

  const createDiscussion = async (payload) => {
    return api.createDiscussion(payload);
  };

  const addAnswer = async (id, payload) => {
    return api.addAnswer(id, payload);
  };

  const urlParamToTitle = (urlParam) => {
    if (!urlParam) return "";

    const decoded = decodeURIComponent(urlParam);
    const formatted = decoded.replace(/[-_]/g, " ");
    return formatted.replace(/\b\w/g, (char) => char.toUpperCase());
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
        urlParamToTitle,
      }}
    >
      {children}
    </DiscussionContext.Provider>
  );
};
