import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { useTranslation } from "react-i18next";

const StatSection = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* start stat section */}
      <section className="statistics-section section-padding bg-dark position-relative">
        <div className="container">
          {/* start row */}
          <div className="d-flex align-items-center justify-content-lg-between justify-content-md-between justify-content-center flex-wrap gap-2">
            <div
              className="statistics-item d-flex align-items-center gap-2 flex-wrap aos"
              data-aos="fade-down"
              data-aos-duration={1000}
            >
              <div>
                <ImageWithBasePath
                  src="assets/img/home/icons/stat-icon-1.svg"
                  alt="stat-icon-1"
                  className="img-fluid stat-img"
                />
              </div>
              <div>
                <h4 className="mb-1">
                  <span>50K</span>
                </h4>
                <p className="mb-0">{t("home.stat.listings")}</p>
              </div>
            </div>
            <div
              className="statistics-item d-flex align-items-center gap-2 flex-wrap aos"
              data-aos="fade-up"
              data-aos-duration={1000}
            >
              <div>
                <ImageWithBasePath
                  src="assets/img/home/icons/stat-icon-2.svg"
                  alt="stat-icon-1"
                  className="img-fluid stat-img"
                />
              </div>
              <div>
                <h4 className="mb-1">
                  <span>3000+</span>
                </h4>
                <p className="mb-0">{t("home.stat.agents")}</p>
              </div>
            </div>
            <div
              className="statistics-item d-flex align-items-center gap-2 flex-wrap aos"
              data-aos="fade-down"
              data-aos-duration={1000}
            >
              <div>
                <ImageWithBasePath
                  src="assets/img/home/icons/stat-icon-3.svg"
                  alt="stat-icon-1"
                  className="img-fluid stat-img"
                />
              </div>
              <div>
                <h4 className="mb-1">
                  <span>2000+</span>
                </h4>
                <p className="mb-0">{t("home.stat.sales")}</p>
              </div>
            </div>
            <div
              className="statistics-item d-flex align-items-center gap-2 flex-wrap aos"
              data-aos="fade-up"
              data-aos-duration={1000}
            >
              <div>
                <ImageWithBasePath
                  src="assets/img/home/icons/stat-icon-4.svg"
                  alt="stat-icon-1"
                  className="img-fluid stat-img"
                />
              </div>
              <div>
                <h4 className="mb-1">
                  <span>5000+</span>
                </h4>
                <p className="mb-0">{t("home.stat.users")} </p>
              </div>
            </div>
          </div>
          {/* end row */}
        </div>
        {/* element img */}
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
      </section>
      {/* end stat section */}
    </>
  );
};

export default StatSection;
