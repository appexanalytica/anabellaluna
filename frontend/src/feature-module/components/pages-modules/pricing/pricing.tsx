import { Link } from "react-router";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";

const Pricing = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
       <Breadcrumb
          title="Pricing"
          paths={[
            { label: "Pricing", active: true },
          ]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row">
              <div className="col-lg-12 mx-auto">
                <div className="pricing-item-01">
                  <ul className="nav nav-tabs nav-tabs-rounded nav-justified mb-3">
                    <li className="nav-item">
                      <Link
                        className="nav-link active"
                        to="#monthly"
                        data-bs-toggle="tab"
                      >
                        Monthly
                      </Link>
                    </li>
                    <li className="nav-item">
                      <Link
                        className="nav-link"
                        to="#yearly"
                        data-bs-toggle="tab"
                      >
                        Yearly
                      </Link>
                    </li>
                  </ul>
                </div>
                <div className="tab-content">
                  <div className="tab-pane show active" id="monthly">
                    {/* start row */}
                    <div className="row row-gap-3">
                      <div className="col-lg-4">
                        <div className="pricing-item-02">
                          <div className="plan-head">
                            <h4 className="mb-1">Standard</h4>
                            <p>
                              Manage up to 10 listings with essential features
                              for small teams and businesses.
                            </p>
                          </div>
                          <div className="plan-price">
                            <h2>
                              $99<span>/month</span>
                            </h2>
                            <hr />
                          </div>
                          <div className="plan-features">
                            <h6>Key Features</h6>
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
                            <Link
                              to="#"
                              className="btn btn-dark"
                            >
                              Get a Quote
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* end col */}
                      <div className="col-lg-4">
                        <div className="pricing-item-02 popular">
                          <span className="bookmark-sideright-ribbone-primary-right">
                            <span>Most Popular</span>
                          </span>
                          <div className="plan-head">
                            <h4 className="mb-1">Professional</h4>
                            <p>
                              Manage up to 10 listings with essential features
                              for small teams and businesses.
                            </p>
                          </div>
                          <div className="plan-price">
                            <h2>
                              $199<span>/month</span>
                            </h2>
                            <hr />
                          </div>
                          <div className="plan-features">
                            <h6>Key Features</h6>
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
                            <Link
                              to="#"
                              className="btn btn-dark"
                            >
                              Get a Quote
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* end col */}
                      <div className="col-lg-4">
                        <div className="pricing-item-02">
                          <div className="plan-head">
                            <h4 className="mb-1">Enterprise</h4>
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
                            <h6>Key Features</h6>
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
                              Full API Access
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
                            <Link
                              to="#"
                              className="btn btn-dark"
                            >
                              Get a Quote
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
                            <h4 className="mb-1">Standard</h4>
                            <p>
                              Manage up to 10 listings with essential features
                              for small teams and businesses.
                            </p>
                          </div>
                          <div className="plan-price">
                            <h2>
                              $999<span>/year</span>
                            </h2>
                            <hr />
                          </div>
                          <div className="plan-features">
                            <h6>Key Features</h6>
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
                            <Link
                              to="#"
                              className="btn btn-dark"
                            >
                              Get a Quote
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* end col */}
                      <div className="col-lg-4">
                        <div className="pricing-item-02 popular">
                          <span className="bookmark-sideright-ribbone-primary-right">
                            <span>Most Popular</span>
                          </span>
                          <div className="plan-head">
                            <h4 className="mb-1">Professional</h4>
                            <p>
                              Manage up to 10 listings with essential features
                              for small teams and businesses.
                            </p>
                          </div>
                          <div className="plan-price">
                            <h2>
                              $1199<span>/year</span>
                            </h2>
                            <hr />
                          </div>
                          <div className="plan-features">
                            <h6>Key Features</h6>
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
                            <Link
                              to="#"
                              className="btn btn-dark"
                            >
                              Get a Quote
                            </Link>
                          </div>
                        </div>
                      </div>
                      {/* end col */}
                      <div className="col-lg-4">
                        <div className="pricing-item-02">
                          <div className="plan-head">
                            <h4 className="mb-1">Enterprise</h4>
                            <p>
                              Unlimited listings, full API access, 24/7 support,
                              and advanced features.
                            </p>
                          </div>
                          <div className="plan-price">
                            <h2>
                              $2399<span>/year</span>
                            </h2>
                            <hr />
                          </div>
                          <div className="plan-features">
                            <h6>Key Features</h6>
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
                              Full API Access
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
                            <Link
                              to="#"
                              className="btn btn-dark"
                            >
                              Get a Quote
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
        </div>
        {/* End Content */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default Pricing;
