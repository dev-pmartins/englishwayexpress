import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useStudentLanguages } from "../../hooks/useStudentLanguages";

const LANGUAGES = [
  { code: "en", flag: "🇬🇧" },
  { code: "es", flag: "🇪🇸" },
  { code: "de", flag: "🇩🇪" },
  { code: "fr", flag: "🇫🇷" },
  { code: "it", flag: "🇮🇹" },
];

export default function StudentLanguageModal({ onClose, onConfirm, onSkip }) {
  const { t } = useTranslation();
  const { languages, saveLanguages } = useStudentLanguages();
  const [selected, setSelected] = useState(languages);
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.focus();
    const handleKey = (e) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleKey);
    return () => document.removeEventListener("keydown", handleKey);
  }, [onClose]);

  const toggle = (code) => {
    setSelected((prev) =>
      prev.includes(code) ? prev.filter((c) => c !== code) : [...prev, code]
    );
  };

  const handleConfirm = () => {
    saveLanguages(selected);
    onConfirm();
  };

  return (
    <div
      className="lang-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lang-modal-title"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="lang-modal-box" ref={dialogRef} tabIndex={-1}>
        <button
          className="lang-modal-close"
          onClick={onClose}
          aria-label={t("modalClose")}
        >
          ×
        </button>

        <h2 id="lang-modal-title" className="lang-modal-title">
          {t("studentLangModalTitle")}
        </h2>
        <p className="lang-modal-subtitle">{t("studentLangModalSubtitle")}</p>

        <ul className="lang-modal-list">
          {LANGUAGES.map((lang) => {
            const checked = selected.includes(lang.code);
            return (
              <li key={lang.code}>
                <label className={`lang-modal-option${checked ? " checked" : ""}`}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(lang.code)}
                  />
                  <span className="lang-modal-flag" aria-hidden="true">{lang.flag}</span>
                  <span className="lang-modal-name">{t(`lang.${lang.code}`)}</span>
                </label>
              </li>
            );
          })}
        </ul>

        <div className="lang-modal-actions">
          <button className="lang-modal-confirm" onClick={handleConfirm}>
            {t("studentLangModalConfirm")}
          </button>
          <button className="lang-modal-skip" onClick={onSkip}>
            {t("studentLangModalSkip")}
          </button>
        </div>
      </div>
    </div>
  );
}
