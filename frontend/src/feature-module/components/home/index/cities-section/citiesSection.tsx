import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import { useTranslation } from "react-i18next";

const CitiesSection = () => {
  const { t } = useTranslation();
  const Citites_Section = {
    dots: true,
    infinite: true,
    speed: 2000,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: false,
    arrows: false, // No arrows, as in original code
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          dots: true,
        },
      },
    ],
  };

  return (
    <>
      {/* start cities section */}
      <section className="cities-section section-padding">
        <div className="container">
          {/* start title */}
          <div
            className="section-heading aos"
            data-aos="fade-down"
            data-aos-duration={1000}
          >
            <h2 className="mb-2 text-center">{t("home.cities.title")}</h2>
            <div className="sec-line">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center">{t("home.cities.subtitle")}</p>
          </div>
          {/* end title */}
          <Slider {...Citites_Section} className="cities-slider">
            {/* item*/}
            <div className="city-items-slide">
              {/* inner iteam */}
              <div
                className="city-item position-relative mb-4 aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <div className="city-img position-relative">
                  <ImageWithBasePath
                    src="assets/img/home/city/city-img-1.jpg"
                    alt="City"
                    className="img-fluid"
                  />
                </div>
                <div className="city-name">
                  <h5 className="mb-1">New York</h5>
                  <p className="mb-0">300 {t("home.cities.properties")}</p>
                </div>
                <div className="arrow-overlay">
                  <Link to={all_routes.rentPropertyGrid}>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
              {/* inner iteam */}
              <div
                className="city-item position-relative aos"
                data-aos="fade-down"
                data-aos-duration={1500}
              >
                <div className="city-img position-relative">
                  <ImageWithBasePath
                    src="assets/img/home/city/city-img-4.jpg"
                    alt="City"
                    className="img-fluid"
                  />
                </div>
                <div className="city-name">
                  <h5 className="mb-1">Argentina</h5>
                  <p className="mb-0">740 {t("home.cities.properties")}</p>
                </div>
                <div className="arrow-overlay">
                  <Link to={all_routes.rentPropertyGrid}>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
            {/* item*/}
            <div className="city-items-slide">
              {/* inner iteam */}
              <div
                className="city-item position-relative mb-4 aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <div className="city-img position-relative">
                  <ImageWithBasePath
                    src="assets/img/home/city/city-img-2.jpg"
                    alt="City"
                    className="img-fluid"
                  />
                </div>
                <div className="city-name">
                  <h5 className="mb-1">Singapore</h5>
                  <p className="mb-0">400 {t("home.cities.properties")}</p>
                </div>
                <div className="arrow-overlay">
                  <Link to={all_routes.rentPropertyGrid}>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
              {/* inner iteam */}
              <div
                className="city-item position-relative aos"
                data-aos="fade-down"
                data-aos-duration={1500}
              >
                <div className="city-img position-relative">
                  <ImageWithBasePath
                    src="assets/img/home/city/city-img-5.jpg"
                    alt="City"
                    className="img-fluid"
                  />
                </div>
                <div className="city-name">
                  <h5 className="mb-1">United Kingdom</h5>
                  <p className="mb-0">1450 {t("home.cities.properties")}</p>
                </div>
                <div className="arrow-overlay">
                  <Link to={all_routes.rentPropertyGrid}>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
            {/* item*/}
            <div className="city-items-slide">
              {/* inner iteam */}
              <div
                className="city-item position-relative mb-4 aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <div className="city-img position-relative">
                  <ImageWithBasePath
                    src="assets/img/home/city/city-img-3.jpg"
                    alt="City"
                    className="img-fluid"
                  />
                </div>
                <div className="city-name">
                  <h5 className="mb-1">New York</h5>
                  <p className="mb-0">300 Properties</p>
                </div>
                <div className="arrow-overlay">
                  <Link to={all_routes.rentPropertyGrid}>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
              {/* inner iteam */}
              <div
                className="city-item position-relative aos"
                data-aos="fade-down"
                data-aos-duration={1500}
              >
                <div className="city-img position-relative">
                  <ImageWithBasePath
                    src="assets/img/home/city/city-img-6.jpg"
                    alt="City"
                    className="img-fluid"
                  />
                </div>
                <div className="city-name">
                  <h5>Singapore</h5>
                  <p>400 {t("home.cities.properties")}</p>
                </div>
                <div className="arrow-overlay">
                  <Link to={all_routes.rentPropertyGrid}>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
            {/* item*/}
            <div className="city-items-slide">
              {/* inner iteam */}
              <div
                className="city-item position-relative mb-4 aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <div className="city-img position-relative">
                  <ImageWithBasePath
                    src="assets/img/home/city/city-img-1.jpg"
                    alt="City"
                    className="img-fluid"
                  />
                </div>
                <div className="city-name">
                  <h5 className="mb-1">Thailand</h5>
                  <p className="mb-0">300 Properties</p>
                </div>
                <div className="arrow-overlay">
                  <Link to={all_routes.rentPropertyGrid}>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
              {/* inner iteam */}
              <div className="city-item position-relative">
                <div
                  className="city-img position-relative aos"
                  data-aos="fade-down"
                  data-aos-duration={1500}
                >
                  <ImageWithBasePath
                    src="assets/img/home/city/city-img-2.jpg"
                    alt="City"
                    className="img-fluid"
                  />
                </div>
                <div className="city-name">
                  <h5 className="mb-1">United Arab Emirates</h5>
                  <p className="mb-0">100 {t("home.cities.properties")}</p>
                </div>
                <div className="arrow-overlay">
                  <Link to={all_routes.rentPropertyGrid}>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
            {/* item*/}
            <div className="city-items-slide">
              {/* inner iteam */}
              <div
                className="city-item position-relative mb-4 aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <div className="city-img position-relative">
                  <ImageWithBasePath
                    src="assets/img/home/city/city-img-3.jpg"
                    alt="City"
                    className="img-fluid"
                  />
                </div>
                <div className="city-name">
                  <h5 className="mb-1">New York</h5>
                  <p className="mb-0">300 Properties</p>
                </div>
                <div className="arrow-overlay">
                  <Link to={all_routes.rentPropertyGrid}>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
              {/* inner iteam */}
              <div
                className="city-item position-relative aos"
                data-aos="fade-down"
                data-aos-duration={1500}
              >
                <div className="city-img position-relative">
                  <ImageWithBasePath
                    src="assets/img/home/city/city-img-6.jpg"
                    alt="City"
                    className="img-fluid"
                  />
                </div>
                <div className="city-name">
                  <h5>Singapore</h5>
                  <p>400 Properties</p>
                </div>
                <div className="arrow-overlay">
                  <Link to={all_routes.rentPropertyGrid}>
                    <i className="fa-solid fa-arrow-right" />
                  </Link>
                </div>
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/* end gallery section */}
    </>
  );
};

export default CitiesSection;
