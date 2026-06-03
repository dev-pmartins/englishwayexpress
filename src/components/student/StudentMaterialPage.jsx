import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStudentAuth } from "../../contexts/StudentAuthContext";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export default function StudentMaterialPage({ slug }) {
  const { t } = useTranslation();
  const { token } = useStudentAuth();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading]   = useState(true);
  const [error, setError]       = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    const headers = {};
    if (token) headers.Authorization = `Bearer ${token}`;

    fetch(`${API_BASE}/api/materials/${slug}`, { headers })
      .then((r) => {
        if (r.status === 403) throw new Error("restricted");
        if (!r.ok) throw new Error("notfound");
        return r.json();
      })
      .then((body) => {
        if (!cancelled) {
          setMaterial(body.data ?? null);
          setLoading(false);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(err.message === "restricted" ? t("materialRestricted") : t("materialNotFound"));
          setLoading(false);
        }
      });

    return () => { cancelled = true; };
  }, [slug, token, t]);

  return (
    <div className="student-area">
      <div className="material-detail-header">
        <Link to="/area-do-aluno/complementary-material" className="student-back-link">
          ← {t("materialBackList")}
        </Link>
      </div>

      {loading && <p className="student-state-msg">{t("studentLoading")}</p>}
      {error   && <p className="student-state-msg student-state-error">{error}</p>}

      {!loading && !error && material && (
        <article className="material-detail">
          <div className="material-detail-meta">
            {material.language && (
              <span className="material-detail-lang">{material.language.name}</span>
            )}
            {material.student_level && (
              <span className="student-level-badge">{material.student_level}</span>
            )}
            {material.is_opensource && (
              <span className="comp-material-open-badge">🌐 {t("materialOpenBadge")}</span>
            )}
          </div>

          <h2 className="material-detail-title">{material.title || material.name}</h2>

          {material.module && (
            <p className="comp-material-module-label">📁 {material.module.name}</p>
          )}

          {material.content ? (
            <div className="material-detail-content">
              {material.content.split("\n").map((line, i) =>
                line.trim() ? <p key={i}>{line}</p> : <br key={i} />
              )}
            </div>
          ) : (
            <p className="student-state-msg">{t("materialNoContent")}</p>
          )}

          {material.attachments?.length > 0 && (
            <div className="material-detail-attachments">
              <h4 className="material-detail-attachments-title">{t("materialAttachments")}</h4>
              <ul className="student-attachments">
                {material.attachments.map((att) => (
                  <li key={att.id}>
                    <a href={att.url} target="_blank" rel="noreferrer">
                      📎 {att.original_name}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </article>
      )}
    </div>
  );
}
