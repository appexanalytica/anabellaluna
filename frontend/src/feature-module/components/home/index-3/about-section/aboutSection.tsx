import { Link } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import CountUp from "react-countup";

const AboutSection = () => {
  return (
    <>
      {/* About Section Start */}
      <section className="about-us-section">
        <div className="section-bg">
          <ImageWithBasePath
            src="assets/img/home-3/bg/sec-bg-01.png"
            className="bg-1"
            alt="image"
          />
        </div>
        <div className="container">
          {/* start row */}
          <div className="row align-items-center">
            <div className="col-lg-6">
              <div className="about-left-content">
                {/* Section Title Start */}
                <div
                  className="section-headings"
                  data-aos="fade-up"
                  data-aos-duration={1200}
                >
                  <span className="text-primary d-block mb-3">About Us</span>
                  <div className="sec-line-three justify-content-start">
                    <span className="sec-line1" />
                    <span className="sec-line2" />
                  </div>
                  <h2 className="text-white">
                    Your next property move starts here.
                  </h2>
                  <h6 className="mb-3 text-primary">
                    We make property discovery simple, transparent, and
                    stress-free.
                  </h6>
                  <p className="text-white mb-4">
                    These hand-picked locations highlight our strongest
                    presence, fastest response times, and highest customer
                    satisfaction. Whether you're looking for expert
                    professionals or trusted services nearby, explore what's
                    available in your area.
                  </p>
                  <Link
                    to={all_routes.aboutUs}
                    className="btn btn-primary d-inline-flex"
                  >
                    Know More
                  </Link>
                </div>
                {/* Section Title End */}
                <div className="d-flex align-items-center justify-content-between flex-wrap row-gap-3 mt-3">
                  <div className="d-flex align-items-center">
                    <span className="flex-shrink-0 me-3">
                      <ImageWithBasePath
                        src="assets/img/icons/counter-icon-01.svg"
                        alt="image"
                      />
                    </span>
                    <div className="counter-value">
                      <h4 className="dash-count text-white">
                        <CountUp end={1514} duration={3} separator="," />+
                      </h4>
                      <p className="text-white">Trusted Owners</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="flex-shrink-0 me-3">
                      <ImageWithBasePath
                        src="assets/img/icons/counter-icon-02.svg"
                        alt="image"
                      />
                    </span>
                    <div className="counter-value">
                      <h4 className="dash-count text-white">
                        <CountUp end={12000} duration={3} separator="," />+
                      </h4>
                      <p className="text-white">Rentals Completed</p>
                    </div>
                  </div>
                  <div className="d-flex align-items-center">
                    <span className="flex-shrink-0 me-3">
                      <ImageWithBasePath
                        src="assets/img/icons/counter-icon-03.svg"
                        alt="image"
                      />
                    </span>
                    <div className="counter-value">
                      <h4 className="dash-count text-white">
                        <CountUp end={9000} duration={3} separator="," />+
                      </h4>
                      <p className="text-white">Happy Clients</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div className="col-lg-6">
              <div className="property-sec-img">
                <div className="row g-3">
                  <div
                    className="col-md-6 d-flex"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                  >
                    <div className="flex-fill">
                      <div>
                        <ImageWithBasePath
                          src="assets/img/home-3/property/property-01.jpg"
                          alt="image"
                        />
                      </div>
                    </div>
                  </div>
                  <div
                    className="col-md-6 d-flex"
                    data-aos="fade-up"
                    data-aos-duration={1200}
                  >
                    <div className="flex-fill">
                      <div className="mb-3">
                        <ImageWithBasePath
                          src="assets/img/home-3/property/property-02.jpg"
                          alt="image"
                        />
                      </div>
                      <div>
                        <ImageWithBasePath
                          src="assets/img/home-3/property/property-03.jpg"
                          alt="image"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="img-left-top">
                  <ImageWithBasePath
                    src="assets/img/icons/rounded-img.png"
                    alt="image"
                  />
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* About Section End */}
    </>
  );
};

export default AboutSection;
