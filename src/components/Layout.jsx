import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { legacyContent } from "../content/legacyContent";

const localeOptions = [
  { code: "en-US", label: "US English", flag: "🇺🇸" },
  { code: "en-GB", label: "UK English", flag: "🇬🇧" },
  { code: "es-ES", label: "Espanol", flag: "🇪🇸" },
  { code: "fr-FR", label: "Francais", flag: "🇫🇷" },
  { code: "it-IT", label: "Italiano", flag: "🇮🇹" },
  { code: "de-DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt-BR", label: "Portugues", flag: "🇧🇷" }
];

const normalizePath = (path) => {
  const normalized = path.replace(/\/+$/, "");
  return normalized || "/";
};

function Layout({ children, preContent }) {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  const currentPath = normalizePath(location.pathname);

  return (
    <div className="app-shell">
      <header className="top-header">
        <div className="container header-row">
          <Link to="/" className="brand-link" aria-label={t("brand")}>
            <img src="/logo-englishwayexpress.png" alt={t("brand")} />
          </Link>

          <div className="lang-control" aria-label={t("language")}>
            {localeOptions.map((locale) => (
              <button
                key={locale.code}
                type="button"
                className={`lang-button ${i18n.language === locale.code ? "active" : ""}`}
                onClick={() => i18n.changeLanguage(locale.code)}
                title={locale.label}
                aria-label={locale.label}
              >
                <span aria-hidden="true">{locale.flag}</span>
              </button>
            ))}
          </div>
        </div>
      </header>

      <nav className="main-nav">
        <div className="container nav-header">
          <button
            type="button"
            className="menu-toggle"
            aria-expanded={isMenuOpen}
            aria-label={isMenuOpen ? t("menuClose") : t("menuOpen")}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? "x" : "menu"}
          </button>
        </div>

        <ul className={`nav-list ${isMenuOpen ? "open" : ""}`}>
          {legacyContent.navItems.map((item) => (
            <li key={item.path} className={currentPath === normalizePath(item.path) ? "active" : ""}>
              <Link to={normalizePath(item.path)} onClick={() => setIsMenuOpen(false)}>
                {item.label}
              </Link>
              {item.children.length > 0 ? (
                <ul className="sub-nav">
                  {item.children.map((child) => (
                    <li
                      key={child.path}
                      className={
                        currentPath === normalizePath(child.path) ? "active" : ""
                      }
                    >
                      <Link
                        to={normalizePath(child.path)}
                        onClick={() => setIsMenuOpen(false)}
                      >
                        {child.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              ) : null}
            </li>
          ))}
        </ul>
      </nav>

      {preContent}

      <main
        className={`container page-content ${preContent ? "page-content-overlap" : ""}`}
      >
        {children}
      </main>

      <footer className="footer">
        <div className="container footer-grid">
          <section>
            <h4>Mapa do Site</h4>
            <ul>
              {legacyContent.sitemapLinks.map((link) => (
                <li key={`sitemap-${link.url}`}>
                  {link.url.startsWith("http") ? (
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.url}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4>Servicos</h4>
            <ul>
              {legacyContent.serviceLinks.map((link) => (
                <li key={`service-${link.url}`}>
                  {link.url.startsWith("http") ? (
                    <a href={link.url} target="_blank" rel="noreferrer">
                      {link.label}
                    </a>
                  ) : (
                    <Link to={link.url}>{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </section>

          <section>
            <h4>{t("footerLinks")}</h4>
            <ul>
              {legacyContent.usefulLinks.map((link) => (
                <li key={link.url}>
                  <a href={link.url} target="_blank" rel="noreferrer">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </section>
          <p>
            Copyright © 2013 - {new Date().getFullYear()} English Way Express. Todos os
            Direitos Reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Layout;
