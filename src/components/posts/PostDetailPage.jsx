import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import LegacyMarkdown from "../LegacyMarkdown";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

const CATEGORY_COLORS = {
  news:          { bg: "#e8f0fe", color: "#1a56db" },
  opportunities: { bg: "#fef3c7", color: "#b45309" },
  tips:          { bg: "#d1fae5", color: "#065f46" },
  events:        { bg: "#ede9fe", color: "#5b21b6" },
};

export default function PostDetailPage({ slug }) {
  const { t } = useTranslation();

  const [post,    setPost]    = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetch(`${API_BASE}/api/posts/${slug}`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((body) => { if (!cancelled) { setPost(body.data ?? null); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(t("postsLoadError")); setLoading(false); } });

    return () => { cancelled = true; };
  }, [slug, t]);

  // Find the translation that matches the current slug
  const translation = post?.translations?.find((tr) => tr.slug === slug)
    ?? post?.translations?.[0];

  const cc = CATEGORY_COLORS[post?.category] ?? { bg: "#f3f4f6", color: "#374151" };

  // Other language versions of this same post
  const otherTranslations = post?.translations?.filter((tr) => tr.slug !== slug && tr.slug) ?? [];

  return (
    <div className="post-detail">
      <nav className="post-detail-nav">
        <Link to="/noticias" className="post-detail-back">← {t("postsBack")}</Link>
      </nav>

      {loading && <p className="posts-state-msg">{t("postsLoading")}</p>}
      {error   && <p className="posts-state-msg posts-state-error">{error}</p>}

      {!loading && !error && post && (
        <article className="post-detail-article">
          <header className="post-detail-header">
            <span
              className="posts-card-category"
              style={{ background: cc.bg, color: cc.color }}
            >
              {t(`postsCat.${post.category}`, { defaultValue: post.category })}
            </span>

            <h1 className="post-detail-title">{translation?.title}</h1>

            <div className="post-detail-meta">
              {post.published_at && (
                <time dateTime={post.published_at}>
                  {new Date(post.published_at).toLocaleDateString()}
                </time>
              )}
              {translation?.language && (
                <span className="posts-card-lang">
                  {t(`lang.${translation.language.code}`, { defaultValue: translation.language.name })}
                </span>
              )}
            </div>

            {/* Other language versions */}
            {otherTranslations.length > 0 && (
              <div className="post-detail-langs">
                <span className="post-detail-langs-label">{t("postsOtherLangs")}:</span>
                {otherTranslations.map((tr) => (
                  <Link key={tr.id} to={`/noticias/${tr.slug}`} className="post-detail-lang-link">
                    {t(`lang.${tr.language?.code}`, { defaultValue: tr.language?.name ?? tr.slug })}
                  </Link>
                ))}
              </div>
            )}
          </header>

          {translation?.content && (
            <div className="post-detail-body">
              <LegacyMarkdown markdown={translation.content} />
            </div>
          )}
        </article>
      )}
    </div>
  );
}
