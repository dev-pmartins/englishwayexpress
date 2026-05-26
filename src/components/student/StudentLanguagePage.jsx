import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStudentAuth } from "../../contexts/StudentAuthContext";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

const LANG_META = {
  en: { flag: "🇬🇧", color: "#012169" },
  es: { flag: "🇪🇸", color: "#c60b1e" },
  de: { flag: "🇩🇪", color: "#222"    },
  fr: { flag: "🇫🇷", color: "#002395" },
  it: { flag: "🇮🇹", color: "#009246" },
};

export default function StudentLanguagePage({ langCode }) {
  const { t } = useTranslation();
  const { token } = useStudentAuth();

  const [posts,   setPosts]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetch(`${API_BASE}/api/student/posts/${langCode}`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => {
        if (!r.ok) throw new Error(r.status);
        return r.json();
      })
      .then((body) => {
        if (!cancelled) {
          setPosts(body.data?.data ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(t("studentLoadError"));
          setLoading(false);
        }
      });
    return () => { cancelled = true; };
  }, [langCode, token, t]);

  const meta = LANG_META[langCode] ?? {};

  return (
    <div className="student-area">
      <div className="student-lang-page-header" style={{ "--card-color": meta.color }}>
        <Link to="/area-do-aluno" className="student-back-link">← {t("studentBackHub")}</Link>
        <h2 className="student-lang-page-title">
          <span className="student-lang-flag">{meta.flag}</span>
          {t(`lang.${langCode}`)}
        </h2>
      </div>

      {loading && <p className="student-state-msg">{t("studentLoading")}</p>}
      {error   && <p className="student-state-msg student-state-error">{error}</p>}

      {!loading && !error && posts?.length === 0 && (
        <p className="student-state-msg">{t("studentNoPosts")}</p>
      )}

      {!loading && !error && posts?.length > 0 && (
        <div className="student-posts-grid">
          {posts.map((post) => {
            const translation = post.translations?.[0];
            if (!translation) return null;
            return (
              <article key={post.id} className="student-post-card">
                <span className="student-post-category">{post.category}</span>
                <h3 className="student-post-title">{translation.title}</h3>
                {post.published_at && (
                  <time className="student-post-date" dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString()}
                  </time>
                )}
                {translation.content && (
                  <p className="student-post-excerpt">
                    {translation.content.replace(/[#*`>]/g, "").slice(0, 200)}
                    {translation.content.length > 200 ? "…" : ""}
                  </p>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
