import { useEffect, useState } from "react";

import slideCursos from "../../slide_1_cursos_de_idiomas.webp";
import slideConsultoria from "../../slide_2_consultoria.webp";
import slideCoaching from "../../slide_3_coaching.webp";

const slides = [
  {
    title: "CURSOS DE IDIOMAS CORPORATIVOS & INDIVIDUAIS",
    content:
      "Soluções personalizadas de acordo com as metas e objetivos de cada cliente, seja uma empresa ou aluno/a individual!",
    kind: "courses",
    image: slideCursos,
    link: "/servicos/cursos-de-idiomas-corporativos-e-individuais"
  },
  {
    title: "CONSULTORIA",
    content:
      "Soluções práticas, rápidas e efetivas no suporte, preparação e execução de diversos projetos e serviços para a sua empresa e/ou carreira.",
    kind: "consulting",
    image: slideConsultoria,
    link: "/servicos/consultoria"
  },
  {
    title: "COACHING",
    content:
      "Suporte, acompanhamento e apoio linguístico individual e para pequenos grupos.",
    kind: "coaching",
    image: slideCoaching,
    link: "/servicos/coaching"
  }
];

function HomeCarousel() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 4600);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="home-carousel-wrap" aria-label="Destaques de servicos">
      <div className="home-carousel-bleed">
        <div className="home-carousel-shell">
          {slides.map((slide, index) => (
            <article
              key={slide.title}
              className={`carousel-slide ${slide.kind} ${
                index === activeIndex ? "active" : ""
              }`}
              aria-hidden={index !== activeIndex}
              style={{
                backgroundImage: `linear-gradient(102deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.18)), url(${slide.image})`
              }}
            >
              <div className="container carousel-content-boundary">
                <div className="carousel-overlay">
                  <div className="carousel-dots" role="tablist" aria-label="Selecionar slide">
                    {slides.map((dotSlide, dotIndex) => (
                      <button
                        key={`dot-${dotSlide.title}`}
                        type="button"
                        role="tab"
                        aria-selected={dotIndex === activeIndex}
                        aria-label={`Slide ${dotIndex + 1}: ${dotSlide.title}`}
                        className={dotIndex === activeIndex ? "active" : ""}
                        onClick={() => setActiveIndex(dotIndex)}
                      />
                    ))}
                  </div>
                  <h2>{slide.title}</h2>
                  <p>{slide.content}</p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export default HomeCarousel;
