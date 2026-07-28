import { useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import slideCursos from "../../slide_1_cursos_de_idiomas.webp";
import slideConsultoria from "../../slide_2_consultoria.webp";
import slideCoaching from "../../slide_3_coaching.webp";

const SERVICE_IMAGES = {
  "/servicos/cursos-de-idiomas-corporativos-e-individuais": slideCursos,
  "/servicos/consultoria": slideConsultoria,
  "/servicos/coaching": slideCoaching,
};

const LOGO_DEV_PUBLIC_KEY = 'pk_E4z3_AiLTsKx66PE8t6Sng';

const featuredClients = [
  { name: "LATAM Airlines",        domain: "latam.com" },
  { name: "IBM",                   domain: "ibm.com" },
  { name: "Microsoft",             domain: "microsoft.com" },
  { name: "Ford do Brasil",        domain: "ford.com" },
  { name: "Grupo Vale",            domain: "vale.com" },
  { name: "Grupo Toyota Tsusho",   domain: "toyota-tsusho.com" },
  { name: "Michael Page Group",    domain: "michaelpage.com" },
  { name: "GFK",                   domain: "gfk.com" },
  { name: "Officer Distribuidora", domain: "officer.com.br" },
  { name: "Electrolux",            domain: "electrolux.com" },
  { name: "CESP",                  domain: "cesp.com.br" },
  { name: "EMAE",                  domain: "emae.com.br" },
  { name: "Aristek Avionics",      domain: "aristek.com" },
  { name: "Jeffrey Group",         domain: "jeffreygroup.com" },
  { name: "Deloitte",              domain: "deloitte.com" },
  { name: "Nestle",                domain: "nestle.com" },
  { name: "Coca-Cola",             domain: "coca-cola.com" },
  { name: "BrasilPrev",            domain: "brasilprev.com.br" },
  { name: "Citibank",              domain: "citibank.com" },
  { name: "Accord",                domain: "accord.com" }
];

const featuredClientsTopRow = featuredClients.filter((_, index) => index % 2 === 0);
const featuredClientsBottomRow = featuredClients.filter((_, index) => index % 2 !== 0);

function getInitials(name) {
  const words = name.split(" ").filter((w) => !/^(do|de|da|dos|das|e)$/i.test(w));
  if (words.length === 1) return words[0].slice(0, 2).toUpperCase();
  return (words[0][0] + words[1][0]).toUpperCase();
}

function ClientLogo({ name, domain, size = 48 }) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return (
      <span
        className="client-badge client-badge--initials"
        style={{ width: size, height: size }}
        aria-hidden="true"
      >
        {getInitials(name)}
      </span>
    );
  }

  return (
    <span
      className="client-badge client-badge--logo"
      style={{ width: size, height: size }}
    >
      <img
        src={`https://img.logo.dev/${domain}?token=${LOGO_DEV_PUBLIC_KEY}`}
        alt={`${name} logo`}
        width={size}
        height={size}
        onError={() => setFailed(true)}
      />
    </span>
  );
}

function HomePageSections() {
  const { t } = useTranslation();
  const whatsappNumber = "5511999584492";

  const faqItems = t("home.faqItems", { returnObjects: true });
  const serviceBlogCards = t("home.serviceBlogCards", { returnObjects: true });

  return (
    <div className="home-sections">
      <section className="home-service-blog" id="solucoes-em-detalhe">
        <h2 className="section-title">{t("home.serviceSummariesTitle")}</h2>
        <div className="service-blog-list">
          {serviceBlogCards.map((card) => {
            const image = SERVICE_IMAGES[card.path];
            return (
              <article key={card.path} className="service-blog-card">
                {image && (
                  <div className="service-blog-card__image">
                    <img src={image} alt={card.title} />
                  </div>
                )}
                <div className="service-blog-card__body">
                  <h3>{card.title}</h3>
                  <p>{card.excerpt}</p>
                  <Link to={card.path}>{t("home.serviceLearnMore")}</Link>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="home-clients" id="principais-clientes">
        <h2 className="section-title">{t("home.clientsTitle")}</h2>
        <p>{t("home.clientsText")}</p>
        <div className="clients-marquee-group" aria-label={t("home.clientsCarouselLabel")}>
          <div className="clients-marquee">
            <div className="clients-marquee-track">
              {[...featuredClientsTopRow, ...featuredClientsTopRow].map((client, i) => (
                <a
                  key={`top-${i}`}
                  className="client-card"
                  href={`https://${client.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${client.name} — ${t("home.clientVisitSite")}`}
                >
                  <ClientLogo name={client.name} domain={client.domain} size={48} />
                  <span className="client-name">{client.name}</span>
                </a>
              ))}
            </div>
          </div>
          <div className="clients-marquee clients-marquee--reverse">
            <div className="clients-marquee-track">
              {[...featuredClientsBottomRow, ...featuredClientsBottomRow].map((client, i) => (
                <a
                  key={`bottom-${i}`}
                  className="client-card"
                  href={`https://${client.domain}`}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={`${client.name} — ${t("home.clientVisitSite")}`}
                >
                  <ClientLogo name={client.name} domain={client.domain} size={48} />
                  <span className="client-name">{client.name}</span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="home-faq" id="duvidas-frequentes">
        <div className="home-faq-copy">
          <h2 className="section-title">{t("home.faqTitle")}</h2>
          <p>{t("home.faqText")}</p>
        </div>
        <div className="home-faq-list">
          {faqItems.map((item) => (
            <details key={item.question} className="home-faq-item">
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="home-contact-cta" id="entre-em-contato">
        <div>
          <h2>{t("home.contactTitle")}</h2>
          <p>{t("home.contactText")}</p>
        </div>
        <div className="home-contact-actions">
          <Link className="home-primary-cta" to="/fale-conosco">
            {t("home.contactFormLink")}
          </Link>
          <a
            className="home-whatsapp-cta"
            href={`https://wa.me/${whatsappNumber}?text=${t("home.whatsappMessage")}`}
            target="_blank"
            rel="noreferrer"
          >
            {t("home.contactWhatsapp")}
          </a>
        </div>
      </section>
    </div>
  );
}

export default HomePageSections;
