import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { legacyContent } from "./content/legacyContent";
import Layout from "./components/Layout";
import LegacyMarkdown from "./components/LegacyMarkdown";
import LeadForm from "./components/LeadForm";
import HomeCarousel from "./components/HomeCarousel";
import HomePageSections from "./components/HomePageSections";

const normalizePath = (path) => {
  const normalized = `/${path}`.replace(/\/+/g, "/").replace(/\/+$/, "");
  return normalized || "/";
};

const servicesPaths = [
  "/servicos/cursos-de-idiomas-in-company",
  "/servicos/consultoria",
  "/servicos/coaching",
  "/servicos/traducao-interprete",
  "/servicos/intercambio",
  "/servicos/preparacao-para-exames-diversos-e-certificacoes-internacionais"
];

function ServicesHub() {
  const { t } = useTranslation();

  return (
    <article>
      <h1>{t("servicesHubTitle")}</h1>
      <p>{t("servicesHubSubtitle")}</p>
      <ul>
        {servicesPaths.map((path) => {
          const page = legacyContent.pageMap.get(path);
          if (!page) {
            return null;
          }

          return (
            <li key={path}>
              <Link to={path}>{page.title}</Link>
            </li>
          );
        })}
      </ul>
    </article>
  );
}

function NotFound() {
  const { t } = useTranslation();

  return (
    <article>
      <h1>{t("pageNotFound")}</h1>
      <p>{t("pageNotFoundHint")}</p>
      <Link to="/">{t("backToHome")}</Link>
    </article>
  );
}

function LegacyPage({ page }) {
  const { t, i18n } = useTranslation();

  return (
    <article>
      <h1>{page.title}</h1>
      {i18n.language !== "pt-BR" ? <p className="locale-note">{t("contentNotice")}</p> : null}
      <LegacyMarkdown markdown={page.body} />
      {page.path === "/fale-conosco" ? <LeadForm source="fale-conosco" /> : null}
      {page.path === "/trabalhe-conosco" ? <LeadForm source="trabalhe-conosco" /> : null}
    </article>
  );
}

function HomePage() {
  return <HomePageSections />;
}

function App() {
  const location = useLocation();
  const path = normalizePath(location.pathname);

  const page = legacyContent.pageMap.get(path);

  let content = <NotFound />;

  if (path === "/") {
    content = <HomePage />;
  } else if (page) {
    content = <LegacyPage page={page} />;
  } else if (path === "/servicos") {
    content = <ServicesHub />;
  } else if (path === "/area-do-aluno/english") {
    const studentPage = legacyContent.pageMap.get("/area-do-aluno");
    content = studentPage ? <LegacyPage page={studentPage} /> : <NotFound />;
  }

  const preContent = path === "/" ? <HomeCarousel /> : null;

  return <Layout preContent={preContent}>{content}</Layout>;
}

export default App;
