import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStudentAuth } from "../../contexts/StudentAuthContext";
import { useStudentLanguages } from "../../hooks/useStudentLanguages";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function MaterialCard({ material }) {
  const [open, setOpen] = useState(false);
  const { t } = useTranslation();
  const hasSlug = Boolean(material.slug);

  return (
    <div className="comp-material-card">
      <button className="comp-material-btn" onClick={() => setOpen((o) => !o)}>
        <span className="comp-material-btn-title">{material.title || material.name}</span>
        {material.student_level && (
          <span className="student-level-badge student-level-badge--sm">{material.student_level}</span>
        )}
        {material.is_opensource && (
          <span className="comp-material-open-badge">🌐</span>
        )}
        <span className="student-material-arrow">{open ? "▲" : "▼"}</span>
      </button>

      {open && (
        <div className="student-material-body">
          {material.module && (
            <p className="comp-material-module-label">📁 {material.module.name}</p>
          )}
          {material.content && (
            <div className="student-material-content">
              {material.content.split("\n").map((line, i) => <p key={i}>{line}</p>)}
            </div>
          )}
          {material.attachments?.length > 0 && (
            <ul className="student-attachments">
              {material.attachments.map((att) => (
                <li key={att.id}>
                  <a href={att.url} target="_blank" rel="noreferrer">
                    📎 {att.original_name}
                  </a>
                </li>
              ))}
            </ul>
          )}
          {hasSlug && (
            <Link
              to={`/area-do-aluno/material/${material.slug}`}
              className="comp-material-detail-link"
            >
              {t("materialViewFull")} →
            </Link>
          )}
        </div>
      )}
    </div>
  );
}

function LangSection({ group, t }) {
  const { language, student_level, materials } = group;

  return (
    <section className="comp-lang-section">
      <div className="comp-lang-header">
        <h3 className="comp-lang-title">{language.name}</h3>
        {student_level && (
          <span className="student-level-badge">{t("studentYourLevel")}: {student_level}</span>
        )}
      </div>
      {materials.length === 0 ? (
        <p className="student-state-msg">{t("compNoMaterials")}</p>
      ) : (
        <div className="comp-materials-list">
          {materials.map((mat) => (
            <MaterialCard key={mat.id} material={mat} />
          ))}
        </div>
      )}
    </section>
  );
}

export default function StudentComplementaryPage() {
  const { t } = useTranslation();
  const { isAuthenticated, token } = useStudentAuth();
  const { languages: selectedLangs } = useStudentLanguages();

  const [groups, setGroups]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const langs = selectedLangs?.length ? selectedLangs.join(",") : "";
    const url   = `${API_BASE}/api/materials${langs ? `?langs=${langs}` : ""}`;

    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(url, { headers })
      .then((r) => { if (!r.ok) throw new Error(r.status); return r.json(); })
      .then((body) => { if (!cancelled) { setGroups(body.data ?? []); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(t("studentLoadError")); setLoading(false); } });

    return () => { cancelled = true; };
  }, [token, selectedLangs, t]);

  return (
    <div className="student-area">
      <div className="comp-page-header">
        <Link to="/area-do-aluno" className="student-back-link">← {t("studentBackHub")}</Link>
        <h2 className="comp-page-title">{t("compPageTitle")}</h2>
        <p className="comp-page-subtitle">{t("compPageSubtitle")}</p>
      </div>

      {!isAuthenticated && (
        <div className="comp-guest-notice">
          <span>🔓 {t("compGuestNotice")}</span>
          <Link to="/area-do-aluno/login" className="comp-guest-login-link">{t("compGuestLogin")}</Link>
        </div>
      )}

      {loading && <p className="student-state-msg">{t("studentLoading")}</p>}
      {error   && <p className="student-state-msg student-state-error">{error}</p>}

      {!loading && !error && groups?.length === 0 && (
        <p className="student-state-msg">{t("compNoMaterials")}</p>
      )}

      {!loading && !error && groups?.length > 0 && (
        <div className="comp-content">
          {groups.map((group) => (
            <LangSection key={group.language.id} group={group} t={t} />
          ))}
        </div>
      )}
    </div>
  );
}
