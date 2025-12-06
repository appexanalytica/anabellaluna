import { Link } from "react-router";
import { useTranslation } from "react-i18next";

const PlanSection = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* start plan section */}
      <section className="pricing-plan-section section-padding">
        <div className="container">
          {/* start row */}
          <div className="row align-items-center">
            <div className="col-lg-6">
              {/* start title */}
              <div
                className="section-heading aos"
                data-aos="fade-down"
                data-aos-duration={1000}
              >
                <h2 className="mb-2 text-center text-lg-start">
                  {t("home.plan.title")}
                </h2>
                <div className="sec-line justify-content-lg-start">
                  <span className="sec-line1" />
                  <span className="sec-line2" />
                </div>
                <p className="mb-0 text-center text-lg-start">
                  {t("home.plan.subtitle")}
                </p>
              </div>
            </div>
            {/* end col */}
            <div className="col-lg-6">
              <div
                className="pricing-item-01 justify-content-lg-end aos"
                data-aos="fade-down"
                data-aos-duration={1500}
              >
                <div className="pricing-item-nav d-flex align-items-center justify-content-between">
                  {t("home.plan.tabs.yearly")}
                  <ul className="nav nav-tabs nav-tabs-rounded nav-justified">
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        to="#monthly"
                        data-bs-toggle="tab"
                      />
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="#yearly"
                        data-bs-toggle="tab"
                      />
                    </li>
                  </ul>
                  {t("home.plan.tabs.monthly")}
                </div>
              </div>
            </div>
          </div>
          {/* end row */}
          {/* start row */}
          <div className="row">
            <div className="col-lg-12 mx-auto">
              <div className="tab-content">
                <div className="tab-pane show active" id="monthly">
                  {/* start row */}
                  <div className="row row-gap-3">
                    <div
                      className="col-lg-4 aos"
                      data-aos="fade-down"
                      data-aos-duration={1600}
                    >
                      <div className="pricing-item-02">
                        <div className="plan-head">
                          <h4 className="mb-1">{t("home.plan.plans.standard.title")}</h4>
                          <p>
                            Manage up to 10 listings with essential features for
                            small teams and businesses.
                          </p>
                        </div>
                        <div className="plan-price">
                          <h2>
                            $99<span>{t("home.plan.perMonth")}</span>
                          </h2>
                          <hr />
                        </div>
                        <div className="plan-features">
                          <h6>{t("home.plan.keyFeatures")}</h6>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            10 Listing Per Login
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Up to 100 Users
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Enquiry on Listing
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            24 Hrs Support
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Basic Custom Review
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Simple Impact Reporting
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Quick Onboarding &amp; Account
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            No API Access
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Basic Transaction Tracking
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Dreams Estate Branding
                          </p>
                        </div>
                        <div className="plan-btn">
                          <Link to="#;" className="btn btn-dark border-0">
                            {t("home.plan.getQuote")}
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                    <div
                      className="col-lg-4 aos"
                      data-aos="fade-down"
                      data-aos-duration={1600}
                    >
                      <div className="pricing-item-02 popular">
                        <span className="bookmark-sideright-ribbone-primary-right">
                          <span>{t("home.plan.mostPopular")}</span>
                        </span>
                        <div className="plan-head">
                          <h4 className="mb-1">{t("home.plan.plans.professional.title")}</h4>
                          <p>
                            Manage up to 10 listings with essential features for
                            small teams and businesses.
                          </p>
                        </div>
                        <div className="plan-price">
                          <h2>
                            $199<span>/month</span>
                          </h2>
                          <hr />
                        </div>
                        <div className="plan-features">
                          <h6>{t("home.plan.keyFeatures")}</h6>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            50 Listing Per Login
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            500+ Active Users
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Enquiry On Every Listing
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Priority 24 Hrs Support
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Advanced Custom Review
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Standard Impact Reporting
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Standard Impact Reporting
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Partial API Access
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Partial API Access
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Partial Custom Branding
                          </p>
                        </div>
                        <div className="plan-btn">
                          <Link to="#;" className="btn btn-dark border-0">
                            {t("home.plan.getQuote")}
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                    <div
                      className="col-lg-4 aos"
                      data-aos="fade-down"
                      data-aos-duration={1600}
                    >
                      <div className="pricing-item-02">
                        <div className="plan-head">
                          <h4 className="mb-1">{t("home.plan.plans.enterprise.title")}</h4>
                          <p>
                            Unlimited listings, full API access, 24/7 support,
                            and featured organizations.
                          </p>
                        </div>
                        <div className="plan-price">
                          <h2>
                            $399<span>/month</span>
                          </h2>
                          <hr />
                        </div>
                        <div className="plan-features">
                          <h6>{t("home.plan.keyFeatures")}</h6>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Unlimited Listings Per Login
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            1000+ Active Users
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Enquiry Enabled On Listings
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Dedicated 24 Hrs Support
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Full Custom Review Tools
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Advanced Impact Reporting
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Personalized Onboarding &amp; Account
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Full Api Access
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Full Transaction Tracking
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            White-Label Branding
                          </p>
                        </div>
                        <div className="plan-btn">
                          <Link to="#;" className="btn btn-dark border-0">
                            {t("home.plan.getQuote")}
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                  </div>
                  {/* end row */}
                </div>
                <div className="tab-pane" id="yearly">
                  {/* start row */}
                  <div className="row row-gap-3">
                    <div className="col-lg-4">
                      <div className="pricing-item-02">
                        <div className="plan-head">
                          <h4 className="mb-1">{t("home.plan.plans.professional.title")}</h4>
                          <p>
                            Manage up to 10 listings with essential features for
                            small teams and businesses.
                          </p>
                        </div>
                        <div className="plan-price">
                          <h2>
                            $999<span>{t("home.plan.perYear")}</span>
                          </h2>
                          <hr />
                        </div>
                        <div className="plan-features">
                          <h6>{t("home.plan.keyFeatures")}</h6>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            10 Listing Per Login
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Up to 100 Users
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Enquiry on Listing
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            24 Hrs Support
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Basic Custom Review
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Simple Impact Reporting
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Quick Onboarding &amp; Account
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            No API Access
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Basic Transaction Tracking
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Dreams Estate Branding
                          </p>
                        </div>
                        <div className="plan-btn">
                          <Link to="#;" className="btn btn-dark">
                            {t("home.plan.getQuote")}
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-lg-4">
                      <div className="pricing-item-02 popular">
                        <span className="bookmark-sideright-ribbone-primary-right">
                          <span>{t("home.plan.mostPopular")}</span>
                        </span>
                        <div className="plan-head">
                          <h4 className="mb-1">{t("home.plan.plans.professional.title")}</h4>
                          <p>
                            Manage up to 10 listings with essential features for
                            small teams and businesses.
                          </p>
                        </div>
                        <div className="plan-price">
                          <h2>
                            $1199<span>{t("home.plan.perYear")}</span>
                          </h2>
                          <hr />
                        </div>
                        <div className="plan-features">
                          <h6>{t("home.plan.keyFeatures")}</h6>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            50 Listing Per Login
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            500+ Active Users
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Enquiry On Every Listing
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Priority 24 Hrs Support
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Advanced Custom Review
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Standard Impact Reporting
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Standard Impact Reporting
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Partial API Access
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Partial API Access
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Partial Custom Branding
                          </p>
                        </div>
                        <div className="plan-btn">
                          <Link to="#;" className="btn btn-dark">
                            {t("home.plan.getQuote")}
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-lg-4">
                      <div className="pricing-item-02">
                        <div className="plan-head">
                          <h4 className="mb-1">{t("home.plan.plans.enterprise.title")}</h4>
                          <p>
                            Unlimited listings, full API access, 24/7 support,
                            and advanced featured organizations.
                          </p>
                        </div>
                        <div className="plan-price">
                          <h2>
                            $2399<span>{t("home.plan.perYear")}</span>
                          </h2>
                          <hr />
                        </div>
                        <div className="plan-features">
                          <h6>{t("home.plan.keyFeatures")}</h6>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Unlimited Listings Per Login
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            1000+ Active Users
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Enquiry Enabled On Listings
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Dedicated 24 Hrs Support
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Full Custom Review Tools
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Advanced Impact Reporting
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Personalized Onboarding &amp; Account
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Full Api Access
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            Full Transaction Tracking
                          </p>
                          <p>
                            <i className="material-icons-outlined">
                              check_circle
                            </i>
                            White-Label Branding
                          </p>
                        </div>
                        <div className="plan-btn">
                          <Link to="#;" className="btn btn-dark">
                            {t("home.plan.getQuote")}
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                  </div>
                  {/* end row */}
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* end plan section */}
    </>
  );
};

export default PlanSection;
