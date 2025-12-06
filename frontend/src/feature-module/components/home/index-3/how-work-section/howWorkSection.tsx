import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const HowWorkSection = () => {
  return (
    <>
      {/* How it Work Section End */}
      <section className="how-it-work-section">
        <div className="section-bg">
          <ImageWithBasePath
            src="assets/img/home-3/bg/sec-bg-05.png"
            className="bg-1"
            alt="image"
          />
          <ImageWithBasePath
            src="assets/img/home-3/bg/shape-01.svg"
            className="bg-2"
            alt="image"
          />
          <ImageWithBasePath
            src="assets/img/home-3/bg/shape-02.svg"
            className="bg-3"
            alt="image"
          />
        </div>
        <div className="container">
          {/* start row */}
          <div className="row align-items-center">
            <div className="col-lg-7">
              <div className="work-sec-img">
                <div>
                  <ImageWithBasePath
                    src="assets/img/home-3/bg/sec-bg-04.png"
                    alt="image"
                  />
                </div>
                <div className="banner-users section-users d-flex align-items-center flex-wrap gap-3">
                  <div className="avatar-list-stacked">
                    <span className="avatar avatar-md rounded-circle border-0">
                      <ImageWithBasePath
                        src="assets/img/users/user-01.jpg"
                        className="img-fluid rounded-circle"
                        alt="Img"
                      />
                    </span>
                    <span className="avatar avatar-md rounded-circle border-0">
                      <ImageWithBasePath
                        src="assets/img/users/user-02.jpg"
                        className="img-fluid rounded-circle"
                        alt="Img"
                      />
                    </span>
                    <span className="avatar avatar-md rounded-circle border-0">
                      <ImageWithBasePath
                        src="assets/img/users/user-03.jpg"
                        className="img-fluid rounded-circle"
                        alt="Img"
                      />
                    </span>
                    <span className="avatar avatar-md rounded-circle border-0">
                      <ImageWithBasePath
                        src="assets/img/users/user-04.jpg"
                        className="img-fluid rounded-circle"
                        alt="Img"
                      />
                    </span>
                  </div>
                  <div>
                    <div className="d-flex align-items-center mb-1">
                      <h6 className="mb-0 me-2 fs-14 fw-semibold text-white">
                        Ratings 5.0
                      </h6>
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
                    <p className="mb-0 text-white">Trusted By 1000+ Client</p>
                  </div>
                </div>
                <div className="shape-3">
                  <ImageWithBasePath
                    src="assets/img/home-3/bg/shape-03.svg"
                    alt="image"
                  />
                </div>
              </div>
            </div>
            {/* end col */}
            <div className="col-lg-5">
              <div>
                <div className="section-headings mb-4">
                  <span className="text-primary d-block mb-3">
                    How it Works
                  </span>
                  <div className="sec-line-three justify-content-start">
                    <span className="sec-line1" />
                    <span className="sec-line2" />
                  </div>
                  <h2 className="mb-3 text-white">
                    Want tailor this more for a specific niche
                  </h2>
                </div>
                <div>
                  <div className="work-steps mb-4">
                    <span className="d-block mb-2 text-orange">Step 1</span>
                    <h6 className="mb-2 text-white">Search for Location</h6>
                    <p className="text-white">
                      Search by location, category, budget, and amenities. Find
                      listings that match your needs—whether it's a home,
                      office, or land.
                    </p>
                  </div>
                  <div className="work-steps mb-4">
                    <span className="d-block mb-2 text-pink">Step 2</span>
                    <h6 className="mb-2 text-white">Select Property Type</h6>
                    <p className="text-white">
                      Choose from modern apartments, spacious houses, stylish
                      condos, or commercial spaces that meet your specific
                      needs.
                    </p>
                  </div>
                  <div className="work-steps mb-0">
                    <span className="d-block mb-2 text-teal">Step 3</span>
                    <h6 className="mb-2 text-white">Book Your Property</h6>
                    <p className="text-white">
                      Select your preferred property type, provide your details,
                      and confirm your booking in just a few easy steps.
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* How it Work Section End */}
    </>
  );
};

export default HowWorkSection;
