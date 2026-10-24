import { useState, useEffect } from "react";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import publicService from "../../../../../services/publicService";

const formatCount = (n: number) => {
  if (n >= 1000) return `${(n / 1000).toFixed(n >= 10000 ? 0 : 1)}K`;
  return String(n);
};

const StatSection = () => {
  const [stats, setStats] = useState({ properties: 0, agents: 0, sales: 0, rentals: 0 });

  useEffect(() => {
    let m = true;
    (async () => {
      try {
        const res = await publicService.getStats();
        if (m) setStats(res);
      } catch {
        // keep defaults
      }
    })();
    return () => { m = false; };
  }, []);

  // `raw` es el número real que anima el contador; `value` es el texto que ya está en el HTML
  // (puede venir abreviado, "1.2K") y que se restaura al terminar de contar.
  const items = [
    { icon: "assets/img/home/icons/stat-icon-1.svg", raw: stats.properties, value: formatCount(stats.properties), label: "Publicaciones" },
    { icon: "assets/img/home/icons/stat-icon-2.svg", raw: stats.agents, value: formatCount(stats.agents), label: "Agentes" },
    { icon: "assets/img/home/icons/stat-icon-3.svg", raw: stats.sales, value: formatCount(stats.sales), label: "En Venta" },
    { icon: "assets/img/home/icons/stat-icon-4.svg", raw: stats.rentals, value: formatCount(stats.rentals), label: "En Alquiler" },
  ];

  return (
    <>
      <section className="stat-section section-padding">
        <div className="container">
          <div className="section-heading" data-reveal-heading>
            <h2 className="mb-2 text-center" data-reveal-title>Nuestros Números</h2>
            <div className="sec-line">
              <span className="sec-line1" data-rule />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center" data-reveal-label>
              Datos reales de nuestro crecimiento y alcance.
            </p>
          </div>
          <div className="row row-gap-4">
            {items.map((item, i) => (
              <div
                key={i}
                className="col-md-6 col-lg-3"
              >
                <div className="stat-item text-center" data-card>
                  <div className="d-flex align-items-center justify-content-center">
                    <ImageWithBasePath
                      src={item.icon}
                      alt={item.label}
                      className="img-fluid me-3"
                    />
                    <div data-card-text>
                      <h3 className="mb-1" data-count={item.raw}>{item.value}</h3>
                      <p className="mb-0">{item.label}</p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default StatSection;
