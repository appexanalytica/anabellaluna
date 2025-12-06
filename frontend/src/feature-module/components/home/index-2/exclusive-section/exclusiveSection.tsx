import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const ExclusiveSection = () => {
  return (
    <>
      {/* Exclusive Benifits Section Start */}
      <section className="exclusive-benifit-section">
        <div className="container">
          {/* Section Title Start */}
          <div
            className="section-title-2"
            data-aos="fade-up"
            data-aos-duration={500}
          >
            <div className="d-flex align-items-center justify-content-center">
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
              <h2>
                Discover the <span> Advantages &amp; Exclusive</span> Benefits
              </h2>
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
            </div>
            <p>
              Along the way, we’ve collaborated with incredible clients, tackled
              exciting challenges
            </p>
          </div>
          {/* Section Title End */}
          {/* start row */}
          <div className="row">
            <div
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-duration={1000}
            >
              <div className="benifit-item">
                <span className="benifit-icon">
                  <i className="material-icons-outlined">check_circle</i>
                </span>
                <div>
                  <h5 className="mb-2">Verified Listings</h5>
                  <p className="mb-0">
                    All properties are thoroughly checked to ensure authenticity
                    and avoid time-wasting.
                  </p>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-duration={1500}
            >
              <div className="benifit-item">
                <span className="benifit-icon">
                  <i className="material-icons-outlined">check_circle</i>
                </span>
                <div>
                  <h5 className="mb-2">Wide Reach</h5>
                  <p className="mb-0">
                    Access thousands of listings across top cities, towns, and
                    emerging locations.
                  </p>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-duration={2000}
            >
              <div className="benifit-item">
                <span className="benifit-icon">
                  <i className="material-icons-outlined">check_circle</i>
                </span>
                <div>
                  <h5 className="mb-2">Direct Communication</h5>
                  <p className="mb-0">
                    Connect instantly with sellers, agents, or property
                    managers—no middlemen.
                  </p>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-duration={2500}
            >
              <div className="benifit-item">
                <span className="benifit-icon">
                  <i className="material-icons-outlined">check_circle</i>
                </span>
                <div>
                  <h5 className="mb-2">Expert Guidance</h5>
                  <p className="mb-0">
                    Receive professional insights to make informed real estate
                    decisions confidently.
                  </p>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-duration={3000}
            >
              <div className="benifit-item">
                <span className="benifit-icon">
                  <i className="material-icons-outlined">check_circle</i>
                </span>
                <div>
                  <h5 className="mb-2">Tailored Solutions</h5>
                  <p className="mb-0">
                    We customize property options based on your specific needs
                    and preferences.
                  </p>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4 col-md-6"
              data-aos="fade-up"
              data-aos-duration={3000}
            >
              <div className="benifit-item">
                <span className="benifit-icon">
                  <i className="material-icons-outlined">check_circle</i>
                </span>
                <div>
                  <h5 className="mb-2">Seamless Process</h5>
                  <p className="mb-0">
                    Enjoy a smooth, stress-free experience from property search
                    to final transaction.
                  </p>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
          <div className="sec-bottom-imgs">
            <div className="bottom-img-1">
              <ImageWithBasePath
                src="assets/img/benifits/benifit-01.jpg"
                alt="image"
              />
            </div>
            <div className="bottom-img-2">
              <ImageWithBasePath
                src="assets/img/benifits/benifit-02.jpg"
                alt="image"
              />
            </div>
            <div className="bottom-img-3">
              <ImageWithBasePath
                src="assets/img/benifits/benifit-03.jpg"
                alt="image"
              />
            </div>
            <div className="bottom-img-4">
              <ImageWithBasePath
                src="assets/img/benifits/benifit-04.jpg"
                alt="image"
              />
            </div>
            <div className="bottom-img-5">
              <ImageWithBasePath
                src="assets/img/benifits/benifit-05.jpg"
                alt="image"
              />
            </div>
            <div className="bottom-img-6">
              <ImageWithBasePath
                src="assets/img/benifits/benifit-06.jpg"
                alt="image"
              />
            </div>
          </div>
        </div>
      </section>
      {/* Exclusive Benifits Section End */}
    </>
  );
};

export default ExclusiveSection;
