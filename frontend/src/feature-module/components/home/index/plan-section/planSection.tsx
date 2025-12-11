import { Link } from "react-router";

const PlanSection = () => {
  return (
    <>
      {/* start plan section */}
      <section className="pricing-plan-section section-padding">
        <div className="container">
          {/* start row */}
          <div className="row align-items-center">
            <div className="col-lg-6">
              {/* start title */}
              <div
                className="section-heading aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <h2 className="mb-2 text-center text-lg-start">
                  Planes de Precios
                </h2>
                <div className="sec-line justify-content-lg-start">
                  <span className="sec-line1" />
                  <span className="sec-line2" />
                </div>
                <p className="mb-0 text-center text-lg-start">
                  Explora nuestros planes flexibles diseñados para satisfacer tus necesidades
                </p>
              </div>
            </div>
            {/* end col */}
            <div className="col-lg-6">
              <div
                className="pricing-item-01 justify-content-lg-end aos"
                data-aos="fade-down"
                data-aos-duration={1500}
              >
                <div className="pricing-item-nav d-flex align-items-center justify-content-between">
                  Anual
                  <ul className="nav nav-tabs nav-tabs-rounded nav-justified">
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        to="#monthly"
                        data-bs-toggle="tab"
                      />
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="#yearly"
                        data-bs-toggle="tab"
                      />
                    </li>
                  </ul>
                  Mensual
                </div>
              </div>
            </div>
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className="col-lg-12 mx-auto">
              <div className="tab-content">
                <div className="tab-pane show active" id="monthly">
                  {/* start row */}
                  <div className="row row-gap-3">
                    <div
                      className="col-lg-4 aos"
                      data-aos="fade-down"
                      data-aos-duration={1600}
                    >
                      <div className="pricing-item-02">
                        <div className="plan-head">
                          <h4 className="mb-1">Estándar</h4>
                          <p>
                            Manage up to 10 listings with essential features for
                            small teams and businesses.
                          </p>
                        </div>
                        <div className="plan-price">
                          <h2>
                            $99<span>/mes</span>
                          </h2>
                          <hr />
                        </div>
                        <div className="plan-features">
                          <h6>Características Clave</h6>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            10 Listados por Inicio de Sesión
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Hasta 100 Usuarios
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Consulta en Listados
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Soporte 24 Horas
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Revisión Personalizada Básica
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Reporte de Impacto Simple
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Onboarding Rápido y Cuenta
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Sin Acceso API
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Seguimiento de Transacciones Básico
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Marca Dreams Estate
                          </p>
                        </div>
                        <div className="plan-btn">
                          <Link to="#;" className="btn btn-dark border-0">
                            Obtener Cotización
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                    <div
                      className="col-lg-4 aos"
                      data-aos="fade-down"
                      data-aos-duration={1600}
                    >
                      <div className="pricing-item-02 popular">
                        <span className="bookmark-sideright-ribbone-primary-right">
                          <span>Más Popular</span>
                        </span>
                        <div className="plan-head">
                          <h4 className="mb-1">Profesional</h4>
                          <p>
                            Manage up to 10 listings with essential features for
                            small teams and businesses.
                          </p>
                        </div>
                        <div className="plan-price">
                          <h2>
                            $199<span>/month</span>
                          </h2>
                          <hr />
                        </div>
                        <div className="plan-features">
                          <h6>Características Clave</h6>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            50 Listados por Inicio de Sesión
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            500+ Usuarios Activos
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Consulta en Cada Listado
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Soporte Prioritario 24 Horas
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Revisión Personalizada Avanzada
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Reporte de Impacto Estándar
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Reporte de Impacto Estándar
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Acceso API Parcial
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Acceso API Parcial
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Marca Personalizada Parcial
                          </p>
                        </div>
                        <div className="plan-btn">
                          <Link to="#;" className="btn btn-dark border-0">
                            Obtener Cotización
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                    <div
                      className="col-lg-4 aos"
                      data-aos="fade-down"
                      data-aos-duration={1600}
                    >
                      <div className="pricing-item-02">
                        <div className="plan-head">
                          <h4 className="mb-1">Empresarial</h4>
                          <p>
                            Unlimited listings, full API access, 24/7 support,
                            and featured organizations.
                          </p>
                        </div>
                        <div className="plan-price">
                          <h2>
                            $399<span>/month</span>
                          </h2>
                          <hr />
                        </div>
                        <div className="plan-features">
                          <h6>Características Clave</h6>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Listados Ilimitados por Inicio de Sesión
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            1000+ Usuarios Activos
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Consulta Habilitada en Listados
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Soporte Dedicado 24 Horas
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Herramientas de Revisión Personalizada Completa
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Reporte de Impacto Avanzado
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Onboarding Personalizado y Cuenta
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Acceso API Completo
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Seguimiento Completo de Transacciones
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Marca White-Label
                          </p>
                        </div>
                        <div className="plan-btn">
                          <Link to="#;" className="btn btn-dark border-0">
                            Obtener Cotización
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                  </div>
                  {/* end row */}
                </div>
                <div className="tab-pane" id="yearly">
                  {/* start row */}
                  <div className="row row-gap-3">
                    <div className="col-lg-4">
                      <div className="pricing-item-02">
                        <div className="plan-head">
                          <h4 className="mb-1">Profesional</h4>
                          <p>
                            Manage up to 10 listings with essential features for
                            small teams and businesses.
                          </p>
                        </div>
                        <div className="plan-price">
                          <h2>
                            $999<span>/año</span>
                          </h2>
                          <hr />
                        </div>
                        <div className="plan-features">
                          <h6>Características Clave</h6>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            10 Listados por Inicio de Sesión
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Hasta 100 Usuarios
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Consulta en Listados
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Soporte 24 Horas
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Revisión Personalizada Básica
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Reporte de Impacto Simple
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Onboarding Rápido y Cuenta
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Sin Acceso API
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Seguimiento de Transacciones Básico
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Marca Dreams Estate
                          </p>
                        </div>
                        <div className="plan-btn">
                          <Link to="#;" className="btn btn-dark">
                            Obtener Cotización
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-lg-4">
                      <div className="pricing-item-02 popular">
                        <span className="bookmark-sideright-ribbone-primary-right">
                          <span>Más Popular</span>
                        </span>
                        <div className="plan-head">
                          <h4 className="mb-1">Profesional</h4>
                          <p>
                            Manage up to 10 listings with essential features for
                            small teams and businesses.
                          </p>
                        </div>
                        <div className="plan-price">
                          <h2>
                            $1199<span>/año</span>
                          </h2>
                          <hr />
                        </div>
                        <div className="plan-features">
                          <h6>Características Clave</h6>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            50 Listados por Inicio de Sesión
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            500+ Usuarios Activos
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Consulta en Cada Listado
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Soporte Prioritario 24 Horas
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Revisión Personalizada Avanzada
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Reporte de Impacto Estándar
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Reporte de Impacto Estándar
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Acceso API Parcial
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Acceso API Parcial
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Marca Personalizada Parcial
                          </p>
                        </div>
                        <div className="plan-btn">
                          <Link to="#;" className="btn btn-dark">
                            Obtener Cotización
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-lg-4">
                      <div className="pricing-item-02">
                        <div className="plan-head">
                          <h4 className="mb-1">Empresarial</h4>
                          <p>
                            Unlimited listings, full API access, 24/7 support,
                            and advanced featured organizations.
                          </p>
                        </div>
                        <div className="plan-price">
                          <h2>
                            $2399<span>/año</span>
                          </h2>
                          <hr />
                        </div>
                        <div className="plan-features">
                          <h6>Características Clave</h6>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Listados Ilimitados por Inicio de Sesión
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            1000+ Usuarios Activos
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Consulta Habilitada en Listados
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Soporte Dedicado 24 Horas
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Herramientas de Revisión Personalizada Completa
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Reporte de Impacto Avanzado
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Onboarding Personalizado y Cuenta
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Acceso API Completo
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Seguimiento Completo de Transacciones
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Marca White-Label
                          </p>
                        </div>
                        <div className="plan-btn">
                          <Link to="#;" className="btn btn-dark">
                            Obtener Cotización
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                  </div>
                  {/* end row */}
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* end plan section */}
    </>
  );
};

export default PlanSection;
