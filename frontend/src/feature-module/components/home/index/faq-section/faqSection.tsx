import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const FaqSection = () => {
  return (
    <>
      {/* start faq section */}
      <section className="faq-section section-padding bg-light ">
        <div className="container">
          {/* start title */}
          <div
            className="section-heading aos"
            data-aos="fade-down"
            data-aos-duration={1000}
          >
            <h2 className="mb-2 text-center">Preguntas frecuentes</h2>
            <div className="sec-line">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center">
              ¿Listo para comprar tu casa ideal? Encontrala acá.
            </p>
          </div>
          {/* end title */}
          {/* start row */}
          <div className="row">
            <div
              className="col-lg-6 aos"
              data-aos="fade-up"
              data-aos-duration={1500}
            >
              <ImageWithBasePath
                src="assets/img/home/bg/faq-img.jpg"
                alt="image"
                className="img-fluid custom-faq-img rounded"
              />
            </div>
            <div className="col-lg-6">
              <div className="card mb-0">
                <div className="card-body">
                  <div>
                    <h5 className="mb-4"> Preguntas generales </h5>
                    <div
                      className="accordion accordions-items-seperate faq-accordion m-0"
                      id="faq-accordion"
                    >
                      {/* item*/}
                      <div className="accordion-item">
                        <div
                          className="accordion-header aos"
                          data-aos="fade-down"
                          data-aos-duration={1000}
                        >
                          <button
                            className="accordion-button"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#accordion-1"
                            aria-expanded="true"
                          >
                            ¿Qué es el real estate?
                          </button>
                        </div>
                        <div
                          id="accordion-1"
                          className="accordion-collapse collapse show"
                          data-bs-parent="#faq-accordion"
                        >
                          <div className="accordion-body">
                            <p className="mb-0">
                              El real estate se refiere a la tierra y a todas las
                              construcciones permanentes sobre ella, como casas
                              o edificios.
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* item*/}
                      <div
                        className="accordion-item aos"
                        data-aos="fade-down"
                        data-aos-duration={1000}
                      >
                        <div className="accordion-header">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#accordion-2"
                            aria-expanded="false"
                          >
                            ¿Qué tipos de propiedades incluye el real estate?
                          </button>
                        </div>
                        <div
                          id="accordion-2"
                          className="accordion-collapse collapse"
                          data-bs-parent="#faq-accordion"
                        >
                          <div className="accordion-body">
                            <p className="mb-0">
                              Incluye propiedades residenciales, comerciales,
                              industriales, terrenos y propiedades de uso
                              especial.
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* item*/}
                      <div
                        className="accordion-item aos"
                        data-aos="fade-down"
                        data-aos-duration={1000}
                      >
                        <div className="accordion-header">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#accordion-3"
                            aria-expanded="false"
                          >
                            ¿Cuál es el rol de un agente inmobiliario?
                          </button>
                        </div>
                        <div
                          id="accordion-3"
                          className="accordion-collapse collapse"
                          data-bs-parent="#faq-accordion"
                        >
                          <div className="accordion-body">
                            <p className="mb-0">
                              Un agente inmobiliario ayuda a sus clientes a
                              comprar, vender o alquilar propiedades,
                              acompañándolos y asesorándolos en todo el proceso.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="mb-4 mt-4"> Preguntas sobre compra </h5>
                    <div
                      className="accordion accordions-items-seperate faq-accordion m-0"
                      id="faq-accordion1"
                    >
                      {/* item*/}
                      <div
                        className="accordion-item aos"
                        data-aos="fade-down"
                        data-aos-duration={1000}
                      >
                        <div className="accordion-header">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#accordion-4"
                            aria-expanded="true"
                          >
                            ¿Cómo empiezo el proceso para comprar una propiedad?
                          </button>
                        </div>
                        <div
                          id="accordion-4"
                          className="accordion-collapse collapse"
                          data-bs-parent="#faq-accordion1"
                        >
                          <div className="accordion-body">
                            <p className="mb-0">
                              Empezá revisando tu presupuesto, obteniendo una
                              preaprobación de crédito hipotecario y hablando con
                              un agente inmobiliario de confianza.
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* item*/}
                      <div
                        className="accordion-item aos"
                        data-aos="fade-down"
                        data-aos-duration={1000}
                      >
                        <div className="accordion-header">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#accordion-5"
                            aria-expanded="false"
                          >
                            ¿Cuánta seña o adelanto necesito?
                          </button>
                        </div>
                        <div
                          id="accordion-5"
                          className="accordion-collapse collapse"
                          data-bs-parent="#faq-accordion1"
                        >
                          <div className="accordion-body">
                            <p className="mb-0">
                              Suele ir desde el 3% hasta el 20% del valor de la
                              propiedad, según el tipo de préstamo y las
                              condiciones del banco o entidad financiera.
                            </p>
                          </div>
                        </div>
                      </div>
                      {/* item*/}
                      <div
                        className="accordion-item aos"
                        data-aos="fade-down"
                        data-aos-duration={1000}
                      >
                        <div className="accordion-header">
                          <button
                            className="accordion-button collapsed"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target="#accordion-6"
                            aria-expanded="false"
                          >
                            ¿Qué es una inspección de la propiedad?
                          </button>
                        </div>
                        <div
                          id="accordion-6"
                          className="accordion-collapse collapse"
                          data-bs-parent="#faq-accordion1"
                        >
                          <div className="accordion-body">
                            <p className="mb-0">
                              Es una evaluación profesional del estado de la
                              propiedad para detectar problemas antes de cerrar
                              la compra.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* end row */}
        </div>
      </section>
      {/* end faq section */}
    </>
  );
};

export default FaqSection;
