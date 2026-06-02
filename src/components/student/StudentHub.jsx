import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useStudentAuth } from "../../contexts/StudentAuthContext";
import { useStudentLanguages } from "../../hooks/useStudentLanguages";

const ALL_LANGUAGES = [
  { code: "en", flag: "🇬🇧", color: "#012169", accent: "#C8102E" },
  { code: "es", flag: "🇪🇸", color: "#c60b1e", accent: "#F1BF00" },
  { code: "de", flag: "🇩🇪", color: "#222",    accent: "#FFCD00" },
  { code: "fr", flag: "🇫🇷", color: "#002395", accent: "#ED2939" },
  { code: "it", flag: "🇮🇹", color: "#009246", accent: "#CE2B37" },
];

export default function StudentHub() {
  const { t } = useTranslation();
  const { user, logout } = useStudentAuth();
  const { languages } = useStudentLanguages();

  const displayed =
    languages.length > 0
      ? ALL_LANGUAGES.filter((l) => languages.includes(l.code))
      : ALL_LANGUAGES;

  return (
    <div className="student-area">
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

      <div className="student-lang-grid">
        {displayed.map((lang) => (
          <Link
            key={lang.code}
            to={`/area-do-aluno/${lang.code}`}
            className="student-lang-card"
            style={{ "--card-color": lang.color, "--card-accent": lang.accent }}
          >
            <span className="student-lang-flag" aria-hidden="true">{lang.flag}</span>
            <span className="student-lang-name">{t(`lang.${lang.code}`)}</span>
            <span className="student-lang-cta">{t("studentHubExplore")} →</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
