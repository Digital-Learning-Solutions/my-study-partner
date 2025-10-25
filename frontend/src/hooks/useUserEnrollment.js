import { useState, useEffect, useCallback } from "react";

export const useUserEnrollment = () => {
  const [enrolledSections, setEnrolledSections] = useState([]);

  const toggleEnrollment = useCallback((sectionSlug) => {
    setEnrolledSections((prev) =>
      prev.includes(sectionSlug)
        ? prev.filter((s) => s !== sectionSlug)
        : [...prev, sectionSlug]
    );
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("user-enrollments");
    if (stored) setEnrolledSections(JSON.parse(stored));
  }, []);

  useEffect(() => {
    localStorage.setItem("user-enrollments", JSON.stringify(enrolledSections));
  }, [enrolledSections]);

  return { enrolledSections, toggleEnrollment };
};
