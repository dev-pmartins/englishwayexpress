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

function MaterialsSection({ langCode, token, t }) {
  const [groups,  setGroups]  = useState(null);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [openMaterial, setOpenMaterial] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE}/api/student/modules`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((body) => {
        if (!cancelled) {
          const all = body.data ?? [];
          const match = all.filter((g) => g.language?.code === langCode);
          setGroups(match);
          setLoading(false);
        }
      })
      .catch(() => { if (!cancelled) { setError(t("studentLoadError")); setLoading(false); } });
    return () => { cancelled = true; };
  }, [langCode, token, t]);

  if (loading) return <p className="student-state-msg">{t("studentLoading")}</p>;
  if (error)   return <p className="student-state-msg student-state-error">{error}</p>;
  if (!groups || groups.length === 0) return <p className="student-state-msg">{t("studentNoModules")}</p>;

  return (
    <>
      {groups.map((group) =>
        group.modules.map((mod) => (
          <div key={mod.id} className="student-module">
            <h4 className="student-module-title">
              {mod.name}
              {mod.minimum_level && (
                <span className="student-level-badge student-level-badge--sm">{mod.minimum_level}+</span>
              )}
            </h4>
            {mod.materials.length === 0 ? (
              <p className="student-empty">{t("studentNoMaterials")}</p>
            ) : (
              <ul className="student-materials-list">
                {mod.materials.map((mat) => (
                  <li key={mat.id}>
                    <button
                      className="student-material-btn"
                      onClick={() => setOpenMaterial(openMaterial?.id === mat.id ? null : mat)}
                    >
                      <span>{mat.title || mat.name}</span>
                      <span className="student-material-arrow">
                        {openMaterial?.id === mat.id ? "▲" : "▼"}
                      </span>
                    </button>
                    {openMaterial?.id === mat.id && (
                      <div className="student-material-body">
                        {mat.content && (
                          <div className="student-material-content">
                            {mat.content.split("\n").map((line, i) => <p key={i}>{line}</p>)}
                          </div>
                        )}
                        {mat.attachments?.length > 0 && (
                          <ul className="student-attachments">
                            {mat.attachments.map((att) => (
                              <li key={att.id}>
                                <a href={att.url} target="_blank" rel="noreferrer">
                                  📎 {att.original_name}
                                </a>
                              </li>
                            ))}
                          </ul>
                        )}
                        {mat.slug && (
                          <Link
                            to={`/area-do-aluno/material/${mat.slug}`}
                            className="comp-material-detail-link"
                          >
                            {t("materialViewFull")} →
                          </Link>
                        )}
                      </div>
                    )}
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))
      )}
    </>
  );
}

export default function StudentLanguagePage({ langCode }) {
  const { t } = useTranslation();
  const { isAuthenticated, token } = useStudentAuth();

  const [posts,        setPosts]        = useState(null);
  const [postsLoading, setPostsLoading] = useState(true);
  const [postsError,   setPostsError]   = useState("");

  useEffect(() => {
    let cancelled = false;
    setPostsLoading(true);
    setPostsError("");
    // Public endpoint — no auth header needed
    fetch(`${API_BASE}/api/student/posts/${langCode}`)
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((body) => { if (!cancelled) { setPosts(body.data?.data ?? []); setPostsLoading(false); } })
      .catch(() => { if (!cancelled) { setPostsError(t("studentLoadError")); setPostsLoading(false); } });
    return () => { cancelled = true; };
  }, [langCode, t]);

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

      {/* ── Posts (public) ── */}
      <h3 className="student-section-heading">{t("studentPostsHeading")}</h3>

      {postsLoading && <p className="student-state-msg">{t("studentLoading")}</p>}
      {postsError   && <p className="student-state-msg student-state-error">{postsError}</p>}

      {!postsLoading && !postsError && posts?.length === 0 && (
        <p className="student-state-msg">{t("studentNoPosts")}</p>
      )}

      {!postsLoading && !postsError && posts?.length > 0 && (
        <div className="student-posts-grid">
          {posts.map((post) => {
            const translation = post.translations?.[0];
            if (!translation) return null;
            return (
              <Link
                key={post.id}
                to={`/area-do-aluno/${langCode}/${translation.slug}`}
                className="student-post-card student-post-card--link"
              >
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
              </Link>
            );
          })}
        </div>
      )}

      {/* ── Materials (authenticated only — hidden when logged out) ── */}
      {isAuthenticated && (
        <>
          <h3 className="student-section-heading student-section-heading--materials">
            {t("studentMaterialsHeading")}
          </h3>
          <MaterialsSection langCode={langCode} token={token} t={t} />
        </>
      )}
    </div>
  );
}
