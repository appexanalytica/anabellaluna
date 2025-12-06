import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const SuccessStoriesSection = () => {
  return (
    <>
      {/* Feature Properties For Sale */}
      <section className="success-stories-section">
        <div className="section-bg">
          <ImageWithBasePath
            src="assets/img/home-3/bg/sec-bg-07.png"
            className="bg-1"
            alt="image"
          />
          <ImageWithBasePath
            src="assets/img/home-3/bg/sec-bg-10.png"
            className="bg-2"
            alt="image"
          />
        </div>
        <div className="container">
          {/* start row */}
          <div className="row align-items-center">
            <div className="col-lg-4">
              <div className="section-left-content">
                <div className="section-headings mb-4">
                  <div className="sec-line-three justify-content-start mb-3">
                    <span className="sec-line1" />
                    <span className="sec-line2" />
                  </div>
                  <h2 className="mb-2">Success stories in their own words</h2>
                  <p className="mb-4">
                    Read what our satisfied clients have to say about their
                    experiences with our platform.
                  </p>
                  <Link
                    to="#"
                    className="btn btn-dark d-inline-flex align-items-center"
                  >
                    View More
                    <i className="material-icons-outlined ms-1">north_east</i>
                  </Link>
                </div>
                <div className="success-customer mb-4">
                  <h6>Trusted by 50K+ customers</h6>
                  <div className="d-flex align-items-center rating mb-1">
                    <i className="material-icons-outlined text-warning">star</i>
                    <i className="material-icons-outlined text-warning">star</i>
                    <i className="material-icons-outlined text-warning">star</i>
                    <i className="material-icons-outlined text-warning">star</i>
                    <i className="material-icons-outlined text-warning">star</i>
                    4.4/5.0
                    <span className="border-start ps-2 ms-2">
                      3,857 Reviews
                    </span>
                  </div>
                </div>
                <div className="arrow-bottom">
                  <ImageWithBasePath
                    src="assets/img/home-3/bg/arrow.svg"
                    alt="image"
                  />
                </div>
              </div>
            </div>
            {/* end col */}
            <div className="col-lg-8">
              <div>
                {/* start row */}
                <div className="row">
                  <div className="col-md-6">
                    <div className="review-item mb-4">
                      <span className="d-block mb-3">
                        <ImageWithBasePath
                          src="assets/img/icons/quote-down-02.svg"
                          alt="image"
                        />
                      </span>
                      <div className="d-flex align-items-center mb-2">
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
                      <p>
                        Booking our dream home was incredibly easy with Dreams
                        Estate The interface was user-friendly
                      </p>
                      <div className="review-customer">
                        <Link
                          to="#"
                          className="avatar avatar-md rounded-circle flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/users/user-02.jpg"
                            className="img-fluid border border-white rounded-circle"
                            alt="Img"
                          />
                        </Link>
                        <h6 className="me-2">
                          <Link to="#">Lily Brooks</Link>
                        </h6>
                        <span className="d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle me-2" />
                          South Africa
                        </span>
                      </div>
                    </div>
                    <div className="review-item mb-4">
                      <span className="d-block mb-3">
                        <ImageWithBasePath
                          src="assets/img/icons/quote-down-02.svg"
                          alt="image"
                        />
                      </span>
                      <div className="d-flex align-items-center mb-2">
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
                      <p>
                        Dreams Estate made home booking a breeze. Super easy and
                        stress-free!
                      </p>
                      <div className="review-customer">
                        <Link
                          to="#"
                          className="avatar avatar-md rounded-circle flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/users/user-04.jpg"
                            className="img-fluid border border-white rounded-circle"
                            alt="Img"
                          />
                        </Link>
                        <h6 className="me-2">
                          <Link to="#">Daniel Cooper</Link>
                        </h6>
                        <span className="d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle me-2" />
                          United States of America
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-6 mt-4">
                    <div className="review-item mb-4">
                      <span className="d-block mb-3">
                        <ImageWithBasePath
                          src="assets/img/icons/quote-down-02.svg"
                          alt="image"
                        />
                      </span>
                      <div className="d-flex align-items-center mb-2">
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
                      <p>
                        Booking our dream home was so simple with Dreams Estate.
                        The site was easy to use!
                      </p>
                      <div className="review-customer">
                        <Link
                          to="#"
                          className="avatar avatar-md rounded-circle flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/users/user-06.jpg"
                            className="img-fluid border border-white rounded-circle"
                            alt="Img"
                          />
                        </Link>
                        <h6 className="me-2">
                          <Link to="#">Ethan Wells</Link>
                        </h6>
                        <span className="d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle me-2" />
                          United Kingdom
                        </span>
                      </div>
                    </div>
                    <div className="review-item mb-4">
                      <span className="d-block mb-3">
                        <ImageWithBasePath
                          src="assets/img/icons/quote-down-02.svg"
                          alt="image"
                        />
                      </span>
                      <div className="d-flex align-items-center mb-2">
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
                      <p>
                        Dreams Estate made booking our dream home effortless.
                        The interface was so easy to navigate!
                      </p>
                      <div className="review-customer">
                        <Link
                          to="#"
                          className="avatar avatar-md rounded-circle flex-shrink-0 me-2"
                        >
                          <ImageWithBasePath
                            src="assets/img/users/user-17.jpg"
                            className="img-fluid border border-white rounded-circle"
                            alt="Img"
                          />
                        </Link>
                        <h6 className="me-2">
                          <Link to="#">Emma Davidson</Link>
                        </h6>
                        <span className="d-inline-flex align-items-center">
                          <i className="fa-solid fa-circle me-2" />
                          Japan
                        </span>
                      </div>
                    </div>
                  </div>
                  {/* end col */}
                </div>
                {/* end row */}
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* Feature Properties For Sale */}
    </>
  );
};

export default SuccessStoriesSection;
