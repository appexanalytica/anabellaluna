import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";

const BannerSection = () => {
  return (
    <>
      {/* Home Banner Section Start */}
      <section className="home-banner-two">
        <div>
          <div
            className="banner-img-right"
            data-aos="fade-down"
            data-aos-duration={1000}
          >
            <ImageWithBasePath
              src="assets/img/section-bg/banner-bg-02.png"
              alt="image"
            />
          </div>
          <div>
            <ImageWithBasePath
              src="assets/img/bg/banner-round-bg.svg"
              className="banner-round"
              alt="image"
            />
          </div>
          <div>
            <ImageWithBasePath
              src="assets/img/bg/banner-shape.svg"
              className="banner-shape"
              alt="image"
            />
          </div>
        </div>
        <div className="container">
          {/* start row */}
          <div className="row">
            <div className="col-lg-5">
              <div className="banner-users d-flex align-items-center flex-wrap gap-2 mb-3">
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
                    <h6 className="mb-0 me-2 text-white fw-semibold fs-14">
                      Ratings 5.0
                    </h6>
                    <i className="material-icons-outlined text-warning">star</i>
                    <i className="material-icons-outlined text-warning">star</i>
                    <i className="material-icons-outlined text-warning">star</i>
                    <i className="material-icons-outlined text-warning">star</i>
                    <i className="material-icons-outlined text-warning">star</i>
                  </div>
                  <p className="mb-0 text-white fs-13">
                    Trusted By Client around the World
                  </p>
                </div>
              </div>
              <div className="banner-title aos" data-aos="fade-up">
                <h1>
                  Find your <span>Next Home</span> Away from Home.
                </h1>
                <p>
                  Say goodbye to the complexities and headaches of traditional
                  solutions and embrace a streamlined approach.
                </p>
              </div>
              <div className="d-flex align-items-center">
                <Link
                  to={all_routes.buyPropertyGrid}
                  className="btn btn-primary btn-lg d-inline-flex align-items-center me-3"
                >
                  <i className="material-icons-outlined me-2">
                    shopping_basket
                  </i>
                  Buy Property
                </Link>
                <Link
                  to={all_routes.rentPropertyGrid}
                  className="btn btn-white btn-lg d-inline-flex align-items-center"
                >
                  <i className="material-icons-outlined me-2">king_bed</i>Rent
                  Property
                </Link>
              </div>
            </div>
            {/* end col */}
          </div>
          {/* end row */}
        </div>
      </section>
      {/* Home Banner Section End */}
    </>
  );
};

export default BannerSection;
