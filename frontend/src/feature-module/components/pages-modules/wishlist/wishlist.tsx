import { Link } from "react-router";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import { all_routes } from "../../../routes/all_routes";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { useState } from "react";

const Wishlist = () => {
  const [selectedItems, setSelectedItems] = useState(Array(10).fill(false));
  const handleItemClick = (index: number) => {
    setSelectedItems((prevSelectedItems) => {
      const updatedSelectedItems = [...prevSelectedItems];
      updatedSelectedItems[index] = !updatedSelectedItems[index];
      return updatedSelectedItems;
    });
  };
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Wishlist"
          paths={[{ label: "Wishlist", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            <ul className="nav nav-pills whishlist-item gap-2" role="tablist">
              <li className="nav-item" role="presentation">
                <Link
                  className="nav-link active"
                  data-bs-toggle="tab"
                  to="#listing-1"
                  role="tab"
                  aria-controls="listing-1"
                  aria-selected="true"
                >
                  <i className="material-icons-outlined me-2">
                    shopping_basket
                  </i>{" "}
                  Properties
                </Link>
              </li>
              <li className="nav-item" role="presentation">
                <Link
                  className="nav-link"
                  data-bs-toggle="tab"
                  to="#listing-2"
                  role="tab"
                  aria-controls="listing-2"
                  aria-selected="false"
                  tabIndex={-1}
                >
                  <i className="material-icons-outlined me-2">king_bed</i>
                  Apartment
                </Link>
              </li>
            </ul>
            <div className="tab-content">
              <div
                className="tab-pane fade active show"
                id="listing-1"
                role="tabpanel"
              >
                <div className="row mb-4">
                  {/* Items-1 */}
                  <div className="col-xl-4 col-lg-6 col-md-6 d-flex">
                    <div className="property-card mb-lg-0 flex-fill">
                      <div className="property-listing-item p-0 mb-0 shadow-none">
                        <div className="buy-grid-img mb-0 rounded-0">
                          <Link to={all_routes.buyDetails}>
                            <ImageWithBasePath
                              className="img-fluid"
                              src="assets/img/rent/rent-grid-img-01.jpg"
                              alt="image"
                            />
                          </Link>
                          <div className="d-flex align-items-center justify-content-between position-absolute top-0 start-0 end-0 p-3 z-1">
                            <div className="d-flex align-items-center gap-2">
                              <div className="badge badge-sm bg-danger d-flex align-items-center">
                                <i className="material-icons-outlined">
                                  offline_bolt
                                </i>
                                New
                              </div>
                              <div className="badge badge-sm bg-orange d-flex align-items-center">
                                <i className="material-icons-outlined">
                                  loyalty
                                </i>
                                Featured
                              </div>
                            </div>
                          </div>
                          <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                            <h6 className="text-white mb-0">
                              $21000{" "}
                              <span className="fs-14 fw-normal"> / Night </span>
                            </h6>
                            <Link
                              to="#"
                              className={`favourite ${
                                selectedItems[1] ? "selected" : ""
                              }`}
                              key={1}
                              onClick={() => handleItemClick(1)}
                            >
                              <i
                                className={`material-icons-outlined ${
                                  selectedItems[1] ? "filled" : ""
                                }`}
                              >
                                {selectedItems[1]
                                  ? "favorite"
                                  : "favorite_border"}
                              </i>
                            </Link>
                          </div>
                        </div>
                        <div className="buy-grid-content">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center justify-content-center">
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
                              <span className="ms-1 fs-14">Excellent</span>
                            </div>
                            <span className="badge bg-secondary"> Lodge</span>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <h6 className="title mb-1">
                                <Link to={all_routes.rentDetails}>
                                  Serenity Condo Suite
                                </Link>
                              </h6>
                              <p className="d-flex align-items-center fs-14 mb-0">
                                <i className="material-icons-outlined me-1 ms-0">
                                  location_on
                                </i>
                                17, Grove Towers, New York, USA
                              </p>
                            </div>
                          </div>
                          <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                bed
                              </i>
                              4 Bedroom
                            </li>
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                bathtub
                              </i>
                              4 Bath
                            </li>
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                straighten
                              </i>
                              350 Sq Ft
                            </li>
                          </ul>
                          <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3">
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar avatar-lg user-avatar">
                                <ImageWithBasePath
                                  src="assets/img/users/user-10.jpg"
                                  alt="image"
                                  className="rounded-circle"
                                />
                              </div>
                              <h6 className="mb-0 fs-16 fw-medium text-dark">
                                Ethan Brooks
                                <span className="d-block fs-14 text-body pt-1">
                                  United States
                                </span>{" "}
                              </h6>
                            </div>
                            <Link
                              to={all_routes.rentDetails}
                              className="btn btn-dark"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end card */}
                  </div>{" "}
                  {/* end col */}
                  {/* Items-2 */}
                  <div className="col-xl-4 col-lg-6 col-md-6 d-flex">
                    <div className="property-card mb-lg-0 flex-fill">
                      <div className="property-listing-item p-0 mb-0 shadow-none">
                        <div className="buy-grid-img mb-0 rounded-0">
                          <Link to={all_routes.buyDetails}>
                            <ImageWithBasePath
                              className="img-fluid"
                              src="assets/img/rent/rent-grid-img-02.jpg"
                              alt="image"
                            />
                          </Link>
                          <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                            <h6 className="text-white mb-0">
                              $1130{" "}
                              <span className="fs-14 fw-normal"> / Night </span>
                            </h6>
                            <Link
                              to="#"
                              className={`favourite ${
                                selectedItems[2] ? "selected" : ""
                              }`}
                              key={2}
                              onClick={() => handleItemClick(2)}
                            >
                              <i
                                className={`material-icons-outlined ${
                                  selectedItems[2] ? "filled" : ""
                                }`}
                              >
                                {selectedItems[2]
                                  ? "favorite"
                                  : "favorite_border"}
                              </i>
                            </Link>
                          </div>
                        </div>
                        <div className="buy-grid-content">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center justify-content-center">
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
                              <span className="ms-1 fs-14">Excellent</span>
                            </div>
                            <span className="badge bg-secondary">
                              {" "}
                              Apartment
                            </span>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <h6 className="title mb-1">
                                <Link to={all_routes.rentDetails}>
                                  Getaway Apartment
                                </Link>
                              </h6>
                              <p className="d-flex align-items-center fs-14 mb-0">
                                <i className="material-icons-outlined me-1 ms-0">
                                  location_on
                                </i>
                                54, Coral Sands Apartments, Gold Coast,
                                Australia
                              </p>
                            </div>
                          </div>
                          <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                bed
                              </i>
                              2 Bedroom
                            </li>
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                bathtub
                              </i>
                              4 Bath
                            </li>
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                straighten
                              </i>
                              350 Sq Ft
                            </li>
                          </ul>
                          <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3">
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar avatar-lg user-avatar">
                                <ImageWithBasePath
                                  src="assets/img/users/user-11.jpg"
                                  alt="image"
                                  className="rounded-circle"
                                />
                              </div>
                              <h6 className="mb-0 fs-16 fw-medium text-dark">
                                Olivia Hayes
                                <span className="d-block fs-14 text-body pt-1">
                                  Australia
                                </span>{" "}
                              </h6>
                            </div>
                            <Link
                              to={all_routes.rentDetails}
                              className="btn btn-dark"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end card */}
                  </div>{" "}
                  {/* end col */}
                  {/* Items-3 */}
                  <div className="col-xl-4 col-lg-6 col-md-6 d-flex">
                    <div className="property-card mb-lg-0  d-flex">
                      <div className="property-listing-item p-0 mb-0 shadow-none">
                        <div className="buy-grid-img mb-0 rounded-0">
                          <Link to={all_routes.buyDetails}>
                            <ImageWithBasePath
                              className="img-fluid"
                              src="assets/img/rent/rent-grid-img-03.jpg"
                              alt="image"
                            />
                          </Link>
                          <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                            <h6 className="text-white mb-0">
                              $2450{" "}
                              <span className="fs-14 fw-normal"> / Night </span>
                            </h6>
                            <Link
                              to="#"
                              className={`favourite ${
                                selectedItems[3] ? "selected" : ""
                              }`}
                              key={3}
                              onClick={() => handleItemClick(3)}
                            >
                              <i
                                className={`material-icons-outlined ${
                                  selectedItems[3] ? "filled" : ""
                                }`}
                              >
                                {selectedItems[3]
                                  ? "favorite"
                                  : "favorite_border"}
                              </i>
                            </Link>
                          </div>
                        </div>
                        <div className="buy-grid-content">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center justify-content-center">
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
                              <span className="ms-1 fs-14">Excellent</span>
                            </div>
                            <span className="badge bg-secondary"> Condo</span>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <h6 className="title mb-1">
                                <Link to={all_routes.rentDetails}>
                                  Cozy Urban Condo
                                </Link>
                              </h6>
                              <p className="d-flex align-items-center fs-14 mb-0">
                                <i className="material-icons-outlined me-1 ms-0">
                                  location_on
                                </i>
                                130, Elmstone Flats, Manchester, UK
                              </p>
                            </div>
                          </div>
                          <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                bed
                              </i>
                              4 Bedroom
                            </li>
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                bathtub
                              </i>
                              3 Bath
                            </li>
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                straighten
                              </i>
                              520 Sq Ft
                            </li>
                          </ul>
                          <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3">
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar avatar-lg user-avatar">
                                <ImageWithBasePath
                                  src="assets/img/users/user-12.jpg"
                                  alt="image"
                                  className="rounded-circle"
                                />
                              </div>
                              <h6 className="mb-0 fs-16 fw-medium text-dark">
                                Daniel Carter
                                <span className="d-block fs-14 text-body pt-1">
                                  United Kingdom
                                </span>{" "}
                              </h6>
                            </div>
                            <Link
                              to={all_routes.rentDetails}
                              className="btn btn-dark"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end card */}
                  </div>{" "}
                  {/* end col */}
                </div>
                {/* end tab */}
              </div>
              <div className="tab-pane fade" id="listing-2" role="tabpanel">
                <div className="row mb-4">
                  {/* Items-5 */}
                  <div className="col-xl-4 col-lg-6 col-md-6 d-flex">
                    <div className="property-card mb-lg-o flex-fill">
                      <div className="property-listing-item p-0 mb-0 shadow-none">
                        <div className="buy-grid-img mb-0 rounded-0">
                          <Link to={all_routes.buyDetails}>
                            <ImageWithBasePath
                              className="img-fluid"
                              src="assets/img/rent/rent-grid-img-05.jpg"
                              alt="image"
                            />
                          </Link>
                          <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                            <h6 className="text-white mb-0">
                              $4500{" "}
                              <span className="fs-14 fw-normal"> / Night </span>
                            </h6>
                            <Link
                              to="#"
                              className={`favourite ${
                                selectedItems[4] ? "selected" : ""
                              }`}
                              key={4}
                              onClick={() => handleItemClick(4)}
                            >
                              <i
                                className={`material-icons-outlined ${
                                  selectedItems[4] ? "filled" : ""
                                }`}
                              >
                                {selectedItems[4]
                                  ? "favorite"
                                  : "favorite_border"}
                              </i>
                            </Link>
                          </div>
                        </div>
                        <div className="buy-grid-content">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center justify-content-center">
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
                              <span className="ms-1 fs-14">Excellent</span>
                            </div>
                            <span className="badge bg-secondary">
                              {" "}
                              Residency
                            </span>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <h6 className="title mb-1">
                                <Link to={all_routes.rentDetails}>
                                  Majestic Stay
                                </Link>
                              </h6>
                              <p className="d-flex align-items-center fs-14 mb-0">
                                <i className="material-icons-outlined me-1 ms-0">
                                  location_on
                                </i>
                                10, Bella Vista Villas, Rome, Italy
                              </p>
                            </div>
                          </div>
                          <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                bed
                              </i>
                              2 Bedroom
                            </li>
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                bathtub
                              </i>
                              1 Bath
                            </li>
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                straighten
                              </i>
                              400 Sq Ft
                            </li>
                          </ul>
                          <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3">
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar avatar-lg user-avatar">
                                <ImageWithBasePath
                                  src="assets/img/users/user-14.jpg"
                                  alt="image"
                                  className="rounded-circle"
                                />
                              </div>
                              <h6 className="mb-0 fs-16 fw-medium text-dark">
                                Leo Ramirez
                                <span className="d-block fs-14 text-body pt-1">
                                  Italy
                                </span>{" "}
                              </h6>
                            </div>
                            <Link
                              to={all_routes.rentDetails}
                              className="btn btn-dark"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end card */}
                  </div>{" "}
                  {/* end col */}
                  {/* Items-6 */}
                  <div className="col-xl-4 col-lg-6 col-md-6  d-flex">
                    <div className="property-card mb-lg-o flex-fill">
                      <div className="property-listing-item p-0 mb-0 shadow-none">
                        <div className="buy-grid-img mb-0 rounded-0">
                          <Link to={all_routes.buyDetails}>
                            <ImageWithBasePath
                              className="img-fluid"
                              src="assets/img/rent/rent-grid-img-06.jpg"
                              alt="image"
                            />
                          </Link>
                          <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                            <h6 className="text-white mb-0">
                              $3000{" "}
                              <span className="fs-14 fw-normal"> / Night </span>
                            </h6>
                            <Link
                              to="#"
                              className={`favourite ${
                                selectedItems[5] ? "selected" : ""
                              }`}
                              key={5}
                              onClick={() => handleItemClick(5)}
                            >
                              <i
                                className={`material-icons-outlined ${
                                  selectedItems[5] ? "filled" : ""
                                }`}
                              >
                                {selectedItems[5]
                                  ? "favorite"
                                  : "favorite_border"}
                              </i>
                            </Link>
                          </div>
                        </div>
                        <div className="buy-grid-content">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center justify-content-center">
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
                              <span className="ms-1 fs-14">Excellent</span>
                            </div>
                            <span className="badge bg-secondary"> Lodge</span>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <h6 className="title mb-1">
                                <Link to={all_routes.rentDetails}>
                                  Noble Nest
                                </Link>
                              </h6>
                              <p className="d-flex align-items-center fs-14 mb-0">
                                <i className="material-icons-outlined me-1 ms-0">
                                  location_on
                                </i>
                                76, Sakura Heights, Kyoto, Japan
                              </p>
                            </div>
                          </div>
                          <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                bed
                              </i>
                              3 Bedroom
                            </li>
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                bathtub
                              </i>
                              2 Bath
                            </li>
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                straighten
                              </i>
                              550 Sq Ft
                            </li>
                          </ul>
                          <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3">
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar avatar-lg user-avatar">
                                <ImageWithBasePath
                                  src="assets/img/users/user-15.jpg"
                                  alt="image"
                                  className="rounded-circle"
                                />
                              </div>
                              <h6 className="mb-0 fs-16 fw-medium text-dark">
                                Maya Rivera
                                <span className="d-block fs-14 text-body pt-1">
                                  Japan
                                </span>{" "}
                              </h6>
                            </div>
                            <Link
                              to={all_routes.rentDetails}
                              className="btn btn-dark"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end card */}
                  </div>{" "}
                  {/* end col */}
                  {/* Items-7 */}
                  <div className="col-xl-4 col-lg-6 col-md-6 d-flex">
                    <div className="property-card mb-lg-0 flex-fill">
                      <div className="property-listing-item p-0 mb-0 shadow-none">
                        <div className="buy-grid-img mb-0 rounded-0">
                          <Link to={all_routes.buyDetails}>
                            <ImageWithBasePath
                              className="img-fluid"
                              src="assets/img/rent/rent-grid-img-07.jpg"
                              alt="image"
                            />
                          </Link>
                          <div className="d-flex align-items-center justify-content-between position-absolute bottom-0 end-0 start-0 p-3 z-1">
                            <h6 className="text-white mb-0">
                              $1800{" "}
                              <span className="fs-14 fw-normal"> / Night </span>
                            </h6>
                            <Link
                              to="#"
                              className={`favourite ${
                                selectedItems[6] ? "selected" : ""
                              }`}
                              key={6}
                              onClick={() => handleItemClick(6)}
                            >
                              <i
                                className={`material-icons-outlined ${
                                  selectedItems[6] ? "filled" : ""
                                }`}
                              >
                                {selectedItems[6]
                                  ? "favorite"
                                  : "favorite_border"}
                              </i>
                            </Link>
                          </div>
                        </div>
                        <div className="buy-grid-content">
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div className="d-flex align-items-center justify-content-center">
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
                              <span className="ms-1 fs-14">Excellent</span>
                            </div>
                            <span className="badge bg-secondary"> Villa</span>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-3">
                            <div>
                              <h6 className="title mb-1">
                                <Link to={all_routes.rentDetails}>
                                  Holiday Haven Homes
                                </Link>
                              </h6>
                              <p className="d-flex align-items-center fs-14 mb-0">
                                <i className="material-icons-outlined me-1 ms-0">
                                  location_on
                                </i>
                                88, Eucalypt Lane Suites, Sydney, Australia
                              </p>
                            </div>
                          </div>
                          <ul className="d-flex buy-grid-details d-flex mb-3 bg-light rounded p-3 justify-content-between align-items-center flex-wrap gap-1">
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                bed
                              </i>
                              2 Bedroom
                            </li>
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                bathtub
                              </i>
                              1 Bath
                            </li>
                            <li className="d-flex align-items-center gap-1">
                              <i className="material-icons-outlined bg-white text-secondary">
                                straighten
                              </i>
                              480 Sq Ft
                            </li>
                          </ul>
                          <div className="d-flex align-items-center justify-content-between flex-wrap border-top border-light-100 pt-3">
                            <div className="d-flex align-items-center gap-2">
                              <div className="avatar avatar-lg user-avatar">
                                <ImageWithBasePath
                                  src="assets/img/users/user-16.jpg"
                                  alt="image"
                                  className="rounded-circle"
                                />
                              </div>
                              <h6 className="mb-0 fs-16 fw-medium text-dark">
                                Marcus Bennett
                                <span className="d-block fs-14 text-body pt-1">
                                  Australia
                                </span>{" "}
                              </h6>
                            </div>
                            <Link
                              to={all_routes.rentDetails}
                              className="btn btn-dark"
                            >
                              Book Now
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>{" "}
                    {/* end card */}
                  </div>{" "}
                  {/* end col */}
                </div>
                {/* end tab */}
              </div>
            </div>
          </div>
          {/* End Content */}
        </div>
        {/* ========================
			End Page Content
		========================= */}
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
    </>
  );
};

export default Wishlist;
