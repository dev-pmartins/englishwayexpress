import { useTranslation } from "react-i18next";
import { useStudentLanguages } from "../../hooks/useStudentLanguages";

const ALL_CODES = ["en", "es", "de", "fr", "it"];

const LANG_META = {
  en: { flag: "🇬🇧" },
  es: { flag: "🇪🇸" },
  de: { flag: "🇩🇪" },
  fr: { flag: "🇫🇷" },
  it: { flag: "🇮🇹" },
};

export default function StudentLanguageFilter() {
  const { t } = useTranslation();
  const { languages, saveLanguages } = useStudentLanguages();

  // [] means "all selected" — treat every language as active
  const isActive = (code) => languages.length === 0 || languages.includes(code);

  const toggle = (code) => {
    if (languages.length === 0) {
      // All selected — deselecting one means "all except this"
      saveLanguages(ALL_CODES.filter((c) => c !== code));
    } else if (languages.includes(code)) {
      const next = languages.filter((c) => c !== code);
      // If last one deselected, revert to "all"
      saveLanguages(next.length > 0 ? next : []);
    } else {
      const next = [...languages, code];
      // If all are now selected, normalize to []
      saveLanguages(next.length === ALL_CODES.length ? [] : next);
    }
  };

  return (
    <div className="student-lang-filter">
      <span className="student-lang-filter-label">{t("studentFilterLabel")}</span>
      <div className="student-lang-filter-buttons">
        {ALL_CODES.map((code) => (
          <button
            key={code}
            type="button"
            className={`student-lang-filter-btn${isActive(code) ? " active" : ""}`}
            onClick={() => toggle(code)}
            aria-pressed={isActive(code)}
          >
            <span aria-hidden="true">{LANG_META[code].flag}</span>
            <span className="student-lang-filter-name">{t(`lang.${code}`)}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
