import { Link } from "react-router";
import Breadcrumb from "../../../../../core/common/Breadcrumb/breadcrumb";
import AgencySidebar from "../agency-grid-sidebar/agencySidebar";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { all_routes } from "../../../../routes/all_routes";

const AgencyListSidebar = () => {
  return (
    <>
      {/* ========================
		Start Page Content
	========================= */}
      <div className="page-wrapper">
        <Breadcrumb
          title="Agency List With Sidebar"
          paths={[{ label: "Agency List With Sidebar", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            <div className="row">
              <div className="col-xl-3 theiaStickySidebar">
                <AgencySidebar />
              </div>
              <div className="col-xl-9">
                <div>
                  <div className="agent-list-item">
                    <div className="agent-img">
                      <Link to={all_routes.agencyDetails}>
                        <ImageWithBasePath
                          src="assets/img/agency/agency-01.png"
                          alt="image"
                        />
                      </Link>
                    </div>
                    <div className="agent-content">
                      <div className="d-flex align-items-center mb-2">
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <span className="ms-1 fs-14">4.2 (28 Reviews)</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.agencyDetails}>
                              Greens Reality
                            </Link>
                          </h5>
                          <p className="mb-0 d-inline-flex align-items-center">
                            <i className="material-icons-outlined me-1">
                              place
                            </i>
                            New York, Queens
                          </p>
                        </div>
                        <span className="badge bg-secondary">10 Listings</span>
                      </div>
                      <div className="border-bottom mb-3 pb-3">
                        <p className="mb-0">
                          We offer a free, data-driven property valuation to
                          help you price it right from day one—no guesswork.
                        </p>
                      </div>
                      <div className="social-icons">
                        <Link to="#">
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="agent-list-item">
                    <div className="agent-img">
                      <Link to={all_routes.agencyDetails}>
                        <ImageWithBasePath
                          src="assets/img/agency/agency-02.png"
                          alt="image"
                        />
                      </Link>
                    </div>
                    <div className="agent-content">
                      <div className="d-flex align-items-center mb-2">
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <span className="ms-1 fs-14">4.0 (28 Reviews)</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.agencyDetails}>
                              Homes Estate
                            </Link>
                          </h5>
                          <p className="mb-0 d-inline-flex align-items-center">
                            <i className="material-icons-outlined me-1">
                              place
                            </i>
                            City Center, Manhattan
                          </p>
                        </div>
                        <span className="badge bg-secondary">10 Listings</span>
                      </div>
                      <div className="border-bottom mb-3 pb-3">
                        <p className="mb-0">
                          From high-quality photography and video tours to
                          listings on top portals and social media—your property
                          gets maximum exposure.
                        </p>
                      </div>
                      <div className="social-icons">
                        <Link to="#">
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="agent-list-item">
                    <div className="agent-img">
                      <Link to={all_routes.agencyDetails}>
                        <ImageWithBasePath
                          src="assets/img/agency/agency-03.png"
                          alt="image"
                        />
                      </Link>
                    </div>
                    <div className="agent-content">
                      <div className="d-flex align-items-center mb-2">
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <span className="ms-1 fs-14">3.0 (17 Reviews)</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.agencyDetails}>
                              Luxurious Estate
                            </Link>
                          </h5>
                          <p className="mb-0 d-inline-flex align-items-center">
                            <i className="material-icons-outlined me-1">
                              place
                            </i>
                            Las Vegas
                          </p>
                        </div>
                        <span className="badge bg-secondary">10 Listings</span>
                      </div>
                      <div className="border-bottom mb-3 pb-3">
                        <p className="mb-0">
                          We know the neighborhoods, trends, and buyer
                          behavior—so we market your home with precision.
                        </p>
                      </div>
                      <div className="social-icons">
                        <Link to="#">
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="agent-list-item">
                    <div className="agent-img">
                      <Link to={all_routes.agencyDetails}>
                        <ImageWithBasePath
                          src="assets/img/agency/agency-04.png"
                          alt="image"
                        />
                      </Link>
                    </div>
                    <div className="agent-content">
                      <div className="d-flex align-items-center mb-2">
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <span className="ms-1 fs-14">4.0 (25 Reviews)</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.agencyDetails}>
                              Louis Realtors
                            </Link>
                          </h5>
                          <p className="mb-0 d-inline-flex align-items-center">
                            <i className="material-icons-outlined me-1">
                              place
                            </i>
                            New York, Queens
                          </p>
                        </div>
                        <span className="badge bg-secondary">10 Listings</span>
                      </div>
                      <div className="border-bottom mb-3 pb-3">
                        <p className="mb-0">
                          Our skilled agents negotiate on your behalf to ensure
                          you get the best possible deal—fast and hassle-free.
                        </p>
                      </div>
                      <div className="social-icons">
                        <Link to="#">
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="agent-list-item">
                    <div className="agent-img">
                      <Link to={all_routes.agencyDetails}>
                        <ImageWithBasePath
                          src="assets/img/agency/agency-05.png"
                          alt="image"
                        />
                      </Link>
                    </div>
                    <div className="agent-content">
                      <div className="d-flex align-items-center mb-2">
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <span className="ms-1 fs-14">4.0 (38 Reviews)</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.agencyDetails}>
                              Queen Estate
                            </Link>
                          </h5>
                          <p className="mb-0 d-inline-flex align-items-center">
                            <i className="material-icons-outlined me-1">
                              place
                            </i>
                            Tawin City, NE
                          </p>
                        </div>
                        <span className="badge bg-secondary">10 Listings</span>
                      </div>
                      <div className="border-bottom mb-3 pb-3">
                        <p className="mb-0">
                          We handle the paperwork, title checks, and compliance
                          to protect you from any legal pitfalls.
                        </p>
                      </div>
                      <div className="social-icons">
                        <Link to="#">
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="agent-list-item">
                    <div className="agent-img">
                      <Link to={all_routes.agencyDetails}>
                        <ImageWithBasePath
                          src="assets/img/agency/agency-06.png"
                          alt="image"
                        />
                      </Link>
                    </div>
                    <div className="agent-content">
                      <div className="d-flex align-items-center mb-2">
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <span className="ms-1 fs-14">5.0 (37 Reviews)</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.agencyDetails}>
                              Reayal Estate
                            </Link>
                          </h5>
                          <p className="mb-0 d-inline-flex align-items-center">
                            <i className="material-icons-outlined me-1">
                              place
                            </i>
                            Pawnee City, NE
                          </p>
                        </div>
                        <span className="badge bg-secondary">10 Listings</span>
                      </div>
                      <div className="border-bottom mb-3 pb-3">
                        <p className="mb-0">
                          No time-wasters. We pre-screen every potential buyer
                          to ensure they’re financially ready and serious.
                        </p>
                      </div>
                      <div className="social-icons">
                        <Link to="#">
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="agent-list-item">
                    <div className="agent-img">
                      <Link to={all_routes.agencyDetails}>
                        <ImageWithBasePath
                          src="assets/img/agency/agency-07.png"
                          alt="image"
                        />
                      </Link>
                    </div>
                    <div className="agent-content">
                      <div className="d-flex align-items-center mb-2">
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <span className="ms-1 fs-14">5.0 (37 Reviews)</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.agencyDetails}>
                              Newhome Estate
                            </Link>
                          </h5>
                          <p className="mb-0 d-inline-flex align-items-center">
                            <i className="material-icons-outlined me-1">
                              place
                            </i>
                            Barron, WI
                          </p>
                        </div>
                        <span className="badge bg-secondary">10 Listings</span>
                      </div>
                      <div className="border-bottom mb-3 pb-3">
                        <p className="mb-0">
                          You’ll never be left wondering—we keep you in the loop
                          with regular updates on viewings, offers, and market
                          feedback.
                        </p>
                      </div>
                      <div className="social-icons">
                        <Link to="#">
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="agent-list-item">
                    <div className="agent-img">
                      <Link to={all_routes.agencyDetails}>
                        <ImageWithBasePath
                          src="assets/img/agency/agency-08.png"
                          alt="image"
                        />
                      </Link>
                    </div>
                    <div className="agent-content">
                      <div className="d-flex align-items-center mb-2">
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons-outlined text-warning">
                          star
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <i className="material-icons text-warning">
                          star_border
                        </i>
                        <span className="ms-1 fs-14">5.0 (37 Reviews)</span>
                      </div>
                      <div className="d-flex align-items-center justify-content-between mb-3">
                        <div>
                          <h5 className="mb-1">
                            <Link to={all_routes.agencyDetails}>
                              Real Estate
                            </Link>
                          </h5>
                          <p className="mb-0 d-inline-flex align-items-center">
                            <i className="material-icons-outlined me-1">
                              place
                            </i>
                            Correll, MN
                          </p>
                        </div>
                        <span className="badge bg-secondary">10 Listings</span>
                      </div>
                      <div className="border-bottom mb-3 pb-3">
                        <p className="mb-0">
                          Our proven process and wide buyer network help you
                          sell quickly—often above market average timeframes.
                        </p>
                      </div>
                      <div className="social-icons">
                        <Link to="#">
                          <i className="fa-brands fa-x-twitter" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-facebook" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-instagram" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-linkedin" />
                        </Link>
                        <Link to="#">
                          <i className="fa-brands fa-pinterest" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="text-center pt-3">
                    <Link
                      to="#"
                      className="btn btn-dark align-items-center d-inline-flex"
                    >
                      <i className="material-icons-outlined me-1">autorenew</i>
                      Load More
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* End Content */}

        {/* Search Modal */}
        <div
          className="modal fade"
          id="search-modal"
          tabIndex={-1}
          aria-hidden="true"
        >
          <div className="modal-dialog  modal-dialog-centered modal-lg">
            <div className="modal-content">
              <div className="modal-body search-wrap">
                <form className="search-form" id="search-form">
                  <div className="d-flex align-items-center justify-content-between mb-4">
                    <h5>What Are You Looking for?</h5>
                    <Link
                      to="#"
                      className="close"
                      data-bs-dismiss="modal"
                    >
                      <i className="material-icons-outlined">close</i>
                    </Link>
                  </div>
                  <div className="input-group input-group-flat">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Type a Keyword...."
                    />
                    <span className="input-group-text">
                      <i className="material-icons-outlined">search</i>
                    </span>
                  </div>
                  <h6>Popular Properties</h6>
                  <div className="search-list">
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Beautiful Condo Room
                      </Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Royal Apartment
                      </Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Grand Villa House
                      </Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>Grand Mahaka</Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Lunaria Residence
                      </Link>
                    </p>
                    <p>
                      <Link to={all_routes.rentPropertyGrid}>
                        Stephen Alexander Homes
                      </Link>
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
        {/* End Search Modal */}
      </div>
      {/* ========================
		End Page Content
	========================= */}
    </>
  );
};

export default AgencyListSidebar;
