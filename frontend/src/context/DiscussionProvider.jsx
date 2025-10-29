import React, { useEffect, useState } from "react";
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

  useEffect(() => {
    (async () => {
      try {
        const s = await api.getSections();
        console.log("client:", s.sections);
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

  const fetchDiscussions = async (opts = {}, selectedSection = null) => {
    // ensure we don't send section=null or section="" to the API
    const query = { ...opts };
    // ensure page & limit are always provided (fallback to current state)
    query.page = opts.page || listState.page || 1;
    query.limit = opts.limit || listState.limit || 5;

    if (
      selectedSection === null ||
      selectedSection === undefined ||
      selectedSection === ""
    ) {
      delete query.section;
    } else {
      query.section = selectedSection;
    }

    const res = await api.listDiscussions(query);
    // safe assignment with fallbacks
    const page = res.page || query.page || 1;
    const limit = res.limit || query.limit || listState.limit || 5;
    const total = typeof res.total === "number" ? res.total : 0;
    const totalPages = res.totalPages || Math.max(1, Math.ceil(total / limit));

    setListState({
      data: res.data || [],
      page,
      total,
      limit,
      totalPages,
    });
    return res;
  };

  const createDiscussion = async (payload) => {
    return api.createDiscussion(payload);
  };

  const addAnswer = async (id, payload) => {
    return api.addAnswer(id, payload);
  };
  const urlParamToTitle = (urlParam) => {
    if (!urlParam) return "";

    // Decode URL-encoded strings (handles %20, etc.)
    const decoded = decodeURIComponent(urlParam);

    // Replace hyphens and underscores with spaces
    const formatted = decoded.replace(/[-_]/g, " ");

    // Capitalize the first letter of each word
    const title = formatted.replace(/\b\w/g, (char) => char.toUpperCase());

    return title;
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
