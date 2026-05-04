import { Link } from "react-router-dom";

const highlightedServices = [
  {
    title: "Cursos de Idiomas In Company & Residence",
    description:
      "Programas personalizados para equipes e profissionais com foco em fluencia aplicada ao dia a dia de trabalho.",
    path: "/servicos/cursos-de-idiomas-in-company"
  },
  {
    title: "Coaching",
    description:
      "Acompanhamento linguistico individual e para pequenos grupos, com objetivos claros e evolucao mensuravel.",
    path: "/servicos/coaching"
  },
  {
    title: "Consultoria",
    description:
      "Suporte pratico para reunioes, eventos, materiais e processos estrategicos em multiplos segmentos de negocio.",
    path: "/servicos/consultoria"
  }
];

const featuredClients = [
  "IBM",
  "Microsoft",
  "Ford do Brasil",
  "Deloitte",
  "Nestle",
  "Coca-Cola",
  "Citibank",
  "Grupo Vale"
];

function HomePageSections() {
  const whatsappNumber = "5511999584492";

  return (
    <div className="home-sections">
      <section className="home-intro" id="home-intro">
        <h1>Excelencia em idiomas para crescimento profissional e corporativo</h1>
        <p>
          A English Way Express desenvolve solucoes linguisticas sob medida para
          empresas e profissionais que precisam comunicar com precisao,
          seguranca e performance em cenarios reais.
        </p>
      </section>

      <section className="home-services" id="servicos-principais">
        <h2 className="section-title">Servicos principais</h2>
        <div className="home-service-grid">
          {highlightedServices.map((service) => (
            <article key={service.path} className="home-service-card">
              <h3>{service.title}</h3>
              <p>{service.description}</p>
              <Link to={service.path}>Conhecer servico</Link>
            </article>
          ))}
        </div>
      </section>

      <section className="home-clients" id="principais-clientes">
        <h2 className="section-title">Principais clientes</h2>
        <p>
          Construimos parcerias de longo prazo com empresas de grande porte em
          diferentes setores da economia.
        </p>
        <ul className="home-clients-list">
          {featuredClients.map((client) => (
            <li key={client}>{client}</li>
          ))}
        </ul>
      </section>

      <section className="home-contact-cta" id="entre-em-contato">
        <div>
          <h2>Entre em contato conosco</h2>
          <p>
            Fale com nossa equipe para desenhar um plano ideal para sua empresa
            ou para sua evolucao individual.
          </p>
        </div>
        <div className="home-contact-actions">
          <Link className="home-primary-cta" to="/fale-conosco">
            Ir para formulario de contato
          </Link>
          <a
            className="home-whatsapp-cta"
            href={`https://wa.me/${whatsappNumber}?text=Ola%2C+gostaria+de+mais+informacoes+sobre+os+servicos+da+English+Way+Express.`}
            target="_blank"
            rel="noreferrer"
          >
            Falar no WhatsApp
          </a>
        </div>
      </section>
    </div>
  );
}

export default HomePageSections;
