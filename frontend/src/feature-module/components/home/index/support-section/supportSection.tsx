import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const SupportSection = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* start support section */}
      <section className="home-support-section section-padding bg-light">
        <div className="container">
          {/* start row */}
          <div className="row align-items-center">
            <div
              className="col-lg-6 aos"
              data-aos="fade-down"
              data-aos-duration={1000}
            >
              {/* start title */}
              <div className="section-heading mb-3 mb-lg-0">
                <h2 className="mb-2 text-lg-start text-center">
                  {t("home.support.title")}
                </h2>
                <p className="mb-0 text-lg-start text-center">
                  {t("home.support.subtitle")}
                </p>
              </div>
              {/* end title */}
            </div>
            {/* end col */}
            <div
              className="col-lg-6 aos"
              data-aos="fade-down"
              data-aos-duration={1500}
            >
              <div className="d-flex align-items-center justify-content-between gap-2">
                <div className="position-relative support-custom-icons">
                  <div className="input-group input-group-flat">
                    <input
                      type="text"
                      className="form-control bg-white w-100"
                      placeholder={t("common.placeholders.email")}
                    />
                  </div>
                  <i className="material-icons-outlined text-dark z-2">email</i>
                </div>
                <Link to="#" className="btn btn-lg btn-primary">
                  {t("common.buttons.subscribe")}
                </Link>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* end support section */}
    </>
  );
};

export default SupportSection;
