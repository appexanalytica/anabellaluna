import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import { CardLine } from "../../../../../components/motion/hooks";

/**
 * Las tres puertas de entrada al sitio. Las entradas de scroll y el hover los manejan
 * useReveals y useCardHover a partir de los atributos data-card (ver components/motion).
 */
const ACCIONES = [
  {
    label: "Comprar",
    img: "assets/img/home/city/property-img-1.jpg",
    ruta: all_routes.buyPropertyGrid,
    arrow: "arrow buy-arrow d-flex align-items-center justify-content-center bg-error rounded-circle",
    extra: "mb-lg-0 mb-md-0 mb-4",
  },
  {
    label: "Vender",
    img: "assets/img/home/city/property-img-2.jpg",
    ruta: all_routes.contactUs,
    arrow: "arrow sell-arrow d-flex align-items-center justify-content-center bg-warning rounded-circle",
    extra: "mb-lg-0 mb-4",
  },
  {
    label: "Alquilar",
    img: "assets/img/home/city/property-img-3.jpg",
    ruta: all_routes.rentPropertyGrid,
    arrow: "arrow rent-arrow d-flex align-items-center justify-content-center bg-info rounded-circle",
    extra: "mb-0",
  },
];

const BuySection = () => {
  return (
    <>
      {/* start buy section */}
      <section className="buy-property-section section-padding pb-0">
        <div className="container">
          <div className="row justify-content-center">
            {ACCIONES.map((accion) => (
              <div className="col-lg-4 col-md-6" key={accion.label}>
                <div className={`buy-property-item text-center ${accion.extra}`} data-card>
                  <div className="img-card overflow-hidden text-center" data-card-media>
                    <Link to={accion.ruta}>
                      <ImageWithBasePath src={accion.img} alt={accion.label} />
                    </Link>
                  </div>
                  <div
                    className="buy-property bg-white d-flex align-items-center justify-content-between"
                    data-card-text
                  >
                    <h6 className="mb-0">
                      <Link to={accion.ruta} className="d-inline-block">
                        {accion.label}
                        <CardLine />
                      </Link>
                    </h6>
                    <Link to={accion.ruta} className={accion.arrow}>
                      <i className="fa-solid fa-arrow-right" data-card-arrow />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
      {/* end buy section */}
    </>
  );
};

export default BuySection;
