import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

const FLAG_MAP = { en: "🇬🇧", es: "🇪🇸", de: "🇩🇪", fr: "🇫🇷", it: "🇮🇹", "pt-BR": "🇧🇷" };

function languageLabel(t, language) {
  if (!language) return "";
  return t(`lang.${language.code}`, { defaultValue: language.name });
}

function flagFor(code = "") {
  return FLAG_MAP[code] ?? FLAG_MAP[code.split("-")[0]] ?? "🌐";
}

export default function PostsLangModal({ translations, onClose }) {
  const { t } = useTranslation();
  const dialogRef = useRef(null);

  useEffect(() => {
    dialogRef.current?.focus();
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [onClose]);

  return (
    <div
      className="lang-modal-overlay"
      role="dialog"
      aria-modal="true"
      aria-labelledby="posts-lang-modal-title"
      onClick={(event) => {
        if (event.target === event.currentTarget) onClose();
      }}
    >
      <div className="lang-modal-box" ref={dialogRef} tabIndex={-1}>
        <button
          type="button"
          className="lang-modal-close"
          onClick={onClose}
          aria-label={t("modalClose")}
        >
          ×
        </button>

        <h2 id="posts-lang-modal-title" className="lang-modal-title">
          {t("postsChooseLang")}
        </h2>
        <p className="lang-modal-subtitle">{t("postsChooseLangHint")}</p>

        <ul className="lang-modal-list">
          {translations.map((tr) => (
            <li key={tr.slug}>
              <Link
                to={`/noticias/${tr.slug}`}
                className="lang-modal-option posts-lang-modal-option"
                onClick={onClose}
              >
                <span className="lang-modal-flag" aria-hidden="true">
                  {flagFor(tr.language?.code)}
                </span>
                <span className="lang-modal-name">{languageLabel(t, tr.language)}</span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
