import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStudentLanguages } from "../../hooks/useStudentLanguages";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export default function StudentPracticePage() {
  const { t } = useTranslation();
  const { languages: selectedLangs } = useStudentLanguages();

  const [posts,   setPosts]   = useState([]);
  const [page,    setPage]    = useState(1);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  const fetchPage = useCallback((pageNum, replace = false) => {
    setLoading(true);
    setError("");

    const params = new URLSearchParams({ category: "practice", page: pageNum, per_page: 12 });
    if (selectedLangs?.length) params.set("langs", selectedLangs.join(","));

    fetch(`${API_BASE}/api/posts/by-languages?${params}`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((body) => {
        const incoming  = body.data?.data ?? [];
        const lastPage  = body.data?.last_page ?? 1;
        setPosts((prev) => replace ? incoming : [...prev, ...incoming]);
        setHasMore(pageNum < lastPage);
        setLoading(false);
      })
      .catch(() => { setError(t("studentLoadError")); setLoading(false); });
  }, [selectedLangs, t]);

  // Re-fetch from page 1 whenever selected languages change
  useEffect(() => {
    setPage(1);
    fetchPage(1, true);
  }, [fetchPage]);

  const loadMore = () => {
    const next = page + 1;
    setPage(next);
    fetchPage(next, false);
  };

  return (
    <div className="student-area">
      <div className="comp-page-header">
        <Link to="/area-do-aluno" className="student-back-link">← {t("studentBackHub")}</Link>
        <h2 className="comp-page-title">🗣️ {t("practicePageTitle")}</h2>
        <p className="comp-page-subtitle">{t("practicePageSubtitle")}</p>
      </div>

      {error && <p className="student-state-msg student-state-error">{error}</p>}

      {!error && posts.length === 0 && !loading && (
        <p className="student-state-msg">{t("studentNoPosts")}</p>
      )}

      {posts.length > 0 && (
        <div className="student-posts-grid">
          {posts.map((post) => {
            const tr = post.translations?.[0];
            if (!tr) return null;
            const langCode = tr.language?.code ?? "en";
            return (
              <Link
                key={post.id}
                to={`/area-do-aluno/${langCode}/${tr.slug}`}
                className="student-post-card student-post-card--link"
              >
                <span className="student-post-category">{tr.language?.name ?? langCode}</span>
                <h3 className="student-post-title">{tr.title}</h3>
                {post.published_at && (
                  <time className="student-post-date" dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString()}
                  </time>
                )}
                {tr.content && (
                  <p className="student-post-excerpt">
                    {tr.content.replace(/[#*`>]/g, "").slice(0, 160)}
                    {tr.content.length > 160 ? "…" : ""}
                  </p>
                )}
              </Link>
            );
          })}
        </div>
      )}

      {loading && <p className="student-state-msg">{t("studentLoading")}</p>}

      {!loading && hasMore && (
        <div className="tips-load-more">
          <button className="tips-load-more-btn" onClick={loadMore}>
            {t("practiceLoadMore")}
          </button>
        </div>
      )}
    </div>
  );
}
