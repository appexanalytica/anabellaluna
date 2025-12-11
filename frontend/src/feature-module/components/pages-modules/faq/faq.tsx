import { Link } from "react-router";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import Scrollspy from "react-scrollspy";

const Faq = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Preguntas frecuentes"
          paths={[{ label: "Preguntas frecuentes", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row" id="cart-wrap">
              <div className="col-lg-12 mx-auto">
                <div className="cart-item-wrap">
                  {/* start row */}
                  <div className="row row-gap-3">
                    <div className="col-lg-3">
                      <div className="card faq-sidebar mb-lg-0">
                        <div className="card-body">
                          <h5 className="mb-3">Tabla de contenido</h5>
                          <Scrollspy
                            items={[
                              "general",
                              "buying",
                              "selling",
                              "renting",
                              "legal",
                              "financial",
                            ]}
                            currentClassName="active"
                            offset={-100}
                            className="faq-sidebar"
                          >
                            <li>
                              <Link to="#general" className="nav-link">
                                General
                              </Link>
                            </li>
                            <li>
                              <Link to="#buying" className="nav-link">
                                Compra
                              </Link>
                            </li>
                            <li>
                              <Link to="#selling" className="nav-link">
                                Venta
                              </Link>
                            </li>
                            <li>
                              <Link to="#renting" className="nav-link">
                                Alquiler
                              </Link>
                            </li>
                            <li>
                              <Link to="#legal" className="nav-link">
                                Legal
                              </Link>
                            </li>
                            <li>
                              <Link to="#financial" className="nav-link">
                                Financiera
                              </Link>
                            </li>
                          </Scrollspy>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-lg-9">
                      <div
                        data-bs-spy="scroll"
                        data-bs-target="#list-example"
                        data-bs-offset={0}
                      >
                        <div className="mb-4" id="general">
                          <h4 className="mb-3">General</h4>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading1"
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse1"
                                  aria-expanded="true"
                                  aria-controls="CustomIconcollapse1"
                                >
                                  ¿Qué es el mercado inmobiliario?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse1"
                                className="accordion-collapse collapse show"
                                aria-labelledby="CustomIconheading1"
                                data-bs-parent="#CustomIconaccordionExample"
                              >
                                <div className="accordion-body">
                                  El mercado inmobiliario se refiere a los
                                  terrenos y a todas las construcciones
                                  permanentes sobre ellos, como casas o
                                  edificios.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample2"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading2"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse2"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse2"
                                >
                                  ¿Qué tipos de propiedades se incluyen en el
                                  mercado inmobiliario?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse2"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading2"
                                data-bs-parent="#CustomIconaccordionExample2"
                              >
                                <div className="accordion-body">
                                  El mercado inmobiliario incluye propiedades
                                  residenciales, comerciales, industriales,
                                  terrenos y propiedades de uso especial.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample3"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading3"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse3"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse3"
                                >
                                  ¿Cuál es el rol de un agente inmobiliario?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse3"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading3"
                                data-bs-parent="#CustomIconaccordionExample3"
                              >
                                <div className="accordion-body">
                                  Un agente inmobiliario ayuda a los clientes a
                                  comprar, vender o alquilar propiedades,
                                  guiándolos durante todo el proceso.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr className="my-4" />
                        <div className="mb-4" id="buying">
                          <h4 className="mb-3">Compra</h4>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample4"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading4"
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse4"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse4"
                                >
                                  ¿Cómo comienzo el proceso de compra de una
                                  vivienda?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse4"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading4"
                                data-bs-parent="#CustomIconaccordionExample4"
                              >
                                <div className="accordion-body">
                                  Comenzá evaluando tu presupuesto, obteniendo
                                  una precalificación hipotecaria y
                                  asesorándote con un agente inmobiliario.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample5"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading5"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse5"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse5"
                                >
                                  ¿Cuánto dinero necesito de anticipo?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse5"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading5"
                                data-bs-parent="#CustomIconaccordionExample5"
                              >
                                <div className="accordion-body">
                                  El anticipo suele ir desde un 10% hasta un 30%
                                  del valor de la propiedad, según el tipo de
                                  operación y las condiciones pactadas entre las
                                  partes o con el banco.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample6"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading6"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse6"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse6"
                                >
                                  ¿Qué es una inspección o informe técnico de la
                                  propiedad?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse6"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading6"
                                data-bs-parent="#CustomIconaccordionExample6"
                              >
                                <div className="accordion-body">
                                  Es una evaluación profesional del estado de la
                                  propiedad (estructura, instalaciones,
                                  humedad, etc.) para detectar problemas antes
                                  de cerrar la compra o firmar la escritura.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr className="my-4" />
                        <div className="mb-4" id="selling">
                          <h4 className="mb-3">Venta</h4>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample7"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading7"
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse7"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse7"
                                >
                                  ¿Cuál es el mejor momento para vender una
                                  propiedad?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse7"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading7"
                                data-bs-parent="#CustomIconaccordionExample7"
                              >
                                <div className="accordion-body">
                                  En Argentina, suele haber más movimiento en el
                                  mercado entre primavera y comienzos de verano,
                                  pero lo más importante es publicar con un
                                  precio acorde al mercado y fotos de calidad.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample8"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading8"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse8"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse8"
                                >
                                  ¿Conviene refaccionar antes de vender?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse8"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading8"
                                data-bs-parent="#CustomIconaccordionExample8"
                              >
                                <div className="accordion-body">
                                  Las refacciones pueden sumar valor, pero es
                                  clave enfocarse en arreglos básicos (pintura,
                                  humedad, mantenimiento) que mejoren la
                                  presentación sin sobreinvertir.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample9"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading9"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse9"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse9"
                                >
                                  ¿Cómo se determina el precio de publicación?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse9"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading9"
                                data-bs-parent="#CustomIconaccordionExample9"
                              >
                                <div className="accordion-body">
                                  Se define a partir de una tasación comparando
                                  la propiedad con otras similares en la zona,
                                  su estado, superficie y la situación del
                                  mercado en ese momento.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr className="my-4" />
                        <div className="mb-4" id="renting">
                          <h4 className="mb-3">Alquiler</h4>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample10"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading10"
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse10"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse10"
                                >
                                  ¿Qué documentación necesito para alquilar?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse10"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading10"
                                data-bs-parent="#CustomIconaccordionExample10"
                              >
                                <div className="accordion-body">
                                  En general se solicita DNI, recibos de sueldo
                                  o comprobante de ingresos, referencias y un
                                  garante propietario o seguro de caución.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample11"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading11"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse11"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse11"
                                >
                                  ¿Qué suele incluir el alquiler mensual?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse11"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading11"
                                data-bs-parent="#CustomIconaccordionExample11"
                              >
                                <div className="accordion-body">
                                  El alquiler cubre el uso de la propiedad y,
                                  según el contrato, puede incluir expensas,
                                  impuestos o algunos servicios. Siempre hay que
                                  revisar qué paga el inquilino y qué el dueño.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample12"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading12"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse12"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse12"
                                >
                                  ¿Cuál es la duración habitual de un contrato
                                  de alquiler?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse12"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading12"
                                data-bs-parent="#CustomIconaccordionExample12"
                              >
                                <div className="accordion-body">
                                  En Argentina los contratos suelen ser de 24 a
                                  36 meses, aunque pueden existir modalidades
                                  temporarias o de temporada con otros plazos.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr className="my-4" />
                        <div className="mb-4" id="legal">
                          <h4 className="mb-3">Legal</h4>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample13"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading13"
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse13"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse13"
                                >
                                  ¿Qué es la escritura de una propiedad?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse13"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading13"
                                data-bs-parent="#CustomIconaccordionExample13"
                              >
                                <div className="accordion-body">
                                  Es el documento público otorgado ante
                                  escribano que acredita la titularidad
                                  definitiva de la propiedad.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample14"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading14"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse14"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse14"
                                >
                                  ¿Qué rol cumple la escribanía en la
                                  operación?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse14"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading14"
                                data-bs-parent="#CustomIconaccordionExample14"
                              >
                                <div className="accordion-body">
                                  El escribano es un tercero imparcial que
                                  redacta la escritura, verifica títulos,
                                  retiene fondos y documentos hasta que se
                                  completa la operación.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample15"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading15"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse15"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse15"
                                >
                                  ¿Qué impuestos y tasas suelen pagar las
                                  propiedades?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse15"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading15"
                                data-bs-parent="#CustomIconaccordionExample15"
                              >
                                <div className="accordion-body">
                                  Generalmente se abonan impuestos como el
                                  inmobiliario provincial, tasas municipales y
                                  servicios (agua, luz, gas), según la
                                  jurisdicción.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <hr className="my-4" />
                        <div className="mb-0" id="financial">
                          <h4 className="mb-3">Financiera</h4>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample16"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading16"
                              >
                                <button
                                  className="accordion-button"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse16"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse16"
                                >
                                  ¿Qué es un crédito hipotecario?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse16"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading16"
                                data-bs-parent="#CustomIconaccordionExample16"
                              >
                                <div className="accordion-body">
                                  Es un préstamo de largo plazo otorgado por un
                                  banco u otra entidad para comprar una
                                  propiedad, que se devuelve en cuotas con
                                  interés y con la propiedad como garantía.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample17"
                          >
                            <div className="accordion-item">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading17"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse17"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse17"
                                >
                                  ¿Qué son los gastos de escrituración y cierre?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse17"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading17"
                                data-bs-parent="#CustomIconaccordionExample17"
                              >
                                <div className="accordion-body">
                                  Son los costos que se pagan al momento de la
                                  escritura: honorarios de escribano, sellos,
                                  impuestos y otros gastos administrativos.
                                </div>
                              </div>
                            </div>
                          </div>
                          <div
                            className="accordion accordion-bordered accordion-custom-icon accordion-arrow-none"
                            id="CustomIconaccordionExample18"
                          >
                            <div className="accordion-item mb-0">
                              <h6
                                className="accordion-header"
                                id="CustomIconheading18"
                              >
                                <button
                                  className="accordion-button collapsed"
                                  type="button"
                                  data-bs-toggle="collapse"
                                  data-bs-target="#CustomIconcollapse18"
                                  aria-expanded="false"
                                  aria-controls="CustomIconcollapse18"
                                >
                                  ¿Existen ayudas para quienes compran su
                                  primera vivienda?
                                  <i className="ti ti-plus accordion-icon accordion-icon-on" />
                                  <i className="ti ti-minus accordion-icon accordion-icon-off" />
                                </button>
                              </h6>
                              <div
                                id="CustomIconcollapse18"
                                className="accordion-collapse collapse"
                                aria-labelledby="CustomIconheading18"
                                data-bs-parent="#CustomIconaccordionExample18"
                              >
                                <div className="accordion-body">
                                  Sí, suelen existir líneas de crédito
                                  hipotecario y programas estatales o
                                  provinciales pensados para primeros
                                  compradores. Consultá siempre la oferta
                                  vigente.
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                  </div>
                  {/* end row */}
                </div>
              </div>
              {/* end col */}
            </div>
            {/* end row */}
          </div>
        </div>
        {/* End Content */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default Faq;
