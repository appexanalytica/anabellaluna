import { Link } from "react-router";
import ImageWithBasePath from "../../../../../core/imageWithBasePath";
import StickyBox from "react-sticky-box";
import { all_routes } from "../../../../routes/all_routes";
import { TimePicker, type TimePickerProps } from "antd";
import { useState } from "react";
import dayjs from "dayjs";

const BuyLeftForm = () => {
  const [activeTab, setActiveTab] = useState<"info" | "schedule">("info");

  const onChangeTime: TimePickerProps["onChange"] = () => {};
  return (
    <>
      {/* col end */}

      <div className="col-xl-4 theiaStickySidebar buy-details-item">
        {/* Items-1 */}
        <StickyBox offsetTop={80} offsetBottom={20}>
          {/* Items-1 */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Enquiry</h5>
            </div>
            <div className="card-body">
              {/* Bootstrap Tabs */}
              <div className="d-flex align-items-center justify-content-between gap-2 custom-btn flex-wrap">
                <Link
                  to="#"
                  className={`btn d-flex align-center fs-14 fw-semibold justify-content-center ${
                    activeTab === "info"
                      ? "btn-primary"
                      : "btn-outline-dark text-center"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("info");
                  }}
                >
                  <i className="material-icons-outlined fs-14 me-1 d-flex align-center">
                    info
                  </i>
                  Request Info{" "}
                </Link>
                <Link
                  to="#"
                  className={`btn d-flex align-center fs-14 fw-semibold justify-content-center ${
                    activeTab === "schedule"
                      ? "btn-primary"
                      : "btn-outline-dark text-center"
                  }`}
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveTab("schedule");
                  }}
                >
                  <i className="material-icons-outlined fs-14 me-1">videocam</i>
                  Schedule a Visit{" "}
                </Link>
              </div>

              <div className="tab-content">
                <div
                  className={`tab-pane fade ${
                    activeTab === "info" ? "show active" : ""
                  }`}
                >
                  <div className="card bg-light border-0 rounded shadow-none custom-btn">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar avatar-lg">
                          <ImageWithBasePath
                            src="assets/img/users/user-06.jpg"
                            alt="image"
                            className="rounded-circle"
                          />
                        </div>
                        <div>
                          <h6 className="mb-1 fs-16 fw-semibold">
                            Adrian Hendriques
                          </h6>
                          <p className="mb-0 fs-14 text-body">
                            {" "}
                            Company Agent{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end card */}
                  <div className="mb-3">
                    <label className="form-label fw-semibold"> Name </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold"> Email </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Email"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold"> Phone </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Phone Number"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      Description
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      defaultValue={""}
                    />
                  </div>
                  <div>
                    <Link to="#" className="btn btn-dark w-100 py-2 fs-14">
                      Submit
                    </Link>
                  </div>
                </div>
                <div
                  className={`tab-pane fade ${
                    activeTab === "schedule" ? "show active" : ""
                  }`}
                >
                  <div className="card bg-light border-0 rounded shadow-none custom-btn">
                    <div className="card-body">
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar avatar-lg">
                          <img
                            src="assets/img/users/user-06.jpg"
                            alt="image"
                            className="rounded-circle"
                          />
                        </div>
                        <div>
                          <h6 className="mb-1 fs-16 fw-semibold">
                            Adrian Hendriques
                          </h6>
                          <p className="mb-0 fs-14 text-body">
                            {" "}
                            Company Agent{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                  {/* end card */}
                  <div className="select-date-item">
                    <h6 className="fs-16 fw-semibold mb-2"> Select Day </h6>
                    <div className="d-flex align-items-center justify-content-between gap-1 flex-wrap">
                      <div className="d-flex flex-column gap-1 border">
                        <p className="mb-0"> Mon </p>
                        <h5 className="mb-0"> 21 </h5>
                        <p className="mb-0"> Feb </p>
                      </div>
                      <div className="d-flex flex-column gap-1 border">
                        <p className="mb-0"> Tue </p>
                        <h5 className="mb-0"> 22 </h5>
                        <p className="mb-0"> Feb </p>
                      </div>
                      <div className="d-flex flex-column gap-1 border">
                        <p className="mb-0"> Wed </p>
                        <h5 className="mb-0"> 23 </h5>
                        <p className="mb-0"> Feb </p>
                      </div>
                      <div className="d-flex flex-column gap-1 border">
                        <p className="mb-0"> Thu </p>
                        <h5 className="mb-0"> 24 </h5>
                        <p className="mb-0"> Feb </p>
                      </div>
                      <div className="d-flex flex-column gap-1 border">
                        <p className="mb-0"> Fri </p>
                        <h5 className="mb-0"> 25 </h5>
                        <p className="mb-0"> Feb </p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold">
                      {" "}
                      Select Time{" "}
                    </label>
                    <div className="input-group w-auto input-group-flat">
                      <TimePicker
                        className="form-control"
                        onChange={onChangeTime}
                        defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                        suffixIcon={null}
                      />

                      <span className="input-group-text">
                        <i className="material-icons-outlined text-dark">
                          schedule
                        </i>
                      </span>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold"> Name </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Name"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold"> Email </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Email"
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold"> Phone </label>
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Your Phone Number"
                    />
                  </div>
                  <div className="mb-4">
                    <label className="form-label fw-semibold">
                      {" "}
                      Description{" "}
                    </label>
                    <textarea
                      className="form-control"
                      rows={3}
                      defaultValue={""}
                    />
                  </div>
                  <div>
                    <Link to="#" className="btn btn-dark w-100 py-2 fs-14">
                      Submit
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* end card body*/}
          </div>
          {/* end card */}
          {/* Items-2 */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Listing Owner Details</h5>
            </div>
            <div className="card-body">
              <div className="d-flex align-items-center gap-2 mb-3">
                <div className="avatar avatar-lg">
                  <img
                    src="assets/img/users/user-06.jpg"
                    alt="image"
                    className="rounded-circle"
                  />
                </div>
                <div>
                  <h6 className="mb-1 fs-16 fw-semibold">John Carter</h6>
                  <div className="review-icons d-flex align-items-center">
                    <div className="me-1">
                      <i className="material-icons-outlined fs-14 text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined fs-14 text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined fs-14 text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined fs-14 text-warning">
                        star
                      </i>
                      <i className="material-icons-outlined fs-14 text-warning">
                        star
                      </i>
                    </div>
                    <p className="mb-0 fs-14 text-body">5.0 (12 Reviews) </p>
                  </div>
                </div>
              </div>
              <ul className="mb-3">
                <li className="d-flex align-center justify-content-between flex-wrap gap-1 mb-3">
                  <span className="text-body"> Phone</span> Call Us : +1 12545
                  45548
                </li>
                <li className="d-flex align-center justify-content-between flex-wrap gap-1 mb-3">
                  <span className="text-body">Email</span>info@example.com
                </li>
                <li className="d-flex align-center justify-content-between flex-wrap gap-1 mb-3">
                  <span className="text-body">No of Listings</span>05
                </li>
                <li className="d-flex align-center justify-content-between flex-wrap gap-1 mb-3">
                  <span className="text-body">No of Bookings</span>225
                </li>
                <li className="d-flex align-center justify-content-between flex-wrap gap-1 mb-3">
                  <span className="text-body">Member on</span>15 Jan2014
                </li>
                <li className="d-flex align-center justify-content-between flex-wrap gap-1 mb-0">
                  <span className="text-body">Verification</span>
                  <div className="badge bg-success text-white">Verified</div>
                </li>
              </ul>
              <div className="d-flex align-items-center justify-content-between gap-3">
                <Link
                  to="#"
                  className="btn btn-primary d-flex align-center fs-14 fw-medium w-100 justify-content-center"
                >
                  Whatsapp
                </Link>
                <Link
                  to="#"
                  className="btn btn-dark d-flex align-center fs-14 fw-medium w-100 text-center justify-content-center"
                >
                  Chat Now
                </Link>
              </div>
            </div>
            {/* end card body*/}
          </div>
          {/* end card */}
          {/* Items-3 */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Share Property</h5>
            </div>
            <div className="card-body">
              <div className="buy-social-icons-items d-flex align-center gap-2 flex-wrap">
                <Link to="#" className="item-1">
                  <i className="fa-brands fa-facebook-f" />
                </Link>
                <Link to="#" className="item-2">
                  <i className="fa-brands fa-instagram" />
                </Link>
                <Link to="#" className="item-3">
                  <i className="fa-brands fa-behance" />
                </Link>
                <Link to="#" className="item-4">
                  <i className="fa-brands fa-twitter" />
                </Link>
                <Link to="#" className="item-5">
                  <i className="fa-brands fa-pinterest-p" />
                </Link>
                <Link to="#" className="item-6">
                  <i className="fa-brands fa-linkedin" />
                </Link>
              </div>
            </div>
            {/* end card body*/}
          </div>
          {/* end card */}
          {/* Items-4 */}
          <div className="card">
            <div className="card-header">
              <h5 className="mb-0">Mortarage Calculator</h5>
            </div>
            <div className="card-body">
              <form>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Total Amount ($)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Total Amount "
                    defaultValue={15000}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Down Payment ($)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Down Payment"
                    defaultValue={10000}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Loan Terms (Years)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Loan Terms"
                    defaultValue={3}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-semibold">
                    Interest Rate (%)
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Your Interest Rate"
                    defaultValue={15}
                  />
                </div>
                <div className="mb-0">
                  <label className="form-label fw-semibold"> Min Sqft </label>
                  <input type="text" className="form-control" />
                </div>
              </form>
            </div>
            {/* end card body*/}
          </div>
          {/* end card */}
          {/* Items-5 */}
          <div className="card mb-0">
            <div className="custom-map position-relative">
              <Link
                to={all_routes.buyGridMap}
                className="btn btn-dark fw-medium"
              >
                View Location
              </Link>
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d9582106.12236644!2d-15.012343587457918!3d54.10244278649341!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x25a3b1142c791a9%3A0xc4f8a0433288257a!2sUnited%20Kingdom!5e0!3m2!1sen!2sin!4v1747587865989!5m2!1sen!2sin"
                width={600}
                height={450}
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
            <div className="card-body">
              <h6 className="mb-3"> Nearby Landmarks &amp; Visits </h6>
              <p className="mb-2 text-body">
                <i className="fa-regular fa-circle-check fs-16 me-2 text-body" />
                Near By Statue of Liberty
              </p>
              <p className="mb-2 text-body">
                <i className="fa-regular fa-circle-check fs-16 me-2 text-body" />
                The Metropolitan Museum of Art
              </p>
              <p className="mb-0 text-body">
                <i className="fa-regular fa-circle-check fs-16 me-2 text-body" />
                Yellowstone National Park
              </p>
            </div>
            {/* end card body*/}
          </div>
          {/* end card */}
        </StickyBox>
      </div>

      {/* col end */}
    </>
  );
};

export default BuyLeftForm;
