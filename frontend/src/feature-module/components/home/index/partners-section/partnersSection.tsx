import Slider from "react-slick";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const PartnersSection = () => {
  const Partner_Slider = {
    dots: false,
    infinite: true,
    speed: 2000,
    slidesToShow: 6,
    slidesToScroll: 1,
    autoplay: true,
    arrows: false,
    responsive: [
      {
        breakpoint: 1300,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 992,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <>
      {/* start partners section */}
      <section className="partners-section section-padding ">
        <div className="container">
          {/* start title */}
          <div
            className="section-heading aos"
            data-aos="fade-down"
            data-aos-duration={1000}
          >
            <h2 className="mb-2 text-center">
              Cientos de Socios en Todo el Mundo
            </h2>
            <div className="sec-line">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center">
              Cada día, construimos confianza a través de comunicación, transparencia y
              resultados.
            </p>
          </div>
          {/* end title */}
          <Slider
            {...Partner_Slider}
            className="partners-slide-item partners-slider"
          >
            <div
              className="partners-slide aos"
              data-aos="fade-right"
              data-aos-duration={1000}
            >
              <div className="partners-items">
                <ImageWithBasePath
                  src="assets/img/home/icons/partners-img-1.svg"
                  alt="partners-icon-1.svg"
                  className="img-fluid partners-icon"
                />
              </div>
            </div>
            <div className="partners-slide">
              <div
                className="partners-items aos"
                data-aos="fade-right"
                data-aos-duration={1500}
              >
                <ImageWithBasePath
                  src="assets/img/home/icons/partners-img-2.svg"
                  alt="partners-icon-1.svg"
                  className="img-fluid partners-icon"
                />
              </div>
            </div>
            <div className="partners-slide">
              <div
                className="partners-items aos"
                data-aos="fade-right"
                data-aos-duration={1000}
              >
                <ImageWithBasePath
                  src="assets/img/home/icons/partners-img-3.svg"
                  alt="partners-icon-1.svg"
                  className="img-fluid partners-icon"
                />
              </div>
            </div>
            <div className="partners-slide">
              <div
                className="partners-items aos"
                data-aos="fade-right"
                data-aos-duration={1500}
              >
                <ImageWithBasePath
                  src="assets/img/home/icons/partners-img-4.svg"
                  alt="partners-icon-1.svg"
                  className="img-fluid partners-icon"
                />
              </div>
            </div>
            <div className="partners-slide">
              <div
                className="partners-items aos"
                data-aos="fade-right"
                data-aos-duration={1000}
              >
                <ImageWithBasePath
                  src="assets/img/home/icons/partners-img-5.svg"
                  alt="partners-icon-1.svg"
                  className="img-fluid partners-icon"
                />
              </div>
            </div>
            <div className="partners-slide">
              <div
                className="partners-items aos"
                data-aos="fade-right"
                data-aos-duration={1500}
              >
                <ImageWithBasePath
                  src="assets/img/home/icons/partners-img-3.svg"
                  alt="partners-icon-1.svg"
                  className="img-fluid partners-icon"
                />
              </div>
            </div>
            <div className="partners-slide">
              <div
                className="partners-items aos"
                data-aos="fade-right"
                data-aos-duration={1000}
              >
                <ImageWithBasePath
                  src="assets/img/home/icons/partners-img-2.svg"
                  alt="partners-icon-1.svg"
                  className="img-fluid partners-icon"
                />
              </div>
            </div>
          </Slider>
        </div>
      </section>
      {/* end partners section */}
    </>
  );
};

export default PartnersSection;
