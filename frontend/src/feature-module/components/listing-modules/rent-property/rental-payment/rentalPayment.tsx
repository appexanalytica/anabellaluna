import { Link } from "react-router";
import Breadcrumb from "../../../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import { useState } from "react";
import { Years } from "../../../../../core/common/selectOption";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";
import { DatePicker } from "antd";
import Modal from "./modal/modal";
import { all_routes } from "../../../../routes/all_routes";
type PasswordField = "password" | "confirmPassword";

const RentalPayment = () => {
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Rental Payment"
          paths={[{ label: "Rental Payment", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <div className="card border-0 bg-light shadow-none">
                  <div className="card-body">
                    {/* start row */}
                    <div className="row row-gap-3">
                      <div className="col-lg-5">
                        <p className="fw-semibold text-dark mb-1">Details</p>
                        <p className="fs-14 mb-0">
                          Modern Apartment in the city centre
                        </p>
                      </div>
                      {/* end col */}
                      <div className="col-lg-5">
                        <p className="fw-semibold text-dark mb-1">Location</p>
                        <p className="fs-14 mb-0">
                          318-330 S Oakley Blvd, Chicago, IL 60612, USA
                        </p>
                      </div>
                      {/* end col */}
                      <div className="col-lg-2">
                        <p className="fw-semibold text-dark mb-1">
                          Booking Amount
                        </p>
                        <h4 className="text-primary mb-0">
                          $300{" "}
                          <span className="text-dark fs-14 fw-normal">
                            / Day
                          </span>
                        </h4>
                      </div>
                      {/* end col */}
                    </div>
                    {/* end row */}
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
                <div className="card mb-5">
                  <div className="card-body">
                    <h6 className="mb-3">Choose Payment Method</h6>
                    <div className="rental-payment-wrap">
                      <ul className="nav nav-tabs">
                        <li className="nav-item">
                          <Link
                            className="nav-link mb-4"
                            to="#"
                            data-bs-toggle="tab"
                            data-bs-target="#tab1"
                          >
                            <ImageWithBasePath
                              src="assets/img/payment/paypal.svg"
                              alt="img"
                              className="img-fluid"
                            />
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link mb-4"
                            to="#"
                            data-bs-toggle="tab"
                            data-bs-target="#tab2"
                          >
                            <ImageWithBasePath
                              src="assets/img/payment/stripe.svg"
                              alt="img"
                              className="img-fluid"
                            />
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link active mb-4"
                            to="#"
                            data-bs-toggle="tab"
                            data-bs-target="#tab3"
                          >
                            <ImageWithBasePath
                              src="assets/img/payment/credit-card.svg"
                              alt="img"
                              className="img-fluid"
                            />
                          </Link>
                        </li>
                        <li className="nav-item">
                          <Link
                            className="nav-link mb-4"
                            to="#"
                            data-bs-toggle="tab"
                            data-bs-target="#tab4"
                          >
                            <ImageWithBasePath
                              src="assets/img/payment/wallet.svg"
                              alt="img"
                              className="img-fluid"
                            />
                          </Link>
                        </li>
                      </ul>
                      <div className="tab-content">
                        <div
                          className="tab-pane"
                          id="tab1"
                          role="tabpanel"
                          tabIndex={0}
                        >
                          <div>
                            <h6>Add New Paypal</h6>
                            {/* start row */}
                            <div className="row row-gap-3">
                              <div className="col-lg-6">
                                <div className="mb-0">
                                  <label className="form-label">
                                    Email
                                    <span className="text-danger ms-1">*</span>
                                  </label>
                                  <div className="form-cover">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter your email"
                                    />
                                    <i className="material-icons-outlined">
                                      mail
                                    </i>
                                  </div>
                                </div>
                              </div>
                              {/* end col */}
                              <div className="col-lg-6">
                                <div className="mb-0">
                                  <label className="form-label">
                                    Password
                                    <span className="text-danger ms-1">*</span>
                                  </label>
                                  <div className="position-relative form-cover password">
                                    <input
                                      type={
                                        passwordVisibility.password
                                          ? "text"
                                          : "password"
                                      }
                                      className="pass-input form-control"
                                    />
                                    <i className="material-icons-outlined">
                                      lock
                                    </i>
                                    <span
                                      className={`fas toggle-password text-dark fs-12 ${
                                        passwordVisibility.password
                                          ? "fa-eye"
                                          : "fa-eye-slash"
                                      }`}
                                      onClick={() =>
                                        togglePasswordVisibility("password")
                                      }
                                    ></span>
                                  </div>
                                </div>
                              </div>
                              {/* end col */}
                            </div>
                            {/* end row */}
                          </div>
                        </div>
                        <div
                          className="tab-pane"
                          id="tab2"
                          role="tabpanel"
                          tabIndex={0}
                        >
                          <div>
                            <h6>Add New Stripe</h6>
                            {/* start row */}
                            <div className="row row-gap-3">
                              <div className="col-lg-6">
                                <div className="mb-0">
                                  <label className="form-label">
                                    Email
                                    <span className="text-danger ms-1">*</span>
                                  </label>
                                  <div className="form-cover">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter your email"
                                    />
                                    <i className="material-icons-outlined">
                                      mail
                                    </i>
                                  </div>
                                </div>
                              </div>
                              {/* end col */}
                              <div className="col-lg-6">
                                <div className="mb-0">
                                  <label className="form-label">
                                    Password
                                    <span className="text-danger ms-1">*</span>
                                  </label>
                                  <div className="position-relative form-cover password">
                                    <input
                                      type={
                                        passwordVisibility.password
                                          ? "text"
                                          : "password"
                                      }
                                      className="pass-input form-control"
                                    />
                                    <i className="material-icons-outlined">
                                      lock
                                    </i>
                                    <span
                                      className={`fas toggle-password text-dark fs-12 ${
                                        passwordVisibility.password
                                          ? "fa-eye"
                                          : "fa-eye-slash"
                                      }`}
                                      onClick={() =>
                                        togglePasswordVisibility("password")
                                      }
                                    ></span>
                                  </div>
                                </div>
                              </div>
                              {/* end col */}
                            </div>
                            {/* end row */}
                          </div>
                        </div>
                        <div
                          className="tab-pane active"
                          id="tab3"
                          role="tabpanel"
                          tabIndex={0}
                        >
                          <div>
                            <h6>Add New Card</h6>
                            {/* start row */}
                            <div className="row row-gap-3">
                              <div className="col-lg-4">
                                <div className="mb-0">
                                  <label className="form-label">
                                    Card Number
                                    <span className="text-danger ms-1">*</span>
                                  </label>
                                  <input type="text" className="form-control" />
                                </div>
                              </div>
                              {/* end col */}
                              <div className="col-lg-4">
                                <div className="mb-0">
                                  <label className="form-label">
                                    Card Holder Name
                                    <span className="text-danger ms-1">*</span>
                                  </label>
                                  <input type="text" className="form-control" />
                                </div>
                              </div>
                              {/* end col */}
                              <div className="col-lg-4">
                                <div className="mb-0">
                                  <label className="form-label">
                                    Date
                                    <span className="text-danger ms-1">*</span>
                                  </label>
                                  <div className="input-group input-group-flat mb-3">
                                    <DatePicker
                                      className="form-control"
                                      suffixIcon={null}
                                    />
                                    <span className="input-group-text border-0">
                                      <i className="material-icons-outlined text-dark">
                                        calendar_today
                                      </i>
                                    </span>
                                  </div>
                                </div>
                              </div>
                              {/* end col */}
                              <div className="col-lg-4">
                                <div className="mb-0">
                                  <label className="form-label">
                                    Year
                                    <span className="text-danger ms-1">*</span>
                                  </label>
                                  <CommonSelect
                                    options={Years}
                                    className="select"
                                    defaultValue={Years[0]}
                                  />
                                </div>
                              </div>
                              {/* end col */}
                              <div className="col-lg-4">
                                <div className="mb-0">
                                  <label className="form-label">
                                    CVV
                                    <span className="text-danger ms-1">*</span>
                                  </label>
                                  <input type="text" className="form-control" />
                                </div>
                              </div>
                              {/* end col */}
                            </div>
                            {/* end row */}
                          </div>
                        </div>
                        <div
                          className="tab-pane"
                          id="tab4"
                          role="tabpanel"
                          tabIndex={0}
                        >
                          <div>
                            <h6>Add New Wallet</h6>
                            {/* start row */}
                            <div className="row row-gap-3">
                              <div className="col-lg-6">
                                <div className="mb-0">
                                  <label className="form-label">
                                    User Name
                                    <span className="text-danger ms-1">*</span>
                                  </label>
                                  <div className="form-cover">
                                    <input
                                      type="text"
                                      className="form-control"
                                      placeholder="Enter Name"
                                    />
                                    <i className="material-icons-outlined">
                                      person
                                    </i>
                                  </div>
                                </div>
                              </div>
                              {/* end col */}
                              <div className="col-lg-6">
                                <div className="mb-0">
                                  <label className="form-label">
                                    Password
                                    <span className="text-danger ms-1">*</span>
                                  </label>
                                  <div className="position-relative form-cover password">
                                    <input
                                      type={
                                        passwordVisibility.password
                                          ? "text"
                                          : "password"
                                      }
                                      className="pass-input form-control"
                                    />
                                    <i className="material-icons-outlined">
                                      lock
                                    </i>
                                    <span
                                      className={`fas toggle-password text-dark fs-12 ${
                                        passwordVisibility.password
                                          ? "fa-eye"
                                          : "fa-eye-slash"
                                      }`}
                                      onClick={() =>
                                        togglePasswordVisibility("password")
                                      }
                                    ></span>
                                  </div>
                                </div>
                              </div>
                              {/* end col */}
                            </div>
                            {/* end row */}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
                <div className="d-flex align-items-center justify-content-end">
                  <Link
                    to={all_routes.rentalOrderConfirmation}
                    className="btn btn-dark me-2"
                  >
                    Go Back
                  </Link>
                  <Link
                    to="#"
                    data-bs-toggle="modal"
                    data-bs-target="#payment-success"
                    className="btn btn-primary me-2"
                  >
                    Book Now
                  </Link>
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
      <Modal />
    </>
  );
};

export default RentalPayment;
