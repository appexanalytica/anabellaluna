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
            <h2 className="mb-2 text-center">Frequently Asked Questions</h2>
            <div className="sec-line">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center">
              Ready to buy your dream home? find it here.
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
                    <h5 className="mb-4"> General FAQ’s </h5>
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
                            What is real estate?
                          </button>
                        </div>
                        <div
                          id="accordion-1"
                          className="accordion-collapse collapse show"
                          data-bs-parent="#faq-accordion"
                        >
                          <div className="accordion-body">
                            <p className="mb-0">
                              Real estate refers to land and any permanent
                              structures on it, such as homes or buildings.
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
                            What types of properties are included in real
                            estate?
                          </button>
                        </div>
                        <div
                          id="accordion-2"
                          className="accordion-collapse collapse"
                          data-bs-parent="#faq-accordion"
                        >
                          <div className="accordion-body">
                            <p className="mb-0">
                              Real estate includes residential, commercial,
                              industrial, land, and special-purpose properties.
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
                            What is the role of a real estate agent?
                          </button>
                        </div>
                        <div
                          id="accordion-3"
                          className="accordion-collapse collapse"
                          data-bs-parent="#faq-accordion"
                        >
                          <div className="accordion-body">
                            <p className="mb-0">
                              A real estate agent assists clients in buying,
                              selling, or renting properties by guiding them
                              through the process.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="mb-4 mt-4"> Buying FAQ’s </h5>
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
                            How do I start the home-buying process?
                          </button>
                        </div>
                        <div
                          id="accordion-4"
                          className="accordion-collapse collapse"
                          data-bs-parent="#faq-accordion1"
                        >
                          <div className="accordion-body">
                            <p className="mb-0">
                              Start the home-buying process by checking your
                              budget, getting pre approved for a mortgage, and
                              consulting a real estate agent.
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
                            How much down payment do I need?
                          </button>
                        </div>
                        <div
                          id="accordion-5"
                          className="accordion-collapse collapse"
                          data-bs-parent="#faq-accordion1"
                        >
                          <div className="accordion-body">
                            <p className="mb-0">
                              The down payment typically ranges from 3% to 20%
                              of the home's price, depending on the loan type
                              and lender requirements.
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
                            What is a home inspection?
                          </button>
                        </div>
                        <div
                          id="accordion-6"
                          className="accordion-collapse collapse"
                          data-bs-parent="#faq-accordion1"
                        >
                          <div className="accordion-body">
                            <p className="mb-0">
                              A home inspection is a professional evaluation of
                              a property's condition to identify any issues
                              before finalizing the purchase.
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
