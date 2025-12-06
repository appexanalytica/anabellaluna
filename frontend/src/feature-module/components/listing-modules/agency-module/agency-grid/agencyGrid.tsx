import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";
import {
  Agency_Type,
  Select_Area,
  Select_Category,
  Select_City,
} from "../../../../../core/common/selectOption";
import { all_routes } from "../../../../routes/all_routes";
import Breadcrumb from "../../../../../core/common/Breadcrumb/breadcrumb";

const AgencyGrid = () => {
  return (
    <>
      {/* ========================
		Start Page Content
	========================= */}
      <div className="page-wrapper">
        <Breadcrumb
          title="Agency Grid"
          paths={[{ label: "Agency Grid", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            <div className="row mb-4">
              <div className="col-lg-3 col-sm-6">
                <div className="mb-3">
                  <label className="form-label">Agency Type</label>
                  <CommonSelect
                    options={Agency_Type}
                    className="select"
                    defaultValue={Agency_Type[0]}
                  />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="mb-3">
                  <label className="form-label">Select City </label>
                  <CommonSelect
                    options={Select_City}
                    className="select"
                    defaultValue={Select_City[0]}
                  />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="mb-3">
                  <label className="form-label">Select Area</label>
                  <CommonSelect
                    options={Select_Area}
                    className="select"
                    defaultValue={Select_Area[0]}
                  />
                </div>
              </div>
              <div className="col-lg-3 col-sm-6">
                <div className="mb-3">
                  <label className="form-label">Select Category</label>
                  <CommonSelect
                    options={Select_Category}
                    className="select"
                    defaultValue={Select_Category[0]}
                  />
                </div>
              </div>
            </div>
            {/* start row */}
            <div className="row justify-content-center">
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="agent-item">
                  <div className="agent-img">
                    <Link to={all_routes.agencyDetails}>
                      <ImageWithBasePath
                        src="assets/img/agency/agency-01.png"
                        className="img-fluid"
                        alt="image"
                      />
                    </Link>
                    <div className="position-absolute top-0 end-0 p-3">
                      <span className="badge bg-secondary">10 Listings</span>
                    </div>
                  </div>
                  <div className="agent-content text-start">
                    <div className="d-flex align-items-center mb-1">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons text-warning">star_border</i>
                      <i className="material-icons text-warning">star_border</i>
                      <span className="ms-1 fs-14">4.4 (25 Reviews)</span>
                    </div>
                    <h5 className="mb-1">
                      <Link to={all_routes.agencyDetails}>Greens Reality</Link>
                    </h5>
                    <p className="mb-0 d-inline-flex align-items-center">
                      <i className="material-icons-outlined me-1">place</i>New
                      York, Queens
                    </p>
                  </div>
                </div>
              </div>{" "}
              {/* end col */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="agent-item">
                  <div className="agent-img">
                    <Link to={all_routes.agencyDetails}>
                      <ImageWithBasePath
                        src="assets/img/agency/agency-02.png"
                        className="img-fluid"
                        alt="image"
                      />
                    </Link>
                    <div className="position-absolute top-0 end-0 p-3">
                      <span className="badge bg-secondary">59 Listings</span>
                    </div>
                  </div>
                  <div className="agent-content text-start">
                    <div className="d-flex align-items-center mb-1">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons text-warning">star_border</i>
                      <i className="material-icons text-warning">star_border</i>
                      <span className="ms-1 fs-14">4.1 (64 Reviews)</span>
                    </div>
                    <h5 className="mb-1">
                      <Link to={all_routes.agencyDetails}>Homes Estate</Link>
                    </h5>
                    <p className="mb-0 d-inline-flex align-items-center">
                      <i className="material-icons-outlined me-1">place</i>City
                      Center, Manhattan
                    </p>
                  </div>
                </div>
              </div>{" "}
              {/* end col */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="agent-item">
                  <div className="agent-img">
                    <Link to={all_routes.agencyDetails}>
                      <ImageWithBasePath
                        src="assets/img/agency/agency-03.png"
                        className="img-fluid"
                        alt="image"
                      />
                    </Link>
                    <div className="position-absolute top-0 end-0 p-3">
                      <span className="badge bg-secondary">10 Listings</span>
                    </div>
                  </div>
                  <div className="agent-content text-start">
                    <div className="d-flex align-items-center mb-1">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons text-warning">star_border</i>
                      <i className="material-icons text-warning">star_border</i>
                      <span className="ms-1 fs-14">4.3 (21 Reviews)</span>
                    </div>
                    <h5 className="mb-1">
                      <Link to={all_routes.agencyDetails}>
                        Luxurious Estate
                      </Link>
                    </h5>
                    <p className="mb-0 d-inline-flex align-items-center">
                      <i className="material-icons-outlined me-1">place</i>Las
                      Vegas
                    </p>
                  </div>
                </div>
              </div>{" "}
              {/* end col */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="agent-item">
                  <div className="agent-img">
                    <Link to={all_routes.agencyDetails}>
                      <ImageWithBasePath
                        src="assets/img/agency/agency-04.png"
                        className="img-fluid"
                        alt="image"
                      />
                    </Link>
                    <div className="position-absolute top-0 end-0 p-3">
                      <span className="badge bg-secondary">10 Listings</span>
                    </div>
                  </div>
                  <div className="agent-content text-start">
                    <div className="d-flex align-items-center mb-1">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons text-warning">star_border</i>
                      <i className="material-icons text-warning">star_border</i>
                      <span className="ms-1 fs-14">4.6 (18 Reviews)</span>
                    </div>
                    <h5 className="mb-1">
                      <Link to={all_routes.agencyDetails}>Louis Realtors</Link>
                    </h5>
                    <p className="mb-0 d-inline-flex align-items-center">
                      <i className="material-icons-outlined me-1">place</i>Tawin
                      City, NE
                    </p>
                  </div>
                </div>
              </div>{" "}
              {/* end col */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="agent-item">
                  <div className="agent-img">
                    <Link to={all_routes.agencyDetails}>
                      <ImageWithBasePath
                        src="assets/img/agency/agency-05.png"
                        className="img-fluid"
                        alt="image"
                      />
                    </Link>
                    <div className="position-absolute top-0 end-0 p-3">
                      <span className="badge bg-secondary">10 Listings</span>
                    </div>
                  </div>
                  <div className="agent-content text-start">
                    <div className="d-flex align-items-center mb-1">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons text-warning">star_border</i>
                      <i className="material-icons text-warning">star_border</i>
                      <span className="ms-1 fs-14">4.9 (139 Reviews)</span>
                    </div>
                    <h5 className="mb-1">
                      <Link to={all_routes.agencyDetails}>Queen Estate</Link>
                    </h5>
                    <p className="mb-0 d-inline-flex align-items-center">
                      <i className="material-icons-outlined me-1">place</i>
                      Pawnee City, NE
                    </p>
                  </div>
                </div>
              </div>{" "}
              {/* end col */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="agent-item">
                  <div className="agent-img">
                    <Link to={all_routes.agencyDetails}>
                      <ImageWithBasePath
                        src="assets/img/agency/agency-06.png"
                        className="img-fluid"
                        alt="image"
                      />
                    </Link>
                    <div className="position-absolute top-0 end-0 p-3">
                      <span className="badge bg-secondary">10 Listings</span>
                    </div>
                  </div>
                  <div className="agent-content text-start">
                    <div className="d-flex align-items-center mb-1">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons text-warning">star_border</i>
                      <i className="material-icons text-warning">star_border</i>
                      <span className="ms-1 fs-14">4.8 (36 Reviews)</span>
                    </div>
                    <h5 className="mb-1">
                      <Link to={all_routes.agencyDetails}>Reayal Estate</Link>
                    </h5>
                    <p className="mb-0 d-inline-flex align-items-center">
                      <i className="material-icons-outlined me-1">place</i>
                      Barron, WI
                    </p>
                  </div>
                </div>
              </div>{" "}
              {/* end col */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="agent-item">
                  <div className="agent-img">
                    <Link to={all_routes.agencyDetails}>
                      <ImageWithBasePath
                        src="assets/img/agency/agency-07.png"
                        className="img-fluid"
                        alt="image"
                      />
                    </Link>
                    <div className="position-absolute top-0 end-0 p-3">
                      <span className="badge bg-secondary">70 Listings</span>
                    </div>
                  </div>
                  <div className="agent-content text-start">
                    <div className="d-flex align-items-center mb-1">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons text-warning">star_border</i>
                      <i className="material-icons text-warning">star_border</i>
                      <span className="ms-1 fs-14">4.5 (19 Reviews)</span>
                    </div>
                    <h5 className="mb-1">
                      <Link to={all_routes.agencyDetails}>Newhome Estate</Link>
                    </h5>
                    <p className="mb-0 d-inline-flex align-items-center">
                      <i className="material-icons-outlined me-1">place</i>
                      Correll, MN
                    </p>
                  </div>
                </div>
              </div>{" "}
              {/* end col */}
              <div className="col-xl-3 col-lg-4 col-md-6">
                <div className="agent-item">
                  <div className="agent-img">
                    <Link to={all_routes.agencyDetails}>
                      <ImageWithBasePath
                        src="assets/img/agency/agency-08.png"
                        className="img-fluid"
                        alt="image"
                      />
                    </Link>
                    <div className="position-absolute top-0 end-0 p-3">
                      <span className="badge bg-secondary">93 Listings</span>
                    </div>
                  </div>
                  <div className="agent-content text-start">
                    <div className="d-flex align-items-center mb-1">
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined text-warning">
                        star
                      </i>
                      <i className="material-icons text-warning">star_border</i>
                      <i className="material-icons text-warning">star_border</i>
                      <span className="ms-1 fs-14">4.2 (28 Reviews)</span>
                    </div>
                    <h5 className="mb-1">
                      <Link to={all_routes.agencyDetails}>Real Estate</Link>
                    </h5>
                    <p className="mb-0 d-inline-flex align-items-center">
                      <i className="material-icons-outlined me-1">place</i>New
                      York, Queens
                    </p>
                  </div>
                </div>
              </div>{" "}
              {/* end col */}
            </div>
            {/* end row */}
            <div className="text-center pt-3">
              <Link
                to="#"
                className="btn btn-dark align-items-center d-inline-flex"
              >
                <i className="material-icons-outlined me-1">autorenew</i>Load
                More
              </Link>
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
                    <Link to="#" className="close" data-bs-dismiss="modal">
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

export default AgencyGrid;
