import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const WorkSection = () => {
  return (
    <>
      {/* Work Section Start */}
      <section className="work-section-three">
        <div className="container">
          {/* start row */}
          <div className="row justify-content-center gy-4">
            <div
              className="col-xl-3 col-lg-4 col-md-6 d-flex"
              data-aos="fade-down"
              data-aos-duration={1200}
              data-aos-delay={100}
            >
              <div className="work-card bg-soft-warning flex-fill">
                <div className="work-card-icon mb-3">
                  <span className="bg-warning me-2">
                    <ImageWithBasePath
                      src="assets/img/icons/work-icon-01.svg"
                      alt="icon"
                    />
                  </span>
                  <h5>Verified Listings</h5>
                </div>
                <p>
                  All properties are thoroughly checked to ensure authenticity
                  and avoid time-wasting.
                </p>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-xl-3 col-lg-4 col-md-6 d-flex"
              data-aos="fade-down"
              data-aos-duration={1200}
              data-aos-delay={200}
            >
              <div className="work-card bg-soft-secondary flex-fill">
                <div className="work-card-icon mb-3">
                  <span className="bg-secondary me-2">
                    <ImageWithBasePath
                      src="assets/img/icons/work-icon-02.svg"
                      alt="icon"
                    />
                  </span>
                  <h5>Wide Reach</h5>
                </div>
                <p>
                  Access thousands of listings across top cities, towns, and
                  emerging locations.
                </p>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-xl-3 col-lg-4 col-md-6 d-flex"
              data-aos="fade-down"
              data-aos-duration={1200}
              data-aos-delay={300}
            >
              <div className="work-card bg-soft-pink flex-fill">
                <div className="work-card-icon mb-3">
                  <span className="bg-pink me-2">
                    <ImageWithBasePath
                      src="assets/img/icons/work-icon-03.svg"
                      alt="icon"
                    />
                  </span>
                  <h5>Direct Communication</h5>
                </div>
                <p>
                  Connect instantly with sellers, agents, or property
                  managers—no middlemen.
                </p>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-xl-3 col-lg-4 col-md-6 d-flex"
              data-aos="fade-down"
              data-aos-duration={1200}
              data-aos-delay={400}
            >
              <div className="work-card bg-soft-teal flex-fill">
                <div className="work-card-icon mb-3">
                  <span className="bg-teal me-2">
                    <ImageWithBasePath
                      src="assets/img/icons/work-icon-04.svg"
                      alt="icon"
                    />
                  </span>
                  <h5>Time-Saving </h5>
                </div>
                <p>
                  No need to hop between sites—everything you need to discover
                  and decide is right here.
                </p>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* Work Section End */}
    </>
  );
};

export default WorkSection;
