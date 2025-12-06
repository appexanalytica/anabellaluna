import { Link } from "react-router";
import ImageWithBasePath from "../../../../core/imageWithBasePath";
import { all_routes } from "../../../routes/all_routes";
import Breadcrumb from "../../../../core/common/Breadcrumb/breadcrumb";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import { useState } from "react";
import { City, Country, State } from "../../../../core/common/selectOption";
import CommonSelect from "../../../../core/common/common-select/commonSelect";
import Modal from "./modal/modal";
import { DatePicker } from "antd";

const Checkout = () => {
  const [phone, setPhone] = useState<string | undefined>();
  const [paymentTab, setPaymentTab] = useState<"credit" | "paypal" | "stripe">(
    "credit"
  ); // <-- Add this line

  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Checkout"
          paths={[{ label: "Checkout", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row">
              <div className="col-lg-12 mx-auto">
                <div className="checkout-wrap">
                  {/* start row */}
                  <div className="row row-gap-3">
                    <div className="col-xl-9">
                      <div className="checkout-item-01">
                        <h6>Personal info</h6>
                        {/* start row */}
                        <div className="row">
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label className="form-label">
                                First Name
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Last Name
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Email Address
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label className="form-label">
                                Phone Number
                                <span className="text-danger ms-1">*</span>
                              </label>
                              <PhoneInput
                                defaultCountry="US"
                                value={phone}
                                onChange={setPhone}
                              />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-12">
                            <div className="mb-3">
                              <label className="form-label">Address</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-12">
                            <div className="mb-3">
                              <label className="form-label">
                                Address 2 (Optional)
                              </label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label className="form-label">Country</label>
                              <CommonSelect
                                options={Country}
                                className="select"
                                defaultValue={Country[0]}
                              />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label className="form-label">State</label>
                              <CommonSelect
                                options={State}
                                className="select"
                                defaultValue={State[0]}
                              />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label className="form-label">City</label>
                              <CommonSelect
                                options={City}
                                className="select"
                                defaultValue={City[0]}
                              />
                            </div>
                          </div>
                          {/* end col */}
                          <div className="col-lg-6">
                            <div className="mb-3">
                              <label className="form-label">Zipcode</label>
                              <input type="text" className="form-control" />
                            </div>
                          </div>
                          {/* end col */}
                        </div>
                        {/* end row */}
                        <hr />
                        <h6 className="tab-head">Contact Info</h6>
                        <ul className="nav nav-tabs mb-3">
                          <li className="nav-item">
                            <input
                              type="radio"
                              id="credit"
                              name="pay-tab"
                              checked={paymentTab === "credit"}
                              onChange={() => setPaymentTab("credit")}
                            />
                            <label
                              className={`nav-link${
                                paymentTab === "credit" ? " active" : ""
                              }`}
                              htmlFor="credit"
                              data-bs-target="#tab1"
                              style={{ cursor: "pointer" }}
                            >
                              Credit / Debit Card
                            </label>
                          </li>
                          <li className="nav-item">
                            <input
                              type="radio"
                              id="paypal"
                              name="pay-tab"
                              checked={paymentTab === "paypal"}
                              onChange={() => setPaymentTab("paypal")}
                            />
                            <label
                              className={`nav-link${
                                paymentTab === "paypal" ? " active" : ""
                              }`}
                              htmlFor="paypal"
                              data-bs-target="#tab2"
                              style={{ cursor: "pointer" }}
                            >
                              PayPal
                            </label>
                          </li>
                          <li className="nav-item">
                            <input
                              type="radio"
                              id="stripe"
                              name="pay-tab"
                              checked={paymentTab === "stripe"}
                              onChange={() => setPaymentTab("stripe")}
                            />
                            <label
                              className={`nav-link${
                                paymentTab === "stripe" ? " active" : ""
                              }`}
                              htmlFor="stripe"
                              data-bs-target="#tab3"
                              style={{ cursor: "pointer" }}
                            >
                              Stripe
                            </label>
                          </li>
                        </ul>
                        <div className="tab-content mb-3">
                          <div
                            className={`tab-pane fade${
                              paymentTab === "credit" ? " show active" : ""
                            }`}
                            id="tab1"
                          >
                            <div className="checkout-item-03">
                              <h6>Payment With Credit Card</h6>
                              {/* start row */}
                              <div className="row">
                                <div className="col-md-6 col-lg-4">
                                  <div className="card">
                                    <div className="card-body">
                                      <div className="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                          <ImageWithBasePath
                                            src="assets/img/icons/visa.svg"
                                            alt="image"
                                            className="img-fluid mb-2"
                                          />
                                          <p className="mb-0">
                                            **** **** **** 2547
                                          </p>
                                        </div>
                                        <div className="d-flex align-items-center">
                                          <Link
                                            to="#"
                                            className="btn btn-light rounded-circle me-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#edit_card"
                                          >
                                            <i className="material-icons-outlined">
                                              edit
                                            </i>
                                          </Link>
                                          <Link
                                            to="#"
                                            className="btn btn-light rounded-circle"
                                            data-bs-toggle="modal"
                                            data-bs-target="#delete_card"
                                          >
                                            <i className="material-icons-outlined">
                                              delete
                                            </i>
                                          </Link>
                                        </div>
                                      </div>
                                      <div className="expiry-time">
                                        <p>Expiry</p>
                                        <span>May 2028</span>
                                      </div>
                                    </div>
                                    {/* end card body */}
                                  </div>
                                  {/* end card */}
                                </div>
                                {/* end col */}
                                <div className="col-md-6 col-lg-4">
                                  <div className="card">
                                    <div className="card-body">
                                      <div className="d-flex align-items-center justify-content-between mb-2">
                                        <div>
                                          <ImageWithBasePath
                                            src="assets/img/icons/rupay.svg"
                                            alt="image"
                                            className="img-fluid mb-2"
                                          />
                                          <p className="mb-0">
                                            **** **** **** 2547
                                          </p>
                                        </div>
                                        <div className="d-flex align-items-center">
                                          <Link
                                            to="#"
                                            className="btn btn-light rounded-circle me-2"
                                            data-bs-toggle="modal"
                                            data-bs-target="#edit_card"
                                          >
                                            <i className="material-icons-outlined">
                                              edit
                                            </i>
                                          </Link>
                                          <Link
                                            to="#"
                                            className="btn btn-light rounded-circle"
                                            data-bs-toggle="modal"
                                            data-bs-target="#delete_card"
                                          >
                                            <i className="material-icons-outlined">
                                              delete
                                            </i>
                                          </Link>
                                        </div>
                                      </div>
                                      <div className="expiry-time">
                                        <p>Expiry</p>
                                        <span>May 2028</span>
                                      </div>
                                    </div>
                                    {/* end card body */}
                                  </div>
                                  {/* end card */}
                                </div>
                                {/* end col */}
                                <div className="col-md-6 col-lg-4 d-flex">
                                  <div className="card bg-light flex-fill">
                                    <div className="card-body">
                                      <div className="d-flex align-items-center justify-content-center h-100">
                                        <Link
                                          to="#"
                                          className="btn btn-white d-inline-flex align-items-center justify-content-center p-2 rounded-circle"
                                          data-bs-toggle="modal"
                                          data-bs-target="#add_card"
                                        >
                                          <i className="material-icons-outlined">
                                            add
                                          </i>
                                        </Link>
                                      </div>
                                    </div>
                                    {/* end card body */}
                                  </div>
                                  {/* end card */}
                                </div>
                                {/* end col */}
                              </div>
                              {/* end row */}
                            </div>
                            {/* start row */}
                            <div className="row row-gap-2">
                              <div className="col-lg-6">
                                <div className="checkout-item-04">
                                  <div className="mb-0">
                                    <label className="form-label">
                                      Card Holder Name
                                    </label>
                                    <div className=" form-cover">
                                      <input
                                        type="text"
                                        className="form-control"
                                      />
                                      <i className="material-icons-outlined">
                                        person
                                      </i>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* end col */}
                              <div className="col-lg-6">
                                <div className="checkout-item-04">
                                  <div className="mb-0">
                                    <label className="form-label">
                                      Card Number
                                    </label>
                                    <div className=" form-cover">
                                      <input
                                        type="text"
                                        className="form-control"
                                      />
                                      <i className="material-icons-outlined">
                                        account_balance_wallet
                                      </i>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* end col */}
                              <div className="col-lg-6">
                                <div className="checkout-item-04">
                                  <div className="mb-0">
                                    <label className="form-label">
                                      Expiry Date
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
                              </div>
                              {/* end col */}
                              <div className="col-lg-6">
                                <div className="checkout-item-04">
                                  <div className="mb-0">
                                    <label className="form-label">CVV</label>
                                    <div className=" form-cover">
                                      <input
                                        type="text"
                                        className="form-control"
                                      />
                                      <i className="material-icons-outlined">
                                        fact_check
                                      </i>
                                    </div>
                                  </div>
                                </div>
                              </div>
                              {/* end col */}
                            </div>
                            {/* end row */}
                          </div>
                          <div
                            className={`tab-pane fade${
                              paymentTab === "paypal" ? " show active" : ""
                            }`}
                            id="tab2"
                          >
                            <div className="checkout-item-03">
                              <h6>Payment With PayPal</h6>
                              {/* start row */}
                              <div className="row row-gap-2">
                                <div className="col-lg-6">
                                  <div className="checkout-item-04">
                                    <div className="mb-0">
                                      <label className="form-label">
                                        Email
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
                                </div>
                                {/* end col */}
                                <div className="col-lg-6">
                                  <div className="checkout-item-04">
                                    <div className="mb-0">
                                      <label className="form-label">
                                        Password
                                      </label>
                                      <div className="position-relative form-cover password">
                                        <input
                                          type="password"
                                          className="pass-inputs form-control"
                                        />
                                        <i className="material-icons-outlined">
                                          lock
                                        </i>
                                        <span className="fas toggle-passwords fa-eye-slash" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* end col */}
                              </div>
                              {/* end row */}
                            </div>
                          </div>
                          <div
                            className={`tab-pane fade${
                              paymentTab === "stripe" ? " show active" : ""
                            }`}
                            id="tab3"
                          >
                            <div className="checkout-item-03">
                              <h6>Payment With Stripe</h6>
                              {/* start row */}
                              <div className="row row-gap-2">
                                <div className="col-lg-6">
                                  <div className="checkout-item-04">
                                    <div className="mb-0">
                                      <label className="form-label">
                                        Email
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
                                </div>
                                {/* end col */}
                                <div className="col-lg-6">
                                  <div className="checkout-item-04">
                                    <div className="mb-0">
                                      <label className="form-label">
                                        Password
                                      </label>
                                      <div className="position-relative form-cover password">
                                        <input
                                          type="password"
                                          className="pass-inputs form-control"
                                        />
                                        <i className="material-icons-outlined">
                                          lock
                                        </i>
                                        <span className="fas toggle-passwords fa-eye-slash" />
                                      </div>
                                    </div>
                                  </div>
                                </div>
                                {/* end col */}
                              </div>
                              {/* end row */}
                            </div>
                          </div>
                        </div>
                        <div className="d-flex align-items-center justify-content-end flex-wrap gap-3 pay-submit">
                          <Link to={all_routes.cart} className="btn btn-dark">
                            Back to Cart
                          </Link>
                          <Link
                            to="#"
                            className="btn btn-primary"
                            data-bs-toggle="modal"
                            data-bs-target="#payment-success"
                          >
                            Confirm &amp; Pay $8395
                          </Link>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-xl-3 theiaStickySidebar">
                      <div className="checkout-item-02">
                        <div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <p className="mb-0">Subtotal</p>
                            <span>$7300</span>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <p className="mb-0">Service Charge</p>
                            <span>$365</span>
                          </div>
                          <div className="d-flex align-items-center justify-content-between mb-2">
                            <p className="mb-0">Tax</p>
                            <span>$730</span>
                          </div>
                        </div>
                        <hr />
                        <div className="d-flex align-items-center justify-content-between">
                          <h6 className="mb-0">Payable Amount</h6>
                          <h6 className="mb-0">$8395</h6>
                        </div>
                        <hr />
                        <div className="mb-0">
                          <label className="form-label">Promo Code</label>
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              className="form-control me-1"
                              placeholder="Type here..."
                            />
                            <Link to="#" className="btn btn-lg btn-dark">
                              Apply
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                  </div>
                  {/* end row */}
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

export default Checkout;
