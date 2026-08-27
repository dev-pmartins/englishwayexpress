import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StudentLanguageModal from "./student/StudentLanguageModal";

import { legacyContent } from "../content/legacyContent";
import { useStudentAuth } from "../contexts/StudentAuthContext";

const localeOptions = [
  { code: "en-US", label: "US English", flag: "🇺🇸" },
  { code: "en-GB", label: "UK English", flag: "🇬🇧" },
  { code: "es-ES", label: "Espanol", flag: "🇪🇸" },
  { code: "fr-FR", label: "Francais", flag: "🇫🇷" },
  { code: "it-IT", label: "Italiano", flag: "🇮🇹" },
  { code: "de-DE", label: "Deutsch", flag: "🇩🇪" },
  { code: "pt-BR", label: "Portugues", flag: "🇧🇷" }
];

const LS_KEY = "ewe_student_languages";

const hasLanguagePreference = () => {
  const val = localStorage.getItem(LS_KEY);
  if (val === null) return false;
  try {
    const parsed = JSON.parse(val);
    return Array.isArray(parsed);
  } catch {
    return false;
  }
};

const normalizePath = (path) => {
  const normalized = path.replace(/\/+$/, "");
  return normalized || "/";
};

const isMobileNavigation = () => window.matchMedia("(max-width: 900px)").matches;

function Layout({ children, preContent, hideSidebar = false, sidebarContent }) {
  const { t, i18n } = useTranslation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [expandedMenuPath, setExpandedMenuPath] = useState(null);
  const [isLangModalOpen, setIsLangModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated } = useStudentAuth();

  const currentPath = normalizePath(location.pathname);

  useEffect(() => {
    setIsMenuOpen(false);
    setExpandedMenuPath(null);
  }, [currentPath]);

  return (
    <div className="app-shell">
      <header className="top-header">
        <div className="container header-row">
          <div className="brand-row">
            <Link to="/" className="brand-link" aria-label={t("brand")}>
              <img src="/logo-englishwayexpress.png" alt={t("brand")} />
            </Link>

            <div className="mobile-menu-row">
              <button
                type="button"
                className="menu-toggle menu-toggle--header"
                aria-expanded={isMenuOpen}
                aria-controls="primary-navigation"
                aria-label={isMenuOpen ? t("menuClose") : t("menuOpen")}
                onClick={() => setIsMenuOpen((open) => !open)}
              >
                <span className="menu-toggle-icon" aria-hidden="true">
                  {isMenuOpen ? "×" : "☰"}
                </span>
              </button>
            </div>
          </div>

          <div className="header-actions">
            <Link
              to={isAuthenticated ? "/area-do-aluno" : "/area-do-aluno/login"}
              className="portal-btn"
            >
              {t("portalBtn")}
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
              <label className="lang-select-wrap">
                <span className="sr-only">{t("language")}</span>
                <select
                  className="lang-select"
                  value={i18n.language}
                  onChange={(event) => i18n.changeLanguage(event.target.value)}
                  aria-label={t("language")}
                >
                  {localeOptions.map((locale) => (
                    <option key={locale.code} value={locale.code}>
                      {locale.flag} {locale.label}
                    </option>
                  ))}
                </select>
              </label>
            </div>
          </div>
        </div>
      </header>

      <nav className="main-nav">
        <div className="container nav-header">
          <button
            type="button"
            className="menu-toggle menu-toggle--nav"
            aria-expanded={isMenuOpen}
            aria-controls="primary-navigation"
            aria-label={isMenuOpen ? t("menuClose") : t("menuOpen")}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            <span className="menu-toggle-icon" aria-hidden="true">
              {isMenuOpen ? "×" : "☰"}
            </span>
          </button>
        </div>

        <ul id="primary-navigation" className={`nav-list ${isMenuOpen ? "open" : ""}`}>
          {legacyContent.navItems.map((item) => {
            const itemPath = normalizePath(item.path);
            const hasChildren = item.children.length > 0;
            const isExpanded = expandedMenuPath === itemPath;
            const submenuId = `submenu-${itemPath.replaceAll("/", "-") || "home"}`;

            return (
            <li
              key={item.path}
              className={[
                currentPath === itemPath ? "active" : "",
                isExpanded ? "nav-item--expanded" : ""
              ].filter(Boolean).join(" ")}
            >
              <div className="nav-item-row">
              {normalizePath(item.path) === "/area-do-aluno" ? (
                <button
                  type="button"
                  className="nav-area-trigger"
                  aria-expanded={hasChildren ? isExpanded : undefined}
                  aria-controls={hasChildren ? submenuId : undefined}
                  onClick={() => {
                    if (hasChildren && isMobileNavigation()) {
                      setExpandedMenuPath(isExpanded ? null : itemPath);
                      return;
                    }

                    setIsMenuOpen(false);
                    if (hasLanguagePreference()) {
                      navigate("/area-do-aluno");
                    } else {
                      setIsLangModalOpen(true);
                    }
                  }}
                >
                  {item.label}
                </button>
              ) : (
                <Link
                  to={itemPath}
                  aria-expanded={hasChildren ? isExpanded : undefined}
                  aria-controls={hasChildren ? submenuId : undefined}
                  onClick={(event) => {
                    if (hasChildren && isMobileNavigation()) {
                      event.preventDefault();
                      setExpandedMenuPath(isExpanded ? null : itemPath);
                      return;
                    }

                    setIsMenuOpen(false);
                  }}
                >
                  {item.label}
                </Link>
              )}
              {hasChildren ? (
                <button
                  type="button"
                  className="sub-nav-toggle"
                  aria-expanded={isExpanded}
                  aria-controls={submenuId}
                  aria-label={`${isExpanded ? "Recolher" : "Expandir"} ${item.label}`}
                  onClick={() => setExpandedMenuPath(isExpanded ? null : itemPath)}
                >
                  <span aria-hidden="true">⌄</span>
                </button>
              ) : null}
              </div>
              {hasChildren ? (
                <ul
                  id={submenuId}
                  className="sub-nav"
                >
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
            );
          })}
        </ul>
      </nav>

      {preContent}

      <div className={`container ${(hideSidebar && !sidebarContent) ? "content-layout--full" : `content-layout ${preContent ? "content-layout--overlap" : ""}`}`}>
        {(!hideSidebar || sidebarContent) && (
          <aside
            className={`site-sidebar ${sidebarContent ? "site-sidebar--contextual" : ""}`}
            aria-label="Links rapidos"
          >
            {sidebarContent ? sidebarContent : (
              <>
                <nav className="sidebar-section" aria-label={t("footerServices")}>
                  <h4>{t("footerServices")}</h4>
                  <ul>
                    {legacyContent.serviceLinks.map((link) => (
                      <li key={`sidebar-svc-${link.url}`}>
                        {link.url.startsWith("http") ? (
                          <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
                        ) : (
                          <Link to={link.url}>{link.label}</Link>
                        )}
                      </li>
                    ))}
                  </ul>
                </nav>
                <nav className="sidebar-section" aria-label={t("footerLinks")}>
                  <h4>{t("footerLinks")}</h4>
                  <ul>
                    {legacyContent.usefulLinks.map((link) => (
                      <li key={`sidebar-lnk-${link.url}`}>
                        <a href={link.url} target="_blank" rel="noreferrer">{link.label}</a>
                      </li>
                    ))}
                  </ul>
                </nav>
              </>
            )}
          </aside>
        )}

        <main className="page-content">
          {children}
        </main>
      </div>

      <a
        className="whatsapp-fab"
        href={`https://wa.me/5511999584492?text=${t("home.whatsappMessage", "Olá, gostaria de me tornar um aluno da English Way Express.")}`}
        target="_blank"
        rel="noreferrer"
        aria-label="WhatsApp"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          aria-hidden="true"
          focusable="false"
        >
          <path
            fill="currentColor"
            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 1.75.46 3.45 1.32 4.95L2.05 22l5.25-1.38c1.45.79 3.08 1.21 4.74 1.21 5.46 0 9.91-4.45 9.91-9.91 0-2.65-1.03-5.14-2.9-7.01A9.816 9.816 0 0 0 12.04 2zm.01 1.67c2.2 0 4.27.86 5.82 2.41a8.22 8.22 0 0 1 2.41 5.83c0 4.54-3.7 8.23-8.24 8.23-1.48 0-2.93-.4-4.19-1.15l-.3-.18-3.12.82.83-3.04-.2-.32a8.18 8.18 0 0 1-1.26-4.36c.01-4.54 3.7-8.24 8.25-8.24zm-2.84 4.46c-.18 0-.46.07-.7.34-.24.27-.91.89-.91 2.17s.93 2.52 1.06 2.69c.13.18 1.82 2.78 4.41 3.79.62.27 1.1.43 1.47.55.62.2 1.18.17 1.63.1.5-.07 1.53-.62 1.75-1.23.22-.6.22-1.12.15-1.23-.06-.1-.24-.16-.5-.29-.27-.13-1.58-.78-1.82-.87-.25-.09-.43-.13-.61.13-.18.26-.7.87-.85 1.05-.16.18-.31.2-.58.07-.27-.13-1.13-.42-2.15-1.33-.8-.71-1.34-1.58-1.49-1.85-.16-.26-.02-.4.12-.53.12-.12.27-.31.4-.47.14-.16.18-.27.27-.45.09-.18.05-.34-.02-.47-.07-.14-.61-1.47-.83-2.01-.22-.53-.44-.46-.61-.47-.16-.01-.34-.01-.52-.01z"
          />
        </svg>
      </a>

      <footer className="footer">
        <div className="container footer-grid">
          <section>
            <h4>{t("footerSiteMap")}</h4>
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
            <h4>{t("footerServices")}</h4>
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
            Copyright © 2013 - {new Date().getFullYear()} English Way Express. {t("footerCopyright")}.
          </p>
        </div>
      </footer>

      {isLangModalOpen && (
        <StudentLanguageModal
          onClose={() => setIsLangModalOpen(false)}
          onConfirm={() => { setIsLangModalOpen(false); navigate("/area-do-aluno"); }}
          onSkip={() => { setIsLangModalOpen(false); navigate("/area-do-aluno"); }}
        />
      )}
    </div>
  );
}

export default Layout;
