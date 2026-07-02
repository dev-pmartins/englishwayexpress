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

export default function PostsPage() {
  const { t } = useTranslation();

  const [posts,    setPosts]    = useState(null);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState("");
  const [category, setCategory] = useState("");
  const [langCode, setLangCode] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (category) params.set("category", category);

    fetch(`${API_BASE}/api/posts?${params}`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((body) => { if (!cancelled) { setPosts(body.data?.data ?? []); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(t("postsLoadError")); setLoading(false); } });

    return () => { cancelled = true; };
  }, [category, t]);

  // Derive available language codes from the loaded posts
  const allLangs = posts
    ? [...new Map(
        posts.flatMap((p) => p.translations?.map((tr) => [tr.language?.code, tr.language]) ?? [])
      ).values()].filter(Boolean)
    : [];

  // Filter + pick the correct translation per post
  const visiblePosts = posts
    ? posts.flatMap((post) => {
        const translations = post.translations ?? [];
        const candidates = langCode
          ? translations.filter((tr) => tr.language?.code === langCode)
          : translations;
        const tr = candidates[0];
        if (!tr?.slug) return [];
        return [{ post, tr }];
      })
    : [];

  return (
    <div className="posts-page">
      <header className="posts-page-header">
        <h1 className="posts-page-title">{t("postsPageTitle")}</h1>
        <p className="posts-page-subtitle">{t("postsPageSubtitle")}</p>
      </header>

      {/* ── Filters ── */}
      <div className="posts-filters">
        <div className="posts-filter-group">
          <label className="posts-filter-label">{t("postsFilterCategory")}</label>
          <div className="posts-filter-pills">
            {["", "news", "opportunities", "tips", "events"].map((c) => (
              <button
                key={c || "all"}
                className={`posts-filter-pill${category === c ? " posts-filter-pill--active" : ""}`}
                onClick={() => setCategory(c)}
              >
                {c ? t(`postsCat.${c}`) : t("postsFilterAll")}
              </button>
            ))}
          </div>
        </div>

        {allLangs.length > 1 && (
          <div className="posts-filter-group">
            <label className="posts-filter-label">{t("postsFilterLang")}</label>
            <div className="posts-filter-pills">
              <button
                className={`posts-filter-pill${langCode === "" ? " posts-filter-pill--active" : ""}`}
                onClick={() => setLangCode("")}
              >
                {t("postsFilterAll")}
              </button>
              {allLangs.map((l) => (
                <button
                  key={l.code}
                  className={`posts-filter-pill${langCode === l.code ? " posts-filter-pill--active" : ""}`}
                  onClick={() => setLangCode(l.code)}
                >
                  {t(`lang.${l.code}`, { defaultValue: l.name })}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {loading && <p className="posts-state-msg">{t("postsLoading")}</p>}
      {error   && <p className="posts-state-msg posts-state-error">{error}</p>}

      {!loading && !error && visiblePosts.length === 0 && (
        <p className="posts-state-msg">{t("postsNone")}</p>
      )}

      {!loading && !error && visiblePosts.length > 0 && (
        <div className="posts-grid">
          {visiblePosts.map(({ post, tr }) => {
            const cc = CATEGORY_COLORS[post.category] ?? { bg: "#f3f4f6", color: "#374151" };
            return (
              <Link
                key={`${post.id}-${tr.id}`}
                to={`/noticias/${tr.slug}`}
                className="posts-card"
              >
                <div className="posts-card-top">
                  <span
                    className="posts-card-category"
                    style={{ background: cc.bg, color: cc.color }}
                  >
                    {t(`postsCat.${post.category}`, { defaultValue: post.category })}
                  </span>
                  {tr.language && (
                    <span className="posts-card-lang">
                      {t(`lang.${tr.language.code}`, { defaultValue: tr.language.name })}
                    </span>
                  )}
                </div>
                <h2 className="posts-card-title">{tr.title}</h2>
                {post.published_at && (
                  <time className="posts-card-date" dateTime={post.published_at}>
                    {new Date(post.published_at).toLocaleDateString()}
                  </time>
                )}
                {tr.short_description && (
                  <p className="posts-card-excerpt">
                    {tr.short_description.slice(0, 180)}
                    {tr.short_description.length > 180 ? "…" : ""}
                  </p>
                )}
                <span className="posts-card-readmore">{t("postsReadMore")} →</span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
