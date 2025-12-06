import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const PropertySection = () => {
  return (
    <>
      {/* Property Section Start */}
      <section className="property-section">
        <div className="container">
          {/* Section Title Start */}
          <div className="section-heading-three">
            <div className="sec-line-three">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <h2>Recommended Properties</h2>
            <p>
              Discover our top service areas, where quality meets convenience.
            </p>
          </div>
          {/* Section Title End */}
          {/* start row */}
          <div className="row gy-4 justify-content-center">
            <div
              className="col-lg-4"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={200}
            >
              <div className="location-item">
                <div className="location-img">
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/home-3/location/location-01.jpg"
                      alt="image"
                    />
                  </Link>
                  <div className="bottom-text">
                    <div className="location-name">
                      <h5>Ukraine</h5>
                      <p>300 Properties</p>
                    </div>
                    <div className="arrow-overlay">
                      <Link to="#">
                        <i className="material-icons-outlined">north_east</i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={200}
            >
              <div className="location-item">
                <div className="location-img">
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/home-3/location/location-02.jpg"
                      alt="image"
                    />
                  </Link>
                  <div className="bottom-text">
                    <div className="location-name">
                      <h5>Russia</h5>
                      <p>458 Properties</p>
                    </div>
                    <div className="arrow-overlay">
                      <Link to="#">
                        <i className="material-icons-outlined">north_east</i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-4"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={200}
            >
              <div className="location-item">
                <div className="location-img">
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/home-3/location/location-03.jpg"
                      alt="image"
                    />
                  </Link>
                  <div className="bottom-text">
                    <div className="location-name">
                      <h5>Thailand</h5>
                      <p>175 Properties</p>
                    </div>
                    <div className="arrow-overlay">
                      <Link to="#">
                        <i className="material-icons-outlined">north_east</i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-6"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={200}
            >
              <div className="location-item">
                <div className="location-img">
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/home-3/location/location-04.jpg"
                      alt="image"
                    />
                  </Link>
                  <div className="bottom-text">
                    <div className="location-name">
                      <h5>Azerbaijan</h5>
                      <p>155 Properties</p>
                    </div>
                    <div className="arrow-overlay">
                      <Link to="#">
                        <i className="material-icons-outlined">north_east</i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-6"
              data-aos="fade-up"
              data-aos-duration={1200}
              data-aos-delay={200}
            >
              <div className="location-item">
                <div className="location-img">
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/home-3/location/location-05.jpg"
                      alt="image"
                    />
                  </Link>
                  <div className="bottom-text">
                    <div className="location-name">
                      <h5>Germany</h5>
                      <p>265 Properties</p>
                    </div>
                    <div className="arrow-overlay">
                      <Link to="#">
                        <i className="material-icons-outlined">north_east</i>
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
          <div className="text-center mt-4 pt-3">
            <Link
              to="#"
              className="btn btn-dark btn-lg d-inline-flex align-items-center"
            >
              View More Locations
              <i className="material-icons-outlined ms-1">north_east</i>
            </Link>
          </div>
        </div>
      </section>
      {/* Property Section End */}
    </>
  );
};

export default PropertySection;
