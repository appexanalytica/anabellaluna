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
            <h2 className="mb-2 text-center text-white">Testimonials</h2>
            <div className="sec-line">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center text-light">
              What our happy client says
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
                  Booking our dream home was incredibly easy with Dreams Estate
                  The interface was user-friendly
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
                  Dreams Estate made home booking a breeze. Super easy and
                  stress-free! listing Portal of all time
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
                  From browsing to booking, everything felt effortless great
                  design, clear information.
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
                  Inding the perfect home was a breeze. The platform was smooth,
                  intuitive, and made experience.
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
                  Dreams Estate made home booking a breeze. Super easy and
                  stress-free! listing Portal of all time
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
