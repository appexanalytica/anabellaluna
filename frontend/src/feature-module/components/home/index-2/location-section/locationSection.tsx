import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const LocationSection = () => {
  return (
    <>
      {/* Feature Location Section Start */}
      <section className="feature-location-section">
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
                Discover <span> Featured</span> Location
              </h2>
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
            </div>
            <p>Ready to buy your dream home? find it here</p>
          </div>
          {/* Section Title End */}
          {/* end row */}
          <div className="row">
            <div
              className="col-lg-3 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={1000}
            >
              <div className="location-item-two">
                <div className="location-img">
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/location/location-01.jpg"
                      className="img-fluid"
                      alt="image"
                    />
                  </Link>
                  <div className="position-absolute top-0 end-0 p-3 z-1">
                    <span className="badge bg-light text-dark">
                      200 Properties
                    </span>
                  </div>
                  <h5 className="position-absolute start-0 bottom-0 text-white z-1 p-3">
                    Switzerland
                  </h5>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-3 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={1500}
            >
              <div className="location-item-two">
                <div className="location-img">
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/location/location-02.jpg"
                      className="img-fluid"
                      alt="image"
                    />
                  </Link>
                  <div className="position-absolute top-0 end-0 p-3 z-1">
                    <span className="badge bg-light text-dark">
                      156 Properties
                    </span>
                  </div>
                  <h5 className="position-absolute start-0 bottom-0 text-white z-1 p-3">
                    Argentina
                  </h5>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-3 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={2000}
            >
              <div className="location-item-two">
                <div className="location-img">
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/location/location-03.jpg"
                      className="img-fluid"
                      alt="image"
                    />
                  </Link>
                  <div className="position-absolute top-0 end-0 p-3 z-1">
                    <span className="badge bg-light text-dark">
                      238 Properties
                    </span>
                  </div>
                  <h5 className="position-absolute start-0 bottom-0 text-white z-1 p-3">
                    Singapore
                  </h5>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-3 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={2500}
            >
              <div className="location-item-two">
                <div className="location-img">
                  <Link to="#">
                    <ImageWithBasePath
                      src="assets/img/location/location-04.jpg"
                      className="img-fluid"
                      alt="image"
                    />
                  </Link>
                  <div className="position-absolute top-0 end-0 p-3 z-1">
                    <span className="badge bg-light text-dark">
                      145 Properties
                    </span>
                  </div>
                  <h5 className="position-absolute start-0 bottom-0 text-white z-1 p-3">
                    Thailand
                  </h5>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
          <div className="text-center pt-3">
            <Link
              to="#"
              className="btn btn-dark d-inline-flex align-items-center"
            >
              More Locations
              <i className="material-icons-outlined ms-1">north_east</i>
            </Link>
          </div>
        </div>
      </section>
      {/* Feature Location Section End */}
    </>
  );
};

export default LocationSection;
