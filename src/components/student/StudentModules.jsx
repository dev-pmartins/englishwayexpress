import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStudentAuth } from "../../contexts/StudentAuthContext";

const API_BASE = import.meta.env.VITE_API_URL ?? "";

export default function StudentModules() {
  const { t } = useTranslation();
  const { token, user, logout } = useStudentAuth();

  const [groups, setGroups]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError]     = useState("");
  const [openMaterial, setOpenMaterial] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`${API_BASE}/api/student/modules`, {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((body) => { if (!cancelled) { setGroups(body.data ?? []); setLoading(false); } })
      .catch(() => { if (!cancelled) { setError(t("studentLoadError")); setLoading(false); } });
    return () => { cancelled = true; };
  }, [token, t]);

  if (loading) {
    return <p className="student-state-msg">{t("studentLoading")}</p>;
  }

  if (error) {
    return <p className="student-state-msg student-state-error">{error}</p>;
  }

  return (
    <div className="student-area">
      <div className="student-header">
        <div>
          <h2 className="section-title section-title-small">{t("studentWelcome", { name: user?.name?.split(" ")[0] })}</h2>
          <p className="student-subtitle">{t("studentSubtitle")}</p>
        </div>
        <button className="student-logout-btn" onClick={logout}>
          {t("studentLogout")}
        </button>
      </div>

      {groups.length === 0 ? (
        <p className="student-state-msg">{t("studentNoModules")}</p>
      ) : (
        groups.map((group) => (
          <section key={group.language.id} className="student-language-group">
            <h3 className="student-language-title">
              {group.language.name}
              <span className="student-level-badge">{group.student_level}</span>
            </h3>

            {group.modules.map((mod) => (
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
                                {mat.content.split("\n").map((line, i) => (
                                  <p key={i}>{line}</p>
                                ))}
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
                          </div>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </section>
        ))
      )}
    </div>
  );
}
