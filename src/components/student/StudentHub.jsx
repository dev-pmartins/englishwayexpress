import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStudentAuth } from "../../contexts/StudentAuthContext";
import { useStudentLanguages } from "../../hooks/useStudentLanguages";
import PostCover from "../posts/PostCover";
import { API_BASE } from "../../api/base";

const SECTIONS = [
  { key: "news",          icon: "📰" },
  { key: "tips",          icon: "💡" },
  { key: "complementary", icon: "📚" },
  { key: "practice",      icon: "🗣️" },
];

function HubSection({ sectionKey, icon, langs, t }) {
  const [posts,   setPosts]   = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({ category: sectionKey, per_page: 3 });
    if (langs.length > 0) params.set("langs", langs.join(","));
    fetch(`${API_BASE}/api/posts/by-languages?${params}`)
      .then((r) => r.json())
      .then((body) => { if (!cancelled) { setPosts(body.data?.data ?? []); setLoading(false); } })
      .catch(() => { if (!cancelled) { setPosts([]); setLoading(false); } });
    return () => { cancelled = true; };
  }, [sectionKey, langs.join(",")]);

  return (
    <section className="hub-section">
      <h3 className="hub-section-title">
        <span className="hub-section-icon" aria-hidden="true">{icon}</span>
        {t(`hubSection.${sectionKey}`)}
      </h3>

      {loading && <p className="student-state-msg">{t("studentLoading")}</p>}

      {!loading && posts?.length === 0 && (
        <p className="student-state-msg">{t("studentNoPosts")}</p>
      )}

      {!loading && posts?.length > 0 && (
        <div className="hub-posts-row">
          {posts.map((post) => {
            const tr = post.translations?.[0];
            if (!tr) return null;
            const langCode = tr.language?.code ?? "en";
            return (
              <Link
                key={post.id}
                to={`/area-do-aluno/${langCode}/${tr.slug}`}
                className="hub-post-card"
              >
                <PostCover src={post.cover_image} />
                <div className="hub-post-card-body">
                  <span className="hub-post-lang">{tr.language?.name ?? langCode}</span>
                  <h4 className="hub-post-title">{tr.title}</h4>
                  {post.published_at && (
                    <time className="hub-post-date" dateTime={post.published_at}>
                      {new Date(post.published_at).toLocaleDateString()}
                    </time>
                  )}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default function StudentHub() {
  const { t } = useTranslation();
  const { isAuthenticated, user, logout } = useStudentAuth();
  const { languages } = useStudentLanguages();

  const benefits = t("hubBenefits", { returnObjects: true });

  return (
    <div className="student-area">
      {/* Header (logged-in only) */}
      {isAuthenticated && (
        <div className="student-header">
          <div>
            <h2 className="section-title section-title-small">
              {t("studentWelcome", { name: user?.name?.split(" ")[0] })}
            </h2>
            <p className="student-subtitle">{t("studentHubSubtitle")}</p>
          </div>
          <button className="student-logout-btn" onClick={logout}>
            {t("studentLogout")}
          </button>
        </div>
      )}

      {/* Inviting hero section — shown only when logged out */}
      {!isAuthenticated && (
        <div className="hub-hero">
          <div className="hub-hero-body">
            <p className="hub-hero-eyebrow">{t("hubHeroEyebrow")}</p>
            <h2 className="hub-hero-title">{t("hubHeroTitle")}</h2>
            <p className="hub-hero-description">{t("hubHeroDescription")}</p>

            {Array.isArray(benefits) && benefits.length > 0 && (
              <ul className="hub-hero-benefits">
                {benefits.map((benefit, i) => (
                  <li key={i} className="hub-hero-benefit-item">
                    <span className="hub-hero-benefit-check" aria-hidden="true">✓</span>
                    {benefit}
                  </li>
                ))}
              </ul>
            )}

            <div className="hub-enroll-actions hub-hero-actions">
              <Link to="/fale-conosco" className="hub-enroll-btn hub-enroll-btn--primary">
                🎓 {t("hubEnrollCta")}
              </Link>
              <Link to="/area-do-aluno/login" className="hub-enroll-btn hub-enroll-btn--ghost">
                {t("studentLoginSubmit")}
              </Link>
            </div>
          </div>

          <div className="hub-hero-visual" aria-hidden="true">
            <div className="hub-hero-flags">
              {["🇬🇧", "🇺🇸", "🇪🇸", "🇩🇪", "🇫🇷", "🇮🇹"].map((flag, i) => (
                <span key={i} className="hub-hero-flag">{flag}</span>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Content sections */}
      {SECTIONS.map((s) => (
        <HubSection
          key={s.key}
          sectionKey={s.key}
          icon={s.icon}
          langs={languages}
          t={t}
        />
      ))}
    </div>
  );
}
