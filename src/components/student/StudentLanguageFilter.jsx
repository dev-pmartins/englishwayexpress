import { useTranslation } from "react-i18next";
import { useStudentLanguages } from "../../hooks/useStudentLanguages";
import { publicApi } from "../../api/publicApi";
import { useEffect, useState } from "react";

const FLAG_MAP = { en: "🇬🇧", es: "🇪🇸", de: "🇩🇪", fr: "🇫🇷", it: "🇮🇹", "pt-BR": "🇧🇷" };

export default function StudentLanguageFilter() {
  const { t } = useTranslation();
  const { languages, saveLanguages } = useStudentLanguages();
  const [apiLangs, setApiLangs] = useState([]);

  useEffect(() => {
    publicApi.getLanguages()
      .then(body => setApiLangs(body.data ?? body))
      .catch(() => {});
  }, []);

  const allCodes = apiLangs.map(l => l.code);

  // [] means "all selected" — treat every language as active
  const isActive = (code) => languages.length === 0 || languages.includes(code);

  const toggle = (code) => {
    if (languages.length === 0) {
      saveLanguages(allCodes.filter((c) => c !== code));
    } else if (languages.includes(code)) {
      const next = languages.filter((c) => c !== code);
      saveLanguages(next.length > 0 ? next : []);
    } else {
      const next = [...languages, code];
      saveLanguages(next.length === allCodes.length ? [] : next);
    }
  };

  if (apiLangs.length === 0) return null;

  return (
    <div className="student-lang-filter">
      <span className="student-lang-filter-label">{t("studentFilterLabel")}</span>
      <div className="student-lang-filter-buttons">
        {apiLangs.map((lang) => (
          <button
            key={lang.code}
            type="button"
            className={`student-lang-filter-btn${isActive(lang.code) ? " active" : ""}`}
            onClick={() => toggle(lang.code)}
            aria-pressed={isActive(lang.code)}
          >
            <span aria-hidden="true">{FLAG_MAP[lang.code] ?? "🌐"}</span>
            <span className="student-lang-filter-name">{t(`lang.${lang.code}`, { defaultValue: lang.name })}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
