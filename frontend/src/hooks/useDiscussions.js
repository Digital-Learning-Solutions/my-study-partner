import { useState, useEffect, useCallback } from "react";
import { fetchDiscussionsApi } from "../api/discussionsApi";

export const useDiscussions = (filter, currentPage, discussionsPerPage) => {
  const [discussions, setDiscussions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalDiscussions, setTotalDiscussions] = useState(0);
  const [sections, setSections] = useState([]);

  const fetchDiscussions = useCallback(async () => {
    setLoading(true);

    let endpoint = `http://localhost:5000/api/discussions?page=${currentPage}&limit=${discussionsPerPage}&sort=${filter.value}`;

    if (filter.type === "section") {
      const sectionTags =
        sections.find((s) => s.slug === filter.value)?.tags || [];
      if (sectionTags.length > 0) {
        endpoint = `http://localhost:5000/api/discussions?page=${currentPage}&limit=${discussionsPerPage}&tags=${sectionTags.join(
          ","
        )}`;
      }
    } else if (filter.type === "tag") {
      endpoint = `http://localhost:5000/api/discussions?page=${currentPage}&limit=${discussionsPerPage}&tags=${filter.value}`;
    } else if (filter.type === "topic") {
      endpoint = `http://localhost:5000/api/discussions?page=${currentPage}&limit=${discussionsPerPage}&topic=${filter.value}`;
    }

    try {
      const data = await fetchDiscussionsApi(endpoint);
      setDiscussions(data.discussions || []);
      setTotalDiscussions(
        data.total || (data.discussions ? data.discussions.length : 0)
      );
    } catch (error) {
      console.error("Fetch discussions error:", error);
      setDiscussions([]);
      setTotalDiscussions(0);
    } finally {
      setLoading(false);
    }
  }, [filter.type, filter.value, currentPage, discussionsPerPage]);

  useEffect(() => {
    async function fetchSections() {
      try {
        const res = await fetch(
          "http://localhost:5000/api/discussions/sections"
        );
        if (!res.ok) throw new Error("Failed to fetch sections");
        const data = await res.json();
        setSections(data.sections || []);
      } catch (error) {
        console.error("Fetch sections error:", error);
        setSections([]);
      }
    }
    fetchSections();
    fetchDiscussions();
  }, [fetchDiscussions]);

  return { discussions, loading, totalDiscussions };
};
