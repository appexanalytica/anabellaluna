import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { useTranslation } from "react-i18next";

const WorkSection = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* start how it works section */}
      <section className="how-work-section section-padding">
        <div className="container">
          {/* start title */}
          <div
            className="section-heading aos"
            data-aos="fade-down"
            data-aos-duration={1000}
          >
            <h2 className="mb-2 text-center">{t("home.work.title")}</h2>
            <div className="sec-line">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <p className="mb-0 text-center">{t("home.work.subtitle")}</p>
          </div>
          {/* end title */}
          {/* start row */}
          <div className="row">
            <div
              className="col-lg-4 d-flex aos"
              data-aos="fade-up"
              data-aos-duration={500}
            >
              <div
                className="howit-work-item text-center aos-init aos-animate flex-fill"
                data-aos="fade-down"
                data-aos-duration={1200}
                data-aos-delay={100}
              >
                <div className="mb-3 bg-secondary avatar avatar-md rounded-circle p-2">
                  <ImageWithBasePath
                    src="assets/img/home/icons/work-icon-1.svg"
                    alt="icon"
                  />
                </div>
                <h5 className="mb-3">{t("home.work.steps.search.title")}</h5>
                <p className="mb-0">{t("home.work.steps.search.description")}</p>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4 d-flex aos"
              data-aos="fade-down"
              data-aos-duration={1000}
            >
              <div
                className="howit-work-item text-center aos-init aos-animate flex-fill"
                data-aos="fade-down"
                data-aos-duration={1200}
                data-aos-delay={100}
              >
                <div className=" mb-3 bg-danger avatar avatar-md rounded-circle p-2">
                  <ImageWithBasePath
                    src="assets/img/home/icons/work-icon-2.svg"
                    alt="icon"
                  />
                </div>
                <h5 className="mb-3">{t("home.work.steps.select.title")}</h5>
                <p className="mb-0">{t("home.work.steps.select.description")}</p>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4 d-flex aos"
              data-aos="fade-up"
              data-aos-duration={500}
            >
              <div
                className="howit-work-item text-center aos-init aos-animate flex-fill"
                data-aos="fade-down"
                data-aos-duration={1200}
                data-aos-delay={100}
              >
                <div className="mb-3 bg-success avatar avatar-md rounded-circle p-2">
                  <ImageWithBasePath
                    src="assets/img/home/icons/work-icon-3.svg"
                    alt="icon"
                  />
                </div>
                <h5 className="mb-3">{t("home.work.steps.book.title")}</h5>
                <p className="mb-0">{t("home.work.steps.book.description")}</p>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* end how it works section */}
    </>
  );
};

export default WorkSection;
