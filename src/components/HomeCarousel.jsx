import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";

import slideCursos from "../../slide_1_cursos_de_idiomas.webp";
import slideConsultoria from "../../slide_2_consultoria.webp";
import slideCoaching from "../../slide_3_coaching.webp";
import slideBlackFriday from "../../slide_4_blackfriday.png";

const slides = [
  {
    translationKey: "blackfriday",
    kind: "blackfriday",
    image: slideBlackFriday,
    link: "https://www.englishwayexpress.com.br/area-do-aluno/pt/a-black-friday-da-english-way"
  },
  {
    translationKey: "courses",
    kind: "courses",
    image: slideCursos,
    link: "/servicos/cursos-de-idiomas-corporativos-e-individuais"
  },
  {
    translationKey: "consulting",
    kind: "consulting",
    image: slideConsultoria,
    link: "/servicos/consultoria"
  },
  {
    translationKey: "coaching",
    kind: "coaching",
    image: slideCoaching,
    link: "/servicos/coaching"
  }
];

function HomeCarousel() {
  const { t } = useTranslation();
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  return (
    <section className="home-carousel-wrap" aria-label={t("home.carousel.label")}>
      <div className="home-carousel-bleed">
        <div className="home-carousel-shell">
          {slides.map((slide, index) => {
            const title = t(`home.carousel.slides.${slide.translationKey}.title`);

            return (
              <article
                key={slide.translationKey}
                className={`carousel-slide ${slide.kind} ${
                  index === activeIndex ? "active" : ""
                }`}
                aria-hidden={index !== activeIndex}
                style={{
                  backgroundImage: `linear-gradient(102deg, rgba(0, 0, 0, 0.42), rgba(0, 0, 0, 0.18)), url(${slide.image})`
                }}
              >
                {/^https?:\/\//i.test(slide.link) ? (
                  <a
                    className="carousel-slide-link"
                    href={slide.link}
                    tabIndex={index === activeIndex ? 0 : -1}
                    aria-label={title}
                  />
                ) : (
                  <Link
                    className="carousel-slide-link"
                    to={slide.link}
                    tabIndex={index === activeIndex ? 0 : -1}
                    aria-label={title}
                  />
                )}
                <div className="container carousel-content-boundary">
                  <div className="carousel-overlay">
                    <div className="carousel-dots" role="tablist" aria-label={t("home.carousel.selectLabel")}>
                      {slides.map((dotSlide, dotIndex) => (
                        <button
                          key={`dot-${dotSlide.translationKey}`}
                          type="button"
                          role="tab"
                          tabIndex={index === activeIndex && dotIndex === activeIndex ? 0 : -1}
                          aria-selected={dotIndex === activeIndex}
                          aria-label={t("home.carousel.slideLabel", {
                            number: dotIndex + 1,
                            title: t(`home.carousel.slides.${dotSlide.translationKey}.title`)
                          })}
                          className={dotIndex === activeIndex ? "active" : ""}
                          onClick={() => setActiveIndex(dotIndex)}
                        />
                      ))}
                    </div>
                    <h2>{title}</h2>
                    <p>{t(`home.carousel.slides.${slide.translationKey}.content`)}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default HomeCarousel;
