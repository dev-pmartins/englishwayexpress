import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import PostCover from "./PostCover";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function pickTranslation(post, preferredCode) {
  const translations = (post.translations ?? []).filter((tr) => tr.slug);
  if (!translations.length) return null;

  if (preferredCode) {
    const exact = translations.find((tr) => tr.language?.code === preferredCode);
    if (exact) return exact;

    const prefix = preferredCode.split("-")[0];
    const byPrefix = translations.find((tr) => {
      const code = tr.language?.code ?? "";
      return code === prefix || code.startsWith(`${prefix}-`) || preferredCode.startsWith(code);
    });
    if (byPrefix) return byPrefix;
  }

  return translations[0];
}

export default function HomeLatestNews() {
  const { t, i18n } = useTranslation();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;

    fetch(`${API_BASE}/api/posts`)
      .then((response) => {
        if (!response.ok) throw new Error(response.status);
        return response.json();
      })
      .then((body) => {
        if (!cancelled) {
          setPosts((body.data?.data ?? []).slice(0, 3));
          setLoading(false);
        }
      })
      .catch(() => {
        if (!cancelled) {
          setPosts([]);
          setLoading(false);
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  if (!loading && posts.length === 0) {
    return null;
  }

  return (
    <section className="home-latest-news" id="ultimas-noticias">
      <div className="home-latest-news-header">
        <h2 className="section-title">{t("home.latestNewsTitle")}</h2>
        <Link className="home-latest-news-all" to="/noticias">
          {t("home.latestNewsViewAll")}
        </Link>
      </div>

      {loading && <p className="home-latest-news-status">{t("postsLoading")}</p>}

      {!loading && (
        <div className="home-latest-news-grid">
          {posts.map((post) => {
            const translation = pickTranslation(post, i18n.language);
            if (!translation) return null;

            return (
              <Link
                key={post.id}
                to={`/noticias/${translation.slug}`}
                className="home-latest-news-card"
              >
                <PostCover src={post.cover_image} alt={translation.title} />
                <div className="home-latest-news-card-body">
                  {post.published_at && (
                    <time className="home-latest-news-date" dateTime={post.published_at}>
                      {new Date(post.published_at).toLocaleDateString()}
                    </time>
                  )}
                  <h3>{translation.title}</h3>
                  {translation.short_description && (
                    <p>
                      {translation.short_description.slice(0, 140)}
                      {translation.short_description.length > 140 ? "…" : ""}
                    </p>
                  )}
                  <span className="home-latest-news-readmore">{t("postsReadMore")} →</span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}
