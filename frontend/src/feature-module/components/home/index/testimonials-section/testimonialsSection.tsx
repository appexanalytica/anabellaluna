import Slider from "react-slick";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const TestimonialsSection = () => {
  const Testimonial_Slider = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: false,
    arrows: true,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  };
  return (
    <>
      {/* start testimonials section */}
      <section className="testimonials-section section-padding ">
        <div className="container">
          {/* start title */}
          <div
            className="section-heading aos"
            data-aos="fade-down"
            data-aos-duration={1000}
          >
            <h2 className="mb-2 text-center text-white">Testimonios</h2>
            <div className="sec-line">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center text-light">
              Lo que dicen nuestros clientes sobre el excelente servicio y la calidad humana de Anabella Luna.
            </p>
          </div>
          {/* end title */}
          <Slider
            {...Testimonial_Slider}
            className="testimonials-slider-item testimonials-slider"
          >
            <div className="testimonials-slide">
              {/* item-1*/}
              <div
                className="testimonials-item aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <div className="avatar avatar-lg mb-4">
                  <ImageWithBasePath
                    src="assets/img/users/user-02.jpg"
                    alt="user-01"
                    className="img-fluid rounded-circle"
                  />
                </div>
                <p className="mb-2">
                  
Encontrar nuestra casa soñada con Anabella Luna fue una experiencia inmejorable.
El equipo nos acompañó con una calidez humana excepcional y un servicio atento en cada detalle.

                </p>
                <h6 className="mb-2"> Lily Brooks </h6>
                <div className="d-flex align-items-center justify-content-center">
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                </div>
              </div>
            </div>
            <div className="testimonials-slide">
              {/* item-2*/}
              <div
                className="testimonials-item aos"
                data-aos="fade-up"
                data-aos-duration={1000}
              >
                <div className="avatar avatar-lg mb-4">
                  <ImageWithBasePath
                    src="assets/img/users/user-01.jpg"
                    alt="user-01"
                    className="img-fluid rounded-circle"
                  />
                </div>
                <p className="mb-2">
                  
Gracias a Anabella Luna, pudimos concretar la compra de nuestra propiedad sin estrés.
La dedicación, transparencia y calidad humana del equipo hicieron que todo el proceso fuera simple y seguro.

                </p>
                <h6 className="mb-2">Daniel Cooper </h6>
                <div className="d-flex align-items-center justify-content-center">
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                </div>
              </div>
            </div>
            <div className="testimonials-slide">
              {/* item-3*/}
              <div
                className="testimonials-item aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <div className="avatar avatar-lg mb-4">
                  <ImageWithBasePath
                    src="assets/img/users/user-03.jpg"
                    alt="user-01"
                    className="img-fluid rounded-circle"
                  />
                </div>
                <p className="mb-2">
                  
Desde la primera visita hasta la firma final, el acompañamiento de Anabella Luna fue impecable.
Se nota el compromiso humano en cada asesoría y en la búsqueda de la mejor opción para nuestra familia.

                </p>
                <h6 className="mb-2"> Karen Maria </h6>
                <div className="d-flex align-items-center justify-content-center">
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                </div>
              </div>
            </div>
            <div className="testimonials-slide">
              {/* item-4*/}
              <div
                className="testimonials-item aos"
                data-aos="fade-up"
                data-aos-duration={1000}
              >
                <div className="avatar avatar-lg mb-4">
                  <ImageWithBasePath
                    src="assets/img/users/user-04.jpg"
                    alt="user-01"
                    className="img-fluid rounded-circle"
                  />
                </div>
                <p className="mb-2">
                  
Con Anabella Luna sentimos que no éramos solo clientes, sino personas realmente escuchadas.
Su trato cercano y humano, sumado a un servicio profesional, marcaron toda la diferencia.

                </p>
                <h6 className="mb-2"> John Carter </h6>
                <div className="d-flex align-items-center justify-content-center">
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                </div>
              </div>
            </div>
            <div className="testimonials-slide">
              {/* item-5*/}
              <div
                className="testimonials-item aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <div className="avatar avatar-lg mb-4">
                  <ImageWithBasePath
                    src="assets/img/users/user-06.jpg"
                    alt="user-01"
                    className="img-fluid rounded-circle"
                  />
                </div>
                <p className="mb-2">
                  Dreams Estate hizo que reservar una casa fuera pan comido. ¡Súper fácil y
                  sin estrés! El mejor portal de listados de todos los tiempos
                </p>
                <h6 className="mb-2"> Daniel Cooper </h6>
                <div className="d-flex align-items-center justify-content-center">
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/* end partners section */}
    </>
  );
};

export default TestimonialsSection;
