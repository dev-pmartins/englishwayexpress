import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PostCover from "./PostCover";
import PostsLangModal from "./PostsLangModal";
import { API_BASE } from "../../api/base";
const CATEGORIES = ["news", "opportunities", "tips", "events"];

const CATEGORY_COLORS = {
  news:          { bg: "#e8f0fe", color: "#1a56db" },
  opportunities: { bg: "#fef3c7", color: "#b45309" },
  tips:          { bg: "#d1fae5", color: "#065f46" },
  events:        { bg: "#ede9fe", color: "#5b21b6" },
};

function translationsOf(post) {
  return (post.translations ?? []).filter((tr) => tr.slug);
}

function languageRank(code = "") {
  const normalized = code.toLowerCase();
  if (normalized === "pt" || normalized.startsWith("pt-")) return 0;
  if (normalized === "en" || normalized.startsWith("en-")) return 1;
  return 2;
}

function sortTranslations(translations) {
  return [...translations].sort((a, b) => {
    const rankA = languageRank(a.language?.code);
    const rankB = languageRank(b.language?.code);
    if (rankA !== rankB) return rankA - rankB;
    return (a.language?.name ?? "").localeCompare(b.language?.name ?? "");
  });
}

function pickTranslation(translations, preferredCode) {
  const sorted = sortTranslations(translations);
  if (!sorted.length) return null;

  if (preferredCode) {
    const exact = sorted.find((tr) => tr.language?.code === preferredCode);
    if (exact) return exact;

    const prefix = preferredCode.split("-")[0];
    const byPrefix = sorted.find((tr) => {
      const code = tr.language?.code ?? "";
      return code === prefix || code.startsWith(`${prefix}-`) || preferredCode.startsWith(code);
    });
    if (byPrefix) return byPrefix;
  }

  return sorted[0];
}

function languageLabel(t, language) {
  if (!language) return "";
  return t(`lang.${language.code}`, { defaultValue: language.name });
}

export default function PostsPage() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();

  const [posts,        setPosts]        = useState(null);
  const [loading,      setLoading]      = useState(true);
  const [error,        setError]        = useState("");
  const [category,     setCategory]     = useState("");
  const [langCode,     setLangCode]     = useState("");
  const [pickerPost,   setPickerPost]   = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const params = new URLSearchParams();
    if (category) params.set("category", category);

    fetch(`${API_BASE}/api/posts?${params}`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((body) => {
        if (!cancelled) {
          setPosts(body.data?.data ?? []);
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setError(t("postsLoadError"));
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [category, t]);

  useEffect(() => {
    setPickerPost(null);
  }, [category, langCode]);

  const allLangs = posts
    ? [...new Map(
        posts.flatMap((p) => translationsOf(p).map((tr) => [tr.language?.code, tr.language]))
      ).values()]
        .filter(Boolean)
        .sort((a, b) => {
          const rankA = languageRank(a.code);
          const rankB = languageRank(b.code);
          if (rankA !== rankB) return rankA - rankB;
          return (a.name ?? "").localeCompare(b.name ?? "");
        })
    : [];

  const visiblePosts = posts
    ? posts.filter((post) => {
        const translations = translationsOf(post);
        if (!translations.length) return false;
        if (!langCode) return true;
        return translations.some((tr) => tr.language?.code === langCode);
      })
    : [];

  const pickerTranslations = pickerPost
    ? sortTranslations(
        langCode
          ? translationsOf(pickerPost).filter((tr) => tr.language?.code === langCode)
          : translationsOf(pickerPost)
      )
    : [];

  const openPost = (post) => {
    const translations = sortTranslations(translationsOf(post));
    const candidates = langCode
      ? translations.filter((tr) => tr.language?.code === langCode)
      : translations;

    if (candidates.length === 1) {
      setPickerPost(null);
      navigate(`/noticias/${candidates[0].slug}`);
      return;
    }

    if (candidates.length > 1) {
      setPickerPost(post);
    }
  };

  return (
    <div className="posts-page">
      <header className="posts-page-header">
        <h1 className="posts-page-title">{t("postsPageTitle")}</h1>
        <p className="posts-page-subtitle">{t("postsPageSubtitle")}</p>
      </header>

      <div className="posts-filters">
        <div className="posts-filter-group">
          <label className="posts-filter-label" htmlFor="posts-filter-category">
            {t("postsFilterCategory")}
          </label>
          <select
            id="posts-filter-category"
            className="posts-filter-select"
            value={category}
            onChange={(event) => setCategory(event.target.value)}
          >
            <option value="">{t("postsFilterAll")}</option>
            {CATEGORIES.map((code) => (
              <option key={code} value={code}>
                {t(`postsCat.${code}`)}
              </option>
            ))}
          </select>
        </div>

        <div className="posts-filter-group">
          <label className="posts-filter-label" htmlFor="posts-filter-lang">
            {t("postsFilterLang")}
          </label>
          <select
            id="posts-filter-lang"
            className="posts-filter-select"
            value={langCode}
            onChange={(event) => setLangCode(event.target.value)}
          >
            <option value="">{t("postsFilterAll")}</option>
            {allLangs.map((language) => (
              <option key={language.code} value={language.code}>
                {languageLabel(t, language)}
              </option>
            ))}
          </select>
        </div>
      </div>

      {loading && <p className="posts-state-msg">{t("postsLoading")}</p>}
      {error   && <p className="posts-state-msg posts-state-error">{error}</p>}

      {!loading && !error && visiblePosts.length === 0 && (
        <p className="posts-state-msg">{t("postsNone")}</p>
      )}

      {!loading && !error && visiblePosts.length > 0 && (
        <div className="posts-grid">
          {visiblePosts.map((post) => {
            const translations = sortTranslations(translationsOf(post));
            const displayTr = pickTranslation(translations, langCode || i18n.language);
            const cc = CATEGORY_COLORS[post.category] ?? { bg: "#f3f4f6", color: "#374151" };
            const hasMultipleLangs = (langCode ? translations.filter((tr) => tr.language?.code === langCode) : translations).length > 1;

            return (
              <article key={post.id} className="posts-card">
                <button
                  type="button"
                  className="posts-card-hit"
                  onClick={() => openPost(post)}
                  aria-haspopup={hasMultipleLangs ? "dialog" : undefined}
                >
                  <div className="posts-card-cover">
                    <PostCover src={post.cover_image} />
                    <span
                      className="posts-card-category posts-card-category--overlay"
                      style={{ background: cc.bg, color: cc.color }}
                    >
                      {t(`postsCat.${post.category}`, { defaultValue: post.category })}
                    </span>
                  </div>

                  <div className="posts-card-body">
                    <div className="posts-card-top">
                      {translations.length > 0 && (
                        <span className="posts-card-langs" aria-label={t("postsFilterLang")}>
                          {translations.map((tr) => (
                            <span key={tr.slug} className="posts-card-lang-chip">
                              {languageLabel(t, tr.language)}
                            </span>
                          ))}
                        </span>
                      )}
                      {post.published_at && (
                        <time className="posts-card-date" dateTime={post.published_at}>
                          {new Date(post.published_at).toLocaleDateString()}
                        </time>
                      )}
                    </div>
                    <h2 className="posts-card-title">{displayTr?.title}</h2>
                    {displayTr?.short_description && (
                      <p className="posts-card-excerpt">
                        {displayTr.short_description.slice(0, 160)}
                        {displayTr.short_description.length > 160 ? "…" : ""}
                      </p>
                    )}
                    <span className="posts-card-readmore">{t("postsReadMore")} →</span>
                  </div>
                </button>
              </article>
            );
          })}
        </div>
      )}

      {pickerTranslations.length > 1 && (
        <PostsLangModal
          translations={pickerTranslations}
          onClose={() => setPickerPost(null)}
        />
      )}
    </div>
  );
}
