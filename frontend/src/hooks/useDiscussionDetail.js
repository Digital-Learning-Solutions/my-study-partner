import { useState, useEffect, useCallback } from "react";

export const useDiscussionDetail = (discussionId) => {
  const [discussion, setDiscussion] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDetail = useCallback(async () => {
    if (!discussionId) return;
    setLoading(true);
    try {
      const res = await fetch(
        `http://localhost:5000/api/discussions/${discussionId}`
      );
      if (!res.ok) throw new Error("Failed to fetch discussion detail");
      const data = await res.json();
      setDiscussion(data);
    } catch (error) {
      console.error("Fetch discussion detail error:", error);
      setDiscussion(null);
    } finally {
      setLoading(false);
    }
  }, [discussionId]);

  useEffect(() => {
    fetchDetail();
  }, [fetchDetail]);

  return { discussion, loading, refreshDetail: fetchDetail };
};
