import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";

const FeatureTwoSection = () => {
  return (
    <>
      {/* Feature Property Section Start */}
      <section className="rent-propery-section">
        <div className="container">
          {/* Section Title Start */}
          <div className="section-heading-three">
            <div className="sec-line-three">
              <span className="sec-line1" />
              <span className="sec-line2" />
            </div>
            <h2>Featured Properties For Rentals</h2>
            <p>
              Hand-picked locations highlight our strongest presence, and
              highest customer satisfaction.
            </p>
          </div>
          {/* Section Title End */}
          {/* start row */}
          <div className="row justify-content-center gy-4">
            <div className="col-xl-3 col-lg-4 col-md-6 d-flex">
              <div className="rent-property-item flex-fill">
                <div className="property-img">
                  <Link to={all_routes.rentDetails}>
                    <ImageWithBasePath
                      src="assets/img/home-3/property/property-09.jpg"
                      alt="image"
                    />
                  </Link>
                  <div className="favourite">
                    <Link to="#">
                      <i className="material-icons-outlined">favorite_border</i>
                    </Link>
                  </div>
                  <div className="d-flex align-items-center token-top">
                    <span className="token bg-danger me-1">
                      <i className="material-icons-outlined text-warning">
                        generating_tokens
                      </i>
                    </span>
                    <span className="token bg-orange">
                      <i className="material-icons-outlined text-warning">
                        loyalty
                      </i>
                    </span>
                  </div>
                  <span className="avatar avatar-md rounded-circle border-0 avatar-bottom">
                    <ImageWithBasePath
                      src="assets/img/users/user-01.jpg"
                      className="img-fluid border border-white rounded-circle"
                      alt="Img"
                    />
                  </span>
                </div>
                <div className="rental-content">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge bg-secondary">Condo</span>
                    <span className="date">Listed on : 25 May 2025</span>
                  </div>
                  <div className="mb-3">
                    <h5>
                      <Link to={all_routes.rentDetails}>
                        Beautiful Condo Room
                      </Link>
                    </h5>
                    <p className="d-inline-flex align-items-center">
                      <i className="material-icons-outlined me-1">
                        location_on
                      </i>
                      25, Willow Crest Apartment
                    </p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="rate-info mb-0">
                      <span>$400 </span> / Month
                    </p>
                    <div className="d-flex align-items-center gap-1">
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
                      5.0
                    </div>
                  </div>
                  <div className="card-info d-flex align-items-center justify-content-between">
                    <p>
                      <span className="me-2">
                        <i className="material-icons-outlined">bed</i>
                      </span>
                      2 Bed
                    </p>
                    <p>
                      <span className="me-2">
                        <i className="material-icons-outlined">bathtub</i>
                      </span>
                      2 Bath
                    </p>
                    <p>
                      <span className="me-2">
                        <i className="material-icons-outlined">straighten</i>
                      </span>
                      350 Sq Ft
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div className="col-xl-3 col-lg-4 col-md-6 d-flex">
              <div className="rent-property-item flex-fill">
                <div className="property-img">
                  <Link to={all_routes.rentDetails}>
                    <ImageWithBasePath
                      src="assets/img/home-3/property/property-10.jpg"
                      alt="image"
                    />
                  </Link>
                  <div className="favourite">
                    <Link to="#">
                      <i className="material-icons-outlined">favorite_border</i>
                    </Link>
                  </div>
                  <div className="d-flex align-items-center token-top">
                    <span className="token bg-danger me-1">
                      <i className="material-icons-outlined text-warning">
                        generating_tokens
                      </i>
                    </span>
                    <span className="token bg-orange">
                      <i className="material-icons-outlined text-warning">
                        loyalty
                      </i>
                    </span>
                  </div>
                  <span className="avatar avatar-md rounded-circle border-0 avatar-bottom">
                    <ImageWithBasePath
                      src="assets/img/users/user-02.jpg"
                      className="img-fluid border border-white rounded-circle"
                      alt="Img"
                    />
                  </span>
                </div>
                <div className="rental-content">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge bg-pink">Suite</span>
                    <span className="date">Listed on : 18 Apr 2025</span>
                  </div>
                  <div className="mb-3">
                    <h5>
                      <Link to={all_routes.rentDetails}>
                        Serenity Condo Suite
                      </Link>
                    </h5>
                    <p className="d-inline-flex align-items-center">
                      <i className="material-icons-outlined me-1">
                        location_on
                      </i>
                      17, Grove Towers, New York
                    </p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="rate-info mb-0">
                      <span>$500 </span> / Month
                    </p>
                    <div className="d-flex align-items-center gap-1">
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
                      5.0
                    </div>
                  </div>
                  <div className="card-info d-flex align-items-center justify-content-between">
                    <p>
                      <span className="me-2">
                        <i className="material-icons-outlined">bed</i>
                      </span>
                      2 Bed
                    </p>
                    <p>
                      <span className="me-2">
                        <i className="material-icons-outlined">bathtub</i>
                      </span>
                      1 Bath
                    </p>
                    <p>
                      <span className="me-2">
                        <i className="material-icons-outlined">straighten</i>
                      </span>
                      400 Sq Ft
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div className="col-xl-3 col-lg-4 col-md-6 d-flex">
              <div className="rent-property-item flex-fill">
                <div className="property-img">
                  <Link to={all_routes.rentDetails}>
                    <ImageWithBasePath
                      src="assets/img/home-3/property/property-11.jpg"
                      alt="image"
                    />
                  </Link>
                  <div className="favourite">
                    <Link to="#">
                      <i className="material-icons-outlined">favorite_border</i>
                    </Link>
                  </div>
                  <div className="d-flex align-items-center token-top">
                    <span className="token bg-danger me-1">
                      <i className="material-icons-outlined text-warning">
                        generating_tokens
                      </i>
                    </span>
                    <span className="token bg-orange">
                      <i className="material-icons-outlined text-warning">
                        loyalty
                      </i>
                    </span>
                  </div>
                  <span className="avatar avatar-md rounded-circle border-0 avatar-bottom">
                    <ImageWithBasePath
                      src="assets/img/users/user-03.jpg"
                      className="img-fluid border border-white rounded-circle"
                      alt="Img"
                    />
                  </span>
                </div>
                <div className="rental-content">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge bg-purple">Luxe</span>
                    <span className="date">Listed on : 12 Apr 2025</span>
                  </div>
                  <div className="mb-3">
                    <h5>
                      <Link to={all_routes.rentDetails}>
                        Downtown Luxe Room
                      </Link>
                    </h5>
                    <p className="d-inline-flex align-items-center">
                      <i className="material-icons-outlined me-1">
                        location_on
                      </i>
                      88, Springs Lane, Austin
                    </p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="rate-info mb-0">
                      <span>$450 </span> / Month
                    </p>
                    <div className="d-flex align-items-center gap-1">
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
                      5.0
                    </div>
                  </div>
                  <div className="card-info d-flex align-items-center justify-content-between">
                    <p>
                      <span className="me-2">
                        <i className="material-icons-outlined">bed</i>
                      </span>
                      2 Bed
                    </p>
                    <p>
                      <span className="me-2">
                        <i className="material-icons-outlined">bathtub</i>
                      </span>
                      1 Bath
                    </p>
                    <p>
                      <span className="me-2">
                        <i className="material-icons-outlined">straighten</i>
                      </span>
                      460 Sq Ft
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
            <div className="col-xl-3 col-lg-4 col-md-6 d-flex">
              <div className="rent-property-item flex-fill">
                <div className="property-img">
                  <Link to={all_routes.rentDetails}>
                    <ImageWithBasePath
                      src="assets/img/home-3/property/property-12.jpg"
                      alt="image"
                    />
                  </Link>
                  <div className="favourite">
                    <Link to="#">
                      <i className="material-icons-outlined">favorite_border</i>
                    </Link>
                  </div>
                  <div className="d-flex align-items-center token-top">
                    <span className="token bg-danger me-1">
                      <i className="material-icons-outlined text-warning">
                        generating_tokens
                      </i>
                    </span>
                    <span className="token bg-orange">
                      <i className="material-icons-outlined text-warning">
                        loyalty
                      </i>
                    </span>
                  </div>
                  <span className="avatar avatar-md rounded-circle border-0 avatar-bottom">
                    <ImageWithBasePath
                      src="assets/img/users/user-04.jpg"
                      className="img-fluid border border-white rounded-circle"
                      alt="Img"
                    />
                  </span>
                </div>
                <div className="rental-content">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="badge bg-pink">Suite</span>
                    <span className="date">Listed on : 27 Mar 2025</span>
                  </div>
                  <div className="mb-3">
                    <h5>
                      <Link to={all_routes.rentDetails}>
                        Modern Haven Suite
                      </Link>
                    </h5>
                    <p className="d-inline-flex align-items-center">
                      <i className="material-icons-outlined me-1">
                        location_on
                      </i>
                      42, Hill Residence, Los Angeles
                    </p>
                  </div>
                  <div className="d-flex align-items-center justify-content-between">
                    <p className="rate-info mb-0">
                      <span>$600 </span> / Month
                    </p>
                    <div className="d-flex align-items-center gap-1">
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
                      5.0
                    </div>
                  </div>
                  <div className="card-info d-flex align-items-center justify-content-between">
                    <p>
                      <span className="me-2">
                        <i className="material-icons-outlined">bed</i>
                      </span>
                      2 Bed
                    </p>
                    <p>
                      <span className="me-2">
                        <i className="material-icons-outlined">bathtub</i>
                      </span>
                      1 Bath
                    </p>
                    <p>
                      <span className="me-2">
                        <i className="material-icons-outlined">straighten</i>
                      </span>
                      460 Sq Ft
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
          <div className="text-center mt-4 pt-3">
            <Link
              to={all_routes.rentPropertyGrid}
              className="btn btn-dark d-inline-flex align-items-center"
            >
              View More
              <i className="material-icons-outlined ms-1">north_east</i>
            </Link>
          </div>
        </div>
      </section>
      {/* Feature Property Section End */}
    </>
  );
};

export default FeatureTwoSection;
