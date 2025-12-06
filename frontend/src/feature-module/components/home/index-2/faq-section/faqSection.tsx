import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Keyboard } from "swiper/modules";
import "../../../../../../node_modules/swiper/swiper.css";
import "../../../../../../node_modules/swiper/modules/pagination.css";

const FaqSection = () => {
  return (
    <>
      {/* FAQ Section Start */}
      <section className="faq-section-two">
        <div className="container">
          {/* Section Title Start */}
          <div className="section-title-2">
            <div className="d-flex align-items-center justify-content-center">
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
              <h2>
                Frequently Asked <span> Questions</span>
              </h2>
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
            </div>
            <p>Quick Answers to Common Questions</p>
          </div>
          {/* Section Title End */}
          {/* start row */}
          <div className="row align-items-center gy-4">
            <div className="col-lg-6" data-aos="fade-up">
              <div className="property-sec-img mt-0">
                <div className="row g-3">
                  <div className="col-md-6 d-flex">
                    <div className="flex-fill">
                      <div>
                        <ImageWithBasePath
                          src="assets/img/home-3/property/property-01.jpg"
                          className="img-fluid"
                          alt="image"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-6 d-flex">
                    <div className="flex-fill">
                      <div className="mb-3">
                        <ImageWithBasePath
                          src="assets/img/home-3/property/property-02.jpg"
                          className="img-fluid"
                          alt="image"
                        />
                      </div>
                      <div>
                        <ImageWithBasePath
                          src="assets/img/home-3/property/property-03.jpg"
                          alt="image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="rotate-div">
                  <div className="img-center-text">
                    <h3 className="mb-1 text-white">10+</h3>
                    <p className="mb-0 fs-14 text-white text-center">
                      Years of <br /> Experience
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-6"
              data-aos="fade-up"
              data-aos-duration={1500}
            >
              <div
                className="accordion accordions-items-seperate faq-accordion"
                id="faq-accordion"
              >
                <div className="accordion-item">
                  <div className="accordion-header">
                    <button
                      className="accordion-button"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#accordion-1"
                      aria-expanded="true"
                    >
                      Does offer free cancellation for a full refund?
                    </button>
                  </div>
                  <div
                    id="accordion-1"
                    className="accordion-collapse collapse show"
                    data-bs-parent="#faq-accordion"
                  >
                    <div className="accordion-body">
                      <p className="mb-0">
                        Does have fully refundable room rates available to book
                        on our site. If you’ve booked a fully refundable room
                        rate, this can be cancelled up to a few days before
                        check-in depending on the property's cancellation
                        policy. Just make sure to check this property's
                        cancellation policy for the exact terms and conditions.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <div className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#accordion-2"
                      aria-expanded="false"
                    >
                      Is there a pool?
                    </button>
                  </div>
                  <div
                    id="accordion-2"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faq-accordion"
                  >
                    <div className="accordion-body">
                      <p className="mb-0">
                        Yes, there is a pool available for guests, providing a
                        perfect place to relax, unwind, and enjoy some leisure
                        time during their stay.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <div className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#accordion-3"
                      aria-expanded="false"
                    >
                      Are pets allowed?
                    </button>
                  </div>
                  <div
                    id="accordion-3"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faq-accordion"
                  >
                    <div className="accordion-body">
                      <p className="mb-0">
                        Yes, pets are allowed, and we welcome your furry friends
                        to stay with you, ensuring a comfortable experience for
                        both you and your pets.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <div className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#accordion-4"
                      aria-expanded="false"
                    >
                      Is airport shuttle service offered?
                    </button>
                  </div>
                  <div
                    id="accordion-4"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faq-accordion"
                  >
                    <div className="accordion-body">
                      <p className="mb-0">
                        Yes, airport shuttle service is offered to provide
                        convenient and reliable transportation for our guests
                        between the airport and their destination, ensuring a
                        smooth and stress-free travel experience.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="accordion-item">
                  <div className="accordion-header">
                    <button
                      className="accordion-button collapsed"
                      type="button"
                      data-bs-toggle="collapse"
                      data-bs-target="#accordion-5"
                      aria-expanded="false"
                    >
                      What are the check-in and check-out times?
                    </button>
                  </div>
                  <div
                    id="accordion-5"
                    className="accordion-collapse collapse"
                    data-bs-parent="#faq-accordion"
                  >
                    <div className="accordion-body">
                      <p className="mb-0">
                        Check-in is typically from 12:00 PM, and check-out is
                        usually by 11:00 AM to ensure a smooth transition for
                        all guests.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
          <Swiper
            slidesPerView={1}
            spaceBetween={24}
            loop={true}
            keyboard={{ enabled: true }}
            autoplay={{
              delay: 3000,
              disableOnInteraction: false,
            }}
            breakpoints={{
              768: {
                slidesPerView: 3,
              },
              992: {
                slidesPerView: 5,
              },
              1300: {
                slidesPerView: 6,
              },
            }}
            modules={[Autoplay, Keyboard]}
            className="partner-slider-two swiper"
          >
            <div className="swiper-wrapper">
              <SwiperSlide>
                <div className="partner-logo swiper-slide">
                  <ImageWithBasePath
                    src="assets/img/icons/partner-01.svg"
                    alt="image"
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="partner-logo swiper-slide">
                  <ImageWithBasePath
                    src="assets/img/icons/partner-02.svg"
                    alt="image"
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="partner-logo swiper-slide">
                  <ImageWithBasePath
                    src="assets/img/icons/partner-03.svg"
                    alt="image"
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="partner-logo swiper-slide">
                  <ImageWithBasePath
                    src="assets/img/icons/partner-04.svg"
                    alt="image"
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="partner-logo swiper-slide">
                  <ImageWithBasePath
                    src="assets/img/icons/partner-05.svg"
                    alt="image"
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="partner-logo swiper-slide">
                  <ImageWithBasePath
                    src="assets/img/icons/partner-06.svg"
                    alt="image"
                  />
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="partner-logo swiper-slide">
                  <ImageWithBasePath
                    src="assets/img/icons/partner-03.svg"
                    alt="image"
                  />
                </div>
              </SwiperSlide>
            </div>
          </Swiper>
        </div>
      </section>
      {/* FAQ Section End */}
    </>
  );
};

export default FaqSection;
