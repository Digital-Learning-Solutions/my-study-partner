import React, { useState, useMemo } from "react";
import { useStoredContext } from "../../context/useStoredContext";
import { X } from "lucide-react";
import ReactQuill from "react-quill-new";
import "react-quill-new/dist/quill.snow.css";
import { useDiscussionContext } from "../../context/useDiscussionContext";

export default function NewQuestionModal({ section, onClose, onCreated }) {
  const { createDiscussion, userId, sections, urlParamToTitle } =
    useDiscussionContext();
  const { user } = useStoredContext();

  // If section prop is passed -> lock choosing section
  const isLockedSection = Boolean(section && section !== "");

  const [selectedSection, setSelectedSection] = useState(
    isLockedSection ? section : ""
  );

  // Load tags based on selected section
  const availableTags = useMemo(() => {
    if (!selectedSection) return [];
    const sec = sections.find((s) => s.slug === selectedSection);
    return sec?.tags || [];
  }, [selectedSection, sections]);

  const [title, setTitle] = useState("");
  const [question, setQuestion] = useState("");
  const [tags, setTags] = useState([]);
  const [inputTag, setInputTag] = useState("");

  // ---- ⭐ FIX QUILL BULLET HTML ⭐ ----
  const fixQuillHtml = (html) => {
    if (!html) return html;

    let output = html;

    // Convert <ol ... data-list="bullet"> to <ul>
    output = output.replace(
      /<ol([^>]*)data-list="bullet"([^>]*)>/g,
      '<ul style="list-style-type: disc; padding-left: 1.5rem;">'
    );
    output = output.replace(/<\/ol>/g, "</ul>");

    // Convert <li data-list="bullet"> to <li>
    output = output.replace(/<li([^>]*)data-list="bullet"([^>]*)>/g, "<li>");

    // Remove quill's fake span bullets
    output = output.replace(/<span class="ql-ui"[^>]*><\/span>/g, "");

    return output;
  };

  // Quill toolbar
  const quillModules = {
    toolbar: [
      ["bold", "italic", "underline", "strike"],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ align: [] }],
      ["link"],
      ["clean"],
    ],
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      const tag = inputTag.trim();
      if (!tag) return;
      if (!tags.includes(tag)) setTags((prev) => [...prev, tag]);

      if (!availableTags.includes(tag)) availableTags.push(tag);

      setInputTag("");
    }
  };

  const removeTag = (tagToRemove) => {
    setTags(tags.filter((t) => t !== tagToRemove));
  };

  const submit = async () => {
    if (!selectedSection) return alert("Please select a section");
    if (!title.trim()) return alert("Please enter a title");
    if (!question.trim()) return alert("Please write your question");

    try {
      const payload = {
        section: selectedSection,
        title,
        question: fixQuillHtml(question), // ⭐ Fixed bullets here ⭐
        tags,
        authorId: userId,
        authorName: user?.profile?.fullName || "",
        newTags: tags.filter((t) => !availableTags.includes(t)),
        email: user?.email || "",
      };

      await createDiscussion(payload);
      onCreated && onCreated();
      onClose();
    } catch (e) {
      console.error(e);
      alert("Could not create discussion");
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-2xl p-6 relative">
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-red-500 dark:text-gray-300"
        >
          <X size={22} />
        </button>

        <h3 className="text-2xl font-semibold mb-4 text-center text-blue-700 dark:text-blue-400">
          Ask a Question{" "}
          {selectedSection
            ? `in ${urlParamToTitle(selectedSection)}`
            : "(Choose a Section)"}
        </h3>

        {/* Section Select (only when not locked) */}
        {!isLockedSection && (
          <>
            <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              Section
            </label>

            <select
              value={selectedSection}
              onChange={(e) => {
                setSelectedSection(e.target.value);
                setTags([]);
              }}
              className="w-full p-2 border rounded-lg mb-3 dark:bg-slate-800 dark:text-white"
            >
              <option value="">-- Select a Section --</option>
              {sections.map((s) => (
                <option key={s.slug} value={s.slug}>
                  {s.name}
                </option>
              ))}
            </select>
          </>
        )}

        {/* Title */}
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
          Title
        </label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter a short title for your question"
          className="w-full p-2 border rounded-lg mb-3 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-blue-400"
        />

        {/* Question */}
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
          Question
        </label>
        <ReactQuill
          value={question}
          onChange={setQuestion}
          modules={quillModules}
          className="mb-3 bg-white dark:bg-slate-800 dark:text-white rounded-lg"
          placeholder="Describe your question in detail..."
        />

        {/* Tags */}
        <label className="block mb-1 font-medium text-gray-700 dark:text-gray-200">
          Tags
        </label>

        <div className="flex flex-wrap gap-2 mb-3">
          {tags.map((tag) => (
            <span
              key={tag}
              className="flex items-center gap-1 px-3 py-1 bg-blue-600 text-white text-sm rounded-full"
            >
              {tag}
              <X
                size={14}
                onClick={() => removeTag(tag)}
                className="cursor-pointer hover:text-red-300"
              />
            </span>
          ))}
        </div>

        <input
          type="text"
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value)}
          onKeyDown={handleKeyDown}
          list="availableTags"
          placeholder="Type a tag and press Enter"
          disabled={!selectedSection}
          className="w-full p-2 border rounded-lg mb-4 dark:bg-slate-800 dark:text-white focus:ring-2 focus:ring-green-400 disabled:opacity-50"
        />

        <datalist id="availableTags">
          {availableTags.map((tag) => (
            <option key={tag} value={tag} />
          ))}
        </datalist>

        {/* Buttons */}
        <div className="flex justify-end gap-3 mt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 border rounded-lg dark:text-white hover:bg-gray-100 dark:hover:bg-slate-700"
          >
            Cancel
          </button>

          <button
            onClick={submit}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Post Question
          </button>
        </div>
      </div>
    </div>
  );
}
