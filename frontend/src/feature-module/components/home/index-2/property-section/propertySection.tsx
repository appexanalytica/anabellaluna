import { Link } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";

const PropertySection = () => {
  return (
    <>
      {/* Property Type Section Start */}
      <section className="property-type-section">
        <div className="container">
          {/* Section Title Start */}
          <div
            className="section-title-2"
            data-aos="fade-up"
            data-aos-duration={1000}
          >
            <div className="d-flex align-items-center justify-content-center">
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
              <h2>
                Recommended <span> Property</span> Types
              </h2>
              <span className="title-square bg-primary" />
              <span className="title-square bg-secondary" />
            </div>
            <p>
              Discover our top service areas, where quality meets convenience.
            </p>
          </div>
          {/* Section Title End */}
          {/* start row */}
          <div className="row">
            <div
              className="col-lg-3 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={1000}
            >
              <div className="property-type-item">
                <div className="property-img">
                  <Link to={all_routes.buyDetails}>
                    <ImageWithBasePath
                      src="assets/img/property-type/property-type-01.jpg"
                      className="img-fluid"
                      alt="image"
                    />
                  </Link>
                  <Link to={all_routes.buyDetails} className="overlay-arrow">
                    <i className="material-icons-outlined">north_east</i>
                  </Link>
                </div>
                <div className="text-center">
                  <h5 className="mb-1">
                    <Link to={all_routes.buyDetails}>Houses</Link>
                  </h5>
                  <p className="fs-14 mb-0">288 Property Available</p>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-3 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={1500}
            >
              <div className="property-type-item">
                <div className="property-img">
                  <Link to={all_routes.buyDetails}>
                    <ImageWithBasePath
                      src="assets/img/property-type/property-type-02.jpg"
                      className="img-fluid"
                      alt="image"
                    />
                  </Link>
                  <Link to={all_routes.buyDetails} className="overlay-arrow">
                    <i className="material-icons-outlined">north_east</i>
                  </Link>
                </div>
                <div className="text-center">
                  <h5 className="mb-1">
                    <Link to={all_routes.buyDetails}>Offices</Link>
                  </h5>
                  <p className="fs-14 mb-0">300 Property Available</p>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-3 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={2000}
            >
              <div className="property-type-item">
                <div className="property-img">
                  <Link to={all_routes.buyDetails}>
                    <ImageWithBasePath
                      src="assets/img/property-type/property-type-03.jpg"
                      className="img-fluid"
                      alt="image"
                    />
                  </Link>
                  <Link to={all_routes.buyDetails} className="overlay-arrow">
                    <i className="material-icons-outlined">north_east</i>
                  </Link>
                </div>
                <div className="text-center">
                  <h5 className="mb-1">
                    <Link to={all_routes.buyDetails}>Villas</Link>
                  </h5>
                  <p className="fs-14 mb-0">145 Property Available</p>
                </div>
              </div>
            </div>
            {/* end col */}
            <div
              className="col-lg-3 col-sm-6"
              data-aos="fade-up"
              data-aos-duration={2500}
            >
              <div className="property-type-item">
                <div className="property-img">
                  <Link to={all_routes.buyDetails}>
                    <ImageWithBasePath
                      src="assets/img/property-type/property-type-04.jpg"
                      className="img-fluid"
                      alt="image"
                    />
                  </Link>
                  <Link to={all_routes.buyDetails} className="overlay-arrow">
                    <i className="material-icons-outlined">north_east</i>
                  </Link>
                </div>
                <div className="text-center">
                  <h5 className="mb-1">
                    <Link to={all_routes.buyDetails}>Apartments</Link>
                  </h5>
                  <p className="fs-14 mb-0">875 Property Available</p>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
          <div className="text-center pt-3">
            <Link
              to={all_routes.buyPropertyGrid}
              className="btn btn-dark d-inline-flex align-items-center"
            >
              View More Type
              <i className="material-icons-outlined ms-1">north_east</i>
            </Link>
          </div>
        </div>
      </section>
      {/* Property Type Section End */}
    </>
  );
};

export default PropertySection;
