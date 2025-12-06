import { Link } from "react-router";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../../core/imageWithBasePath";

const Testimonial = () => {
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Testimonials"
          paths={[{ label: "Testimonials", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row row-gap-4">
              <div className="col-md-6 col-lg-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                    </div>
                    <p>
                      We ended up with our dream home in less than two months! I
                      can’t recommend them enough
                    </p>
                    <div className="d-flex align-items-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-18.jpg"
                          alt="img"
                          className="avatar avatar-lg rounded-circle me-2"
                        />
                      </Link>
                      <div>
                        <Link
                          to="#"
                          className="fw-semibold mb-1"
                        >
                          Robert King
                        </Link>
                        <p className="mb-0">Harlingen</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                    </div>
                    <p>
                      “They explained every step clearly and found me the
                      perfect home within my budget.”
                    </p>
                    <div className="d-flex align-items-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-17.jpg"
                          alt="img"
                          className="avatar avatar-lg rounded-circle me-2"
                        />
                      </Link>
                      <div>
                        <Link
                          to="#"
                          className="fw-semibold mb-1"
                        >
                          Erin Hawkins
                        </Link>
                        <p className="mb-0">Penns Neck.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                    </div>
                    <p>
                      “Selling our family home was an emotional journey, but
                      Ethel Laughlin made it was easier!”
                    </p>
                    <div className="d-flex align-items-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-02.jpg"
                          alt="img"
                          className="avatar avatar-lg rounded-circle me-2"
                        />
                      </Link>
                      <div>
                        <Link
                          to="#"
                          className="fw-semibold mb-1"
                        >
                          Margaret Buchanan
                        </Link>
                        <p className="mb-0">Wausau.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                    </div>
                    <p>
                      “Highly recommend for anyone selling a home.Their market
                      expertise helped us price the home right”
                    </p>
                    <div className="d-flex align-items-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-04.jpg"
                          alt="img"
                          className="avatar avatar-lg rounded-circle me-2"
                        />
                      </Link>
                      <div>
                        <Link
                          to="#"
                          className="fw-semibold mb-1"
                        >
                          George William
                        </Link>
                        <p className="mb-0">Memphis.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                    </div>
                    <p>
                      “I’ve worked with [Agent/Company Name] on three investment
                      properties, and every time”
                    </p>
                    <div className="d-flex align-items-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-06.jpg"
                          alt="img"
                          className="avatar avatar-lg rounded-circle me-2"
                        />
                      </Link>
                      <div>
                        <Link
                          to="#"
                          className="fw-semibold mb-1"
                        >
                          Kent Lintz
                        </Link>
                        <p className="mb-0">San Jose.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                    </div>
                    <p>
                      “They’ve brought solid opportunities and helped me
                      maximize returns. Their property management”
                    </p>
                    <div className="d-flex align-items-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-03.jpg"
                          alt="img"
                          className="avatar avatar-lg rounded-circle me-2"
                        />
                      </Link>
                      <div>
                        <Link
                          to="#"
                          className="fw-semibold mb-1"
                        >
                          Margaret Lee
                        </Link>
                        <p className="mb-0">Montgomery.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                    </div>
                    <p>
                      “Managing tenants used to be stressful until I hired Anne
                      Smith.”
                    </p>
                    <div className="d-flex align-items-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-13.jpg"
                          alt="img"
                          className="avatar avatar-lg rounded-circle me-2"
                        />
                      </Link>
                      <div>
                        <Link
                          to="#"
                          className="fw-semibold mb-1"
                        >
                          Amanda Krahn
                        </Link>
                        <p className="mb-0">Dallas.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                    </div>
                    <p>
                      “They handle everything — screening, rent collection, and
                      maintenance.”
                    </p>
                    <div className="d-flex align-items-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-16.jpg"
                          alt="img"
                          className="avatar avatar-lg rounded-circle me-2"
                        />
                      </Link>
                      <div>
                        <Link
                          to="#"
                          className="fw-semibold mb-1"
                        >
                          David Marx
                        </Link>
                        <p className="mb-0">Aberdeen.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                    </div>
                    <p>
                      “The application process was quick, and they’ve been
                      responsive with any issues since I moved in.”
                    </p>
                    <div className="d-flex align-items-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-12.jpg"
                          alt="img"
                          className="avatar avatar-lg rounded-circle me-2"
                        />
                      </Link>
                      <div>
                        <Link
                          to="#"
                          className="fw-semibold mb-1"
                        >
                          Billy Davis
                        </Link>
                        <p className="mb-0">Allen.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                    </div>
                    <p>
                      We ended up with our dream home in less than two months! I
                      can’t recommend them enough
                    </p>
                    <div className="d-flex align-items-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-09.jpg"
                          alt="img"
                          className="avatar avatar-lg rounded-circle me-2"
                        />
                      </Link>
                      <div>
                        <Link
                          to="#"
                          className="fw-semibold mb-1"
                        >
                          Robert King
                        </Link>
                        <p className="mb-0">Harlingen</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                    </div>
                    <p>
                      “ I was nervous and totally overwhelmed. But our agent
                      walked us through every step.”
                    </p>
                    <div className="d-flex align-items-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-11.jpg"
                          alt="img"
                          className="avatar avatar-lg rounded-circle me-2"
                        />
                      </Link>
                      <div>
                        <Link
                          to="#"
                          className="fw-semibold mb-1"
                        >
                          Martina Smith
                        </Link>
                        <p className="mb-0">Glendale.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col */}
              <div className="col-md-6 col-lg-4">
                <div className="card mb-0">
                  <div className="card-body">
                    <div className="d-flex align-items-center mb-2">
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star</i>
                      </span>
                      <span className="text-warning">
                        <i className="material-icons-outlined">star_half</i>
                      </span>
                    </div>
                    <p>
                      “The marketing strategy was spot-on, and they handled
                      everything from staging to closing”
                    </p>
                    <div className="d-flex align-items-center">
                      <Link to="#">
                        <ImageWithBasePath
                          src="assets/img/users/user-10.jpg"
                          alt="img"
                          className="avatar avatar-lg rounded-circle me-2"
                        />
                      </Link>
                      <div>
                        <Link
                          to="#"
                          className="fw-semibold mb-1"
                        >
                          Roy Pasco
                        </Link>
                        <p className="mb-0">Lompoc, London.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* end col */}
            </div>
            {/* end row */}
          </div>
        </div>
        {/* End Content */}
      </div>
      {/* ========================
			End Page Content
		========================= */}
    </>
  );
};

export default Testimonial;
