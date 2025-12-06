import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard } from "swiper/modules";
import "../../../../../../node_modules/swiper/swiper.css";
import "../../../../../../node_modules/swiper/modules/pagination.css";

const ReviewSection = () => {
  return (
    <>
      {/* Customer Review Section Start */}
      <section className="customer-review-section">
        <div className="container">
          {/* Section Title Start */}
          <div
            className="section-title-2"
            data-aos="fade-up"
            data-aos-duration={500}
          >
            <div className="d-flex align-items-center justify-content-center">
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
              <h2>
                Success <span> Stories</span> in their Own Words
              </h2>
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
            </div>
            <p>Hear from our happy customers</p>
          </div>
          {/* Section Title End */}
          <Swiper
            slidesPerView={1}
            spaceBetween={24}
            loop={false}
            keyboard={{ enabled: true }}
            pagination={{
              clickable: true,
            }}
            navigation={true}
            breakpoints={{
              768: { slidesPerView: 2 },
              992: { slidesPerView: 3 },
              1300: { slidesPerView: 4 },
            }}
            modules={[Navigation, Pagination, Keyboard]}
            className="review-slider swiper"
            data-aos="fade-up"
          >
            <div className="swiper-wrapper">
              <SwiperSlide>
                <div className="review-item-two swiper-slide">
                  <span className="mb-3 d-block">
                    <ImageWithBasePath
                      src="assets/img/icons/quote-down.svg"
                      className="w-auto m-auto"
                      alt="image"
                    />
                  </span>
                  <div className="review-content">
                    <p className="mb-2">
                      Booking our dream home was incredibly easy with Dreams
                      Estate The interface was user-friendly
                    </p>
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link
                      to="#"
                      className="avatar avatar-lg avatar-rounded flex-shrink-0 me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/users/user-02.jpg"
                        alt="image"
                      />
                    </Link>
                    <div>
                      <h6 className="fs-16 fw-semibold mb-0">
                        <Link to="#">Lily Brooks</Link>
                      </h6>
                      <span className="fs-14">South Africa</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="review-item-two swiper-slide">
                  <span className="mb-3 d-block">
                    <ImageWithBasePath
                      src="assets/img/icons/quote-down.svg"
                      className="w-auto m-auto"
                      alt="image"
                    />
                  </span>
                  <div className="review-content">
                    <p className="mb-2">
                      Dreams Estate made home booking a breeze. Super easy and
                      stress-free! listing Portal of all time
                    </p>
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link
                      to="#"
                      className="avatar avatar-lg avatar-rounded flex-shrink-0 me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/users/user-04.jpg"
                        alt="image"
                      />
                    </Link>
                    <div>
                      <h6 className="fs-16 fw-semibold mb-0">
                        <Link to="#">Daniel Cooper</Link>
                      </h6>
                      <span className="fs-14">United States of America</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="review-item-two swiper-slide">
                  <span className="mb-3 d-block">
                    <ImageWithBasePath
                      src="assets/img/icons/quote-down.svg"
                      className="w-auto m-auto"
                      alt="image"
                    />
                  </span>
                  <div className="review-content">
                    <p className="mb-2">
                      Dreams Estate made home booking a breeze. Super easy and
                      stress-free! listing Portal of all time
                    </p>
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link
                      to="#"
                      className="avatar avatar-lg avatar-rounded flex-shrink-0 me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/users/user-03.jpg"
                        alt="image"
                      />
                    </Link>
                    <div>
                      <h6 className="fs-16 fw-semibold mb-0">
                        <Link to="#">Amina</Link>
                      </h6>
                      <span className="fs-14">North German Union</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="review-item-two swiper-slide">
                  <span className="mb-3 d-block">
                    <ImageWithBasePath
                      src="assets/img/icons/quote-down.svg"
                      className="w-auto m-auto"
                      alt="image"
                    />
                  </span>
                  <div className="review-content">
                    <p className="mb-2">
                      Dreams Estate made home booking a breeze. Super easy and
                      stress-free! listing Portal of all time
                    </p>
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link
                      to="#"
                      className="avatar avatar-lg avatar-rounded flex-shrink-0 me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/users/user-06.jpg"
                        alt="image"
                      />
                    </Link>
                    <div>
                      <h6 className="fs-16 fw-semibold mb-0">
                        <Link to="#">Mohammed</Link>
                      </h6>
                      <span className="fs-14">United Kingdom</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
              <SwiperSlide>
                <div className="review-item-two swiper-slide">
                  <span className="mb-3 d-block">
                    <ImageWithBasePath
                      src="assets/img/icons/quote-down.svg"
                      className="w-auto m-auto"
                      alt="image"
                    />
                  </span>
                  <div className="review-content">
                    <p className="mb-2">
                      Dreams Estate made home booking a breeze. Super easy and
                      stress-free! listing Portal of all time
                    </p>
                    <div className="d-flex align-items-center justify-content-center">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-center">
                    <Link
                      to="#"
                      className="avatar avatar-lg avatar-rounded flex-shrink-0 me-2"
                    >
                      <ImageWithBasePath
                        src="assets/img/users/user-04.jpg"
                        alt="image"
                      />
                    </Link>
                    <div>
                      <h6 className="fs-16 fw-semibold mb-0">
                        <Link to="#">Daniel Cooper</Link>
                      </h6>
                      <span>United States of America</span>
                    </div>
                  </div>
                </div>
              </SwiperSlide>
            </div>
          </Swiper>
          <div className="swiper-pagination" />

          <div className="text-center">
            <div className="d-inline-flex align-items-center flex-wrap gap-2 review-users">
              <div className="avatar-list-stacked">
                <span className="avatar avatar-md rounded-circle border-0">
                  <ImageWithBasePath
                    src="assets/img/users/user-01.jpg"
                    className="img-fluid rounded-circle"
                    alt="Img"
                  />
                </span>
                <span className="avatar avatar-md rounded-circle border-0">
                  <ImageWithBasePath
                    src="assets/img/users/user-02.jpg"
                    className="img-fluid rounded-circle"
                    alt="Img"
                  />
                </span>
                <span className="avatar avatar-md rounded-circle border-0">
                  <ImageWithBasePath
                    src="assets/img/users/user-03.jpg"
                    className="img-fluid rounded-circle"
                    alt="Img"
                  />
                </span>
                <span className="avatar avatar-md rounded-circle border-0">
                  <ImageWithBasePath
                    src="assets/img/users/user-04.jpg"
                    className="img-fluid rounded-circle"
                    alt="Img"
                  />
                </span>
              </div>
              <div>
                <div className="d-flex align-items-center mb-1">
                  <h6 className="mb-0 me-2 text-white fw-semibold fs-14">
                    Ratings 5.0
                  </h6>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                  <i className="material-icons-outlined text-warning">star</i>
                </div>
                <p className="mb-0 text-white fs-13">
                  Trusted By Client around the World
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      {/* Customer Review Section End */}
    </>
  );
};

export default ReviewSection;
