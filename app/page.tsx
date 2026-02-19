"use client";

import { useEffect, useState } from "react";

/* ===================== TYPES ===================== */

type Statement = {
  id: string;
  text: string;
};

type MatchItem = {
  id: string;
  text: string;
};

type Question = {
  question_id: string;
  unit: string;
  year: string | null;
  question_type: string;

  context_id?: string | null;
  context_type?: string | null;
  context_content?: any;

  question: {
    prompt: string;
    statements?: Statement[];
    list_i?: MatchItem[];
    list_ii?: MatchItem[];
  };

  options: string[];
  correct_answer?: string[];
};

/* ===================== CONTEXT RENDERER ===================== */

function renderContext(contextContent: any) {
  if (!contextContent) return null;

  /* ---------- COMPREHENSION ---------- */
  if (typeof contextContent === "string") {
    return (
      <div style={{ whiteSpace: "pre-wrap", lineHeight: "1.6" }}>
        {contextContent}
      </div>
    );
  }

  /* ---------- DATA INTERPRETATION ---------- */
  if (
    typeof contextContent === "object" &&
    Array.isArray(contextContent.headers) &&
    Array.isArray(contextContent.rows)
  ) {
    const { headers, rows, caption } = contextContent;

    return (
      <div style={{ overflowX: "auto" }}>
        {caption && (
          <div style={{ fontWeight: "bold", marginBottom: "8px" }}>
            {caption}
          </div>
        )}

        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            marginBottom: "12px",
          }}
        >
          <thead>
            <tr>
              {headers.map((h: string, idx: number) => (
                <th
                  key={idx}
                  style={{
                    border: "1px solid var(--border)",
                    padding: "6px",
                    background: "var(--surface-highlight)",
                  }}
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>

          <tbody>
            {rows.map((row: any[], rIdx: number) => (
              <tr key={rIdx}>
                {row.map((cell: any, cIdx: number) => (
                  <td
                    key={cIdx}
                    style={{
                      border: "1px solid var(--border)",
                      padding: "6px",
                      textAlign: "center",
                    }}
                  >
                    {String(cell)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  return null;
}

/* ===================== PAGE ===================== */

export default function Home() {
  const [units, setUnits] = useState<string[]>([]);
  const [years, setYears] = useState<string[]>([]);

  const [unit, setUnit] = useState("");
  const [year, setYear] = useState("");

  const [questions, setQuestions] = useState<Question[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  const [selectedOptions, setSelectedOptions] = useState<
    Record<string, number>
  >({});

  // --- THEME STATE ---
  const [theme, setTheme] = useState("light");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  /* ===================== LOAD METADATA ===================== */

  useEffect(() => {
    fetch("/api/metadata")
      .then((res) => res.json())
      .then((data) => {
        setUnits(data.units || []);
        setYears(data.years || []);
      });
  }, []);

  /* ===================== LOAD QUESTIONS ===================== */

  useEffect(() => {
    if (!unit || !year) {
      setQuestions([]);
      setTotalPages(0);
      return;
    }

    fetch(
      `/api/questions?unit=${encodeURIComponent(
        unit
      )}&year=${encodeURIComponent(year)}&page=${page}`
    )
      .then((res) => res.json())
      .then((data) => {
        setQuestions(data.questions || []);
        setTotalPages(data.totalPages || 0);
      });
  }, [unit, year, page]);

  useEffect(() => {
    setPage(1);
  }, [unit, year]);

  function handleOptionClick(qid: string, optionIndex: number) {
    setSelectedOptions((prev) => ({
      ...prev,
      [qid]: optionIndex,
    }));
  }

  /* ===================== RENDER ===================== */

  return (
    <div className="container">
      <div className="header">
        <h1>bubbles at sabarmati</h1>
        <p style={{ marginBottom: "15px" }}>an UGC NET paper-I pyq database + practice area</p>

        {/* --- ADDED: Flex container for the toggle button and the PDF link --- */}
        <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
          <button onClick={toggleTheme} className="theme-toggle-btn">
            {theme === "light" ? "🌙" : "☀️"}
          </button>
          
          <a 
            href="/important-info.pdf" 
            target="_blank" 
            rel="noopener noreferrer"
            style={{ 
              color: "var(--primary)", 
              fontWeight: "600", 
              textDecoration: "underline",
              textUnderlineOffset: "4px"
            }}
          >
            Read me! Important!!
          </a>
        </div>
      </div>

      <div className="controls">
        <div className="control-group">
          <label>Unit</label>
          <select value={unit} onChange={(e) => setUnit(e.target.value)}>
            <option value="">Select a Unit…</option>
            {units.map((u) => (
              <option key={u} value={u}>
                {u}
              </option>
            ))}
          </select>
        </div>

        <div className="control-group">
          <label>Year</label>
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Select a Year…</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </div>
      </div>

      {!unit || !year ? (
        <div className="status-msg" style={{ marginTop: "40px" }}>
          Please select both <strong>Unit</strong> and <strong>Year</strong>.
        </div>
      ) : (
        <>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Details</th>
                  <th>Question</th>
                </tr>
              </thead>

              <tbody>
                {!questions.length && (
                  <tr>
                    <td colSpan={2} className="status-msg">
                      No questions found.
                    </td>
                  </tr>
                )}

                {questions.map((q) => {
                  const selectedIdx = selectedOptions[q.question_id];

                  return (
                    <tr key={q.question_id}>
                      {/* --- COLUMN 1: MERGED DETAILS --- */}
                      <td>
                        <div className="meta-cell">
                          {/* ID Badge */}
                          <span className="id-badge">{q.question_id}</span>
                          
                          {/* Unit Badge */}
                          <span className="genre-badge">{q.unit}</span>
                          
                          {/* Year Badge (Styled) */}
                          {q.year && (
                            <span className="year-badge">
                              {q.year}
                            </span>
                          )}
                        </div>
                      </td>

                      {/* --- COLUMN 2: QUESTION CONTENT --- */}
                      <td>
                        {/* ---------- CONTEXT ---------- */}
                        {q.context_content && (
                          <div
                            style={{
                              background: "var(--surface-highlight)",
                              border: "1px solid var(--border)",
                              padding: "12px",
                              marginBottom: "12px",
                              borderRadius: "6px",
                            }}
                          >
                            <strong>Refer to the data below:</strong>
                            <div style={{ marginTop: "8px" }}>
                              {renderContext(q.context_content)}
                            </div>
                          </div>
                        )}

                        {/* ---------- PROMPT ---------- */}
                        <span className="question-text">
                          {q.question.prompt}
                        </span>

                        {/* ---------- MULTI-STATEMENT ---------- */}
                        {q.question.statements && (
                          <div style={{ marginBottom: "15px" }}>
                            {q.question.statements.map((s, idx) => (
                              <div key={`${q.question_id}-stmt-${s.id}-${idx}`}>
                                <strong>{s.id}.</strong> {s.text}
                              </div>
                            ))}
                          </div>
                        )}

                        {/* ---------- MATCH TYPE ---------- */}
                        {q.question_type === "match" &&
                          q.question.list_i &&
                          q.question.list_ii && (
                            <div
                              style={{
                                display: "grid",
                                gridTemplateColumns: "1fr 1fr",
                                gap: "20px",
                                marginTop: "12px",
                                marginBottom: "15px",
                              }}
                            >
                              <div>
                                <strong>LIST – I</strong>
                                {q.question.list_i.map((item) => (
                                  <div key={`${q.question_id}-li-${item.id}`}>
                                    <strong>{item.id}.</strong> {item.text}
                                  </div>
                                ))}
                              </div>

                              <div>
                                <strong>LIST – II</strong>
                                {q.question.list_ii.map((item) => (
                                  <div key={`${q.question_id}-lii-${item.id}`}>
                                    <strong>{item.id}.</strong> {item.text}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                        {/* ---------- OPTIONS ---------- */}
                        <div className="options-grid">
                          {q.options.map((o, idx) => {
                            const isCorrect =
                              q.correct_answer?.includes(String(idx + 1));
                            const isSelected = selectedIdx === idx;

                            let className = "option-box";
                            if (selectedIdx !== undefined) {
                              if (isCorrect) className += " correct";
                              else if (isSelected) className += " wrong";
                            }

                            return (
                              <div
                                key={idx}
                                className={className}
                                onClick={() =>
                                  handleOptionClick(q.question_id, idx)
                                }
                              >
                                {o}
                              </div>
                            );
                          })}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div
              style={{
                display: "flex",
                justifyContent: "center",
                gap: "12px",
                marginTop: "20px",
              }}
            >
              <button
                disabled={page === 1}
                onClick={() => setPage((p) => p - 1)}
                className="theme-toggle-btn"
              >
                Previous
              </button>

              <span style={{ alignSelf: "center" }}>
                Page {page} of {totalPages}
              </span>

              <button
                disabled={page === totalPages}
                onClick={() => setPage((p) => p + 1)}
                className="theme-toggle-btn"
              >
                Next
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}