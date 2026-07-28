import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStudentAuth } from "../../contexts/StudentAuthContext";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

function AttachmentViewer({ att }) {
  const { t } = useTranslation();

  if (att.type === "image") {
    return (
      <div className="attachment-viewer attachment-viewer--image">
        <p className="attachment-viewer-label">🖼️ {att.original_name}</p>
        <img src={att.url} alt={att.original_name} className="attachment-image" />
      </div>
    );
  }

  if (att.type === "audio") {
    return (
      <div className="attachment-viewer attachment-viewer--audio">
        <p className="attachment-viewer-label">🎵 {att.original_name}</p>
        <audio controls className="attachment-audio" src={att.url}>
          <a href={att.url} download>{t("attachmentDownload")}</a>
        </audio>
      </div>
    );
  }

  if (att.type === "document") {
    const officeViewerUrl = `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(att.url)}`;
    return (
      <div className="attachment-viewer attachment-viewer--document">
        <div className="attachment-viewer-header">
          <p className="attachment-viewer-label">📊 {att.original_name}</p>
          <a href={att.url} download className="attachment-download-link">
            ⬇ {t("attachmentDownload")}
          </a>
        </div>
        <iframe
          src={officeViewerUrl}
          className="attachment-office-frame"
          title={att.original_name}
          allowFullScreen
        />
      </div>
    );
  }

  if (att.type === "video") {
    return (
      <div className="attachment-viewer attachment-viewer--video">
        <p className="attachment-viewer-label">🎬 {att.original_name}</p>
        <video controls className="attachment-video" src={att.url}>
          <a href={att.url} download>{t("attachmentDownload")}</a>
        </video>
      </div>
    );
  }

  // zip or unknown
  return (
    <div className="attachment-viewer attachment-viewer--zip">
      <a href={att.url} download className="attachment-zip-btn">
        📦 {att.original_name} — {t("attachmentDownload")}
      </a>
    </div>
  );
}

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
              <div className="attachment-list">
                {material.attachments.map((att) => (
                  <AttachmentViewer key={att.id} att={att} />
                ))}
              </div>
            </div>
          )}
        </article>
      )}
    </div>
  );
}
