import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";

const FeatureSection = () => {
  return (
    <>
      {/* Feature Property Section Start */}
      <section className="feature-property-section">
        <div className="container">
          {/* Section Title Start */}
          <div className="section-heading-three">
            <div className="sec-line-three">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <h2>Featured Property Type</h2>
            <p>
              Explore Our Curated Selection of Premium Properties for Unmatched
              Luxury
            </p>
          </div>
          {/* Section Title End */}
          {/* start row */}
          <div className="row justify-content-center gy-4">
            <div className="col-xl col-lg-4 col-sm-6">
              <div className="property-item">
                <div className="property-img">
                  <Link to={all_routes.rentPropertyGrid}>
                    <ImageWithBasePath
                      src="assets/img/home-3/property/property-04.jpg"
                      alt="image"
                    />
                  </Link>
                  <span className="building-icon">
                    <ImageWithBasePath
                      src="assets/img/icons/building-02.svg"
                      alt="image"
                    />
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between property-content">
                  <div className="propery-name">
                    <h5>
                      <Link to={all_routes.rentPropertyGrid}>Houses</Link>
                    </h5>
                    <p>288 Property</p>
                  </div>
                  <div className="arrow-overlay">
                    <Link to={all_routes.rentPropertyGrid}>
                      <i className="material-icons-outlined">north_east</i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div className="col-xl col-lg-4 col-sm-6">
              <div className="property-item">
                <div className="property-img">
                  <Link to={all_routes.rentPropertyGrid}>
                    <ImageWithBasePath
                      src="assets/img/home-3/property/property-05.jpg"
                      alt="image"
                    />
                  </Link>
                  <span className="building-icon">
                    <ImageWithBasePath
                      src="assets/img/icons/building-04.svg"
                      alt="image"
                    />
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between property-content">
                  <div className="propery-name">
                    <h5>
                      <Link to={all_routes.rentPropertyGrid}>Offices</Link>
                    </h5>
                    <p>300 Property</p>
                  </div>
                  <div className="arrow-overlay">
                    <Link to={all_routes.rentPropertyGrid}>
                      <i className="material-icons-outlined">north_east</i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div className="col-xl col-lg-4 col-sm-6">
              <div className="property-item">
                <div className="property-img">
                  <Link to={all_routes.rentPropertyGrid}>
                    <ImageWithBasePath
                      src="assets/img/home-3/property/property-06.jpg"
                      alt="image"
                    />
                  </Link>
                  <span className="building-icon">
                    <ImageWithBasePath
                      src="assets/img/icons/building-01.svg"
                      alt="image"
                    />
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between property-content">
                  <div className="propery-name">
                    <h5>
                      <Link to={all_routes.rentPropertyGrid}>Villas</Link>
                    </h5>
                    <p>250 Property</p>
                  </div>
                  <div className="arrow-overlay">
                    <Link to={all_routes.rentPropertyGrid}>
                      <i className="material-icons-outlined">north_east</i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div className="col-xl col-lg-4 col-sm-6">
              <div className="property-item">
                <div className="property-img">
                  <Link to={all_routes.rentPropertyGrid}>
                    <ImageWithBasePath
                      src="assets/img/home-3/property/property-07.jpg"
                      alt="image"
                    />
                  </Link>
                  <span className="building-icon">
                    <ImageWithBasePath
                      src="assets/img/icons/building-03.svg"
                      alt="image"
                    />
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between property-content">
                  <div className="propery-name">
                    <h5>
                      <Link to={all_routes.rentPropertyGrid}>Apartments</Link>
                    </h5>
                    <p>230 Property</p>
                  </div>
                  <div className="arrow-overlay">
                    <Link to={all_routes.rentPropertyGrid}>
                      <i className="material-icons-outlined">north_east</i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div className="col-xl col-lg-4 col-sm-6">
              <div className="property-item">
                <div className="property-img">
                  <Link to={all_routes.rentPropertyGrid}>
                    <ImageWithBasePath
                      src="assets/img/home-3/property/property-08.jpg"
                      alt="image"
                    />
                  </Link>
                  <span className="building-icon">
                    <ImageWithBasePath
                      src="assets/img/icons/building-05.svg"
                      alt="image"
                    />
                  </span>
                </div>
                <div className="d-flex align-items-center justify-content-between property-content">
                  <div className="propery-name">
                    <h5>
                      <Link to={all_routes.rentPropertyGrid}>Duplexes</Link>
                    </h5>
                    <p>320 Property</p>
                  </div>
                  <div className="arrow-overlay">
                    <Link to={all_routes.rentPropertyGrid}>
                      <i className="material-icons-outlined">north_east</i>
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* Feature Property Section End */}
    </>
  );
};

export default FeatureSection;
