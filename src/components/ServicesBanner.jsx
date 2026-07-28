import { useEffect, useState } from "react";

const fallbackBanner = "/services-banner.png";

function ServicesBanner({ src, alt }) {
  const [useFallback, setUseFallback] = useState(!src);

  useEffect(() => {
    setUseFallback(!src);
  }, [src]);

  const imageSrc = useFallback ? fallbackBanner : src;

  return (
    <section className="services-banner">
      <img
        src={imageSrc}
        alt={alt}
        width="1024"
        height="535"
        fetchPriority="high"
        onError={() => {
          if (imageSrc !== fallbackBanner) {
            setUseFallback(true);
          }
        }}
      />
    </section>
  );
}

export default ServicesBanner;
