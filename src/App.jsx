import { Link, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { legacyContent } from "./content/legacyContent";
import Layout from "./components/Layout";
import LegacyMarkdown from "./components/LegacyMarkdown";
import LeadForm from "./components/LeadForm";
import HomeCarousel from "./components/HomeCarousel";
import HomePageSections from "./components/HomePageSections";
import StudentArea from "./components/student/StudentArea";
import StudentLoginPage from "./components/student/StudentLoginPage";
import PostsPage from "./components/posts/PostsPage";
import PostDetailPage from "./components/posts/PostDetailPage";
import LanguagesPage from "./components/languages/LanguagesPage";
import LevelsPage from "./components/levels/LevelsPage";
import ModulesPage from "./components/modules/ModulesPage";
import MaterialsPage from "./components/materials/MaterialsPage";

const normalizePath = (path) => {
  const normalized = `/${path}`.replace(/\/+/g, "/").replace(/\/+$/, "");
  return normalized || "/";
};

const servicesPaths = [
  {
    title: "Cursos de Idiomas Online & Presenciais",
    alt: "Cursos de Idiomas Online & Presenciais",
    link: "/servicos/cursos-de-idiomas-corporativos-e-individuais"
  },
  {
    title: "Consultoria",
    alt: "Consultoria",
    link: "/servicos/consultoria"
  },
  {
    title: "Coaching",
    alt: "Coaching",
    link: "/servicos/coaching"
  },
  {
    title: "Tradução de Materiais Diversos (Inclusive Técnicos)",
    alt: "Tradução de Materiais Diversos (Inclusive Técnicos)",
    link: "/servicos/traducao-de-materiais"
  },
  {
    title: "Tradução & Interpretação Simultânea",
    alt: "Tradução & Interpretação Simultânea",
    link: "/servicos/traducao-interprete"
  },
  {
    title: "Intercâmbio",
    alt: "Intercâmbio",
    link: "/servicos/intercambio"
  },
  {
    title: "Preparação para exames diversos e certificações internacionais",
    alt: "Preparação para exames diversos e certificações internacionais",
    link: "/servicos/preparacao-para-exames-diversos-e-certificacoes-internacionais"
  }
];

function ServicesHub() {
  const { t } = useTranslation();

  return (
    <article>
      <h1>{t("servicesHubTitle")}</h1>
      <p>{t("servicesHubSubtitle")}</p>
      <ul>
        {servicesPaths.map((servicePath) => {
          return (
            <li key={servicePath.link}>
              <Link to={servicePath.link}>{servicePath.title}</Link>
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

  const isStudentArea  = path === "/area-do-aluno" || path.startsWith("/area-do-aluno/");
  const isStudentLogin = path === "/area-do-aluno/login";
  const postsSlugMatch = path.match(/^\/noticias\/([^/]+)$/);

  let content = <NotFound />;

  if (path === "/") {
    content = <HomePage />;
  } else if (isStudentLogin) {
    content = <StudentLoginPage />;
  } else if (isStudentArea) {
    content = <StudentArea />;
  } else if (postsSlugMatch) {
    content = <PostDetailPage slug={postsSlugMatch[1]} />;
  } else if (path === "/noticias") {
    content = <PostsPage />;
  } else if (path === "/idiomas") {
    content = <LanguagesPage />;
  } else if (path === "/niveis") {
    content = <LevelsPage />;
  } else if (path === "/modulos") {
    content = <ModulesPage />;
  } else if (path === "/materiais") {
    content = <MaterialsPage />;
  } else if (page) {
    content = <LegacyPage page={page} />;
  } else if (path === "/servicos") {
    content = <ServicesHub />;
  }

  const preContent = path === "/" ? <HomeCarousel /> : null;

  const renderedPreContent = preContent ? (
    <div key={`hero-${path}`} className="route-stage route-stage-hero">
      {preContent}
    </div>
  ) : null;

  const renderedContent = (
    <div key={path} className="route-stage route-stage-page">
      {content}
    </div>
  );

  return (
    <Layout preContent={renderedPreContent}>
      {renderedContent}
    </Layout>
  );
}

export default App;
