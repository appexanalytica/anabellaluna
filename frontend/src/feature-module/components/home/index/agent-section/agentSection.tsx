import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { useTranslation } from "react-i18next";

const AgentSection = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* start agent section */}
      <section className="agent-section section-padding bg-dark position-relative">
        <div className="container">
          {/* start row */}
          <div className="row align-items-center justify-content-lg-between justify-content-md-between flex-wrap">
            <div
              className="col-lg-7 aos"
              data-aos="zoom-in"
              data-aos-duration={1000}
            >
              {/* start title */}
              <div className="section-heading mb-3 mb-lg-0">
                <h2 className="mb-2 text-center text-lg-start  text-white ">
                  {t("home.agent.title")}
                </h2>
                <p className="mb-0 text-center text-lg-start text-light">
                  {t("home.agent.subtitle")}
                </p>
              </div>
              {/* end title */}
            </div>
            <div
              className="col-lg-5 position-relative z-1 aos"
              data-aos="zoom-in"
              data-aos-duration={1500}
            >
              <div className="text-lg-end text-center ">
                <Link to="" className="btn btn-xl btn-primary">
                  {t("home.agent.cta")}
                </Link>
              </div>
            </div>
          </div>
          {/* end row */}
        </div>
        <i className="fa-solid fa-circle custom-circle-line-1 d-lg-block d-none" />
        <i className="fa-solid fa-circle custom-circle-line-2 d-lg-block d-none" />
        <ImageWithBasePath
          src="assets/img/home/icons/property-element-1.svg"
          alt="property-element-0"
          className="img-fluid custom-element-img-1 d-lg-block d-none"
        />
        <ImageWithBasePath
          src="assets/img/home/icons/property-element-2.svg"
          alt="property-element-0"
          className="img-fluid custom-element-img-2 d-lg-block d-none"
        />
        <ImageWithBasePath
          src="assets/img/home/city/cities-img.png"
          alt="property-element-0"
          className="img-fluid custom-element-img-3 position-absolute end-0 bottom-0 z-0 d-lg-block d-none"
        />
      </section>
      {/* end agent section */}
    </>
  );
};

export default AgentSection;
