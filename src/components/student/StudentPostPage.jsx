import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LegacyMarkdown from "../LegacyMarkdown";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

const LANG_META = {
  en: { flag: "🇬🇧", color: "#012169" },
  es: { flag: "🇪🇸", color: "#c60b1e" },
  de: { flag: "🇩🇪", color: "#222"    },
  fr: { flag: "🇫🇷", color: "#002395" },
  it: { flag: "🇮🇹", color: "#009246" },
};

export default function StudentPostPage({ langCode, slug }) {
  const { t } = useTranslation();

  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    // Public endpoint — slug belongs to the translation
    fetch(`${API_BASE}/api/posts/${slug}`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((body) => {
        if (!cancelled) {
          setPost(body.data ?? null);
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
  }, [slug, t]);

  const meta = LANG_META[langCode] ?? {};

  // Find the translation that matches this slug
  const translation = post?.translations?.find((tr) => tr.slug === slug)
    ?? post?.translations?.[0];

  return (
    <div className="student-area">
      <div className="student-lang-page-header" style={{ "--card-color": meta.color }}>
        <Link to={`/area-do-aluno/${langCode}`} className="student-back-link">
          ← {t(`lang.${langCode}`)}
        </Link>
        {post && (
          <h1 className="student-lang-page-title" style={{ fontSize: "1.1rem" }}>
            {translation?.title}
          </h1>
        )}
      </div>

      {loading && <p className="student-state-msg">{t("studentLoading")}</p>}
      {error   && <p className="student-state-msg student-state-error">{error}</p>}

      {!loading && !error && post && (
        <article className="student-post-article">
          <header className="student-post-article-header">
            <span className="student-post-category">{post.category}</span>
            <h1 className="student-post-article-title">{translation?.title}</h1>
            {post.published_at && (
              <time className="student-post-date" dateTime={post.published_at}>
                {new Date(post.published_at).toLocaleDateString()}
              </time>
            )}
          </header>

          {translation?.content && (
            <div className="student-post-article-body">
              <LegacyMarkdown markdown={translation.content} />
            </div>
          )}
        </article>
      )}
    </div>
  );
}
