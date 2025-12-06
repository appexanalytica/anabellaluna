import { Link } from "react-router";
import Breadcrumb from "../../../../../core/common/Breadcrumb/breadcrumb";
import { all_routes } from "../../../../routes/all_routes";
import { TimePicker, type TimePickerProps } from "antd";
import dayjs from "dayjs";

const RentalBooking = () => {
  const onChangeTime: TimePickerProps["onChange"] = (time, timeString) => {
    console.log(time, timeString);
  };

  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb
          title="Rental Booking"
          paths={[{ label: "Rental Booking", active: true }]}
        />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row">
              <div className="col-lg-10 mx-auto">
                <div className="booking-wrap">
                  <div className="booking-item-01">
                    <p className="d-inline-flex align-items-center mb-0">
                      <i className="material-icons-outlined me-1">
                        check_circle
                      </i>
                      Modern apartment in the city centre is available for
                      rental
                    </p>
                  </div>
                </div>
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
                <div className="card">
                  <div className="card-body">
                    <div className="details-time">
                      <div className="row row-gap-3">
                        <div className="col-xl-6">
                          <div className="arrival-div">
                            <h5>Arrival Time</h5>
                            <ul>
                              <li>
                                <input
                                  type="radio"
                                  id="radio1"
                                  name="Arrival"
                                />
                                <label htmlFor="radio1">
                                  Tue<span>21</span>Feb
                                </label>
                              </li>
                              <li>
                                <input
                                  type="radio"
                                  id="radio2"
                                  name="Arrival"
                                  defaultChecked
                                />
                                <label htmlFor="radio2">
                                  Wed<span>22</span>Feb
                                </label>
                              </li>
                              <li>
                                <input
                                  type="radio"
                                  id="radio3"
                                  name="Arrival"
                                />
                                <label htmlFor="radio3">
                                  Thur<span>23</span>Feb
                                </label>
                              </li>
                              <li>
                                <input
                                  type="radio"
                                  id="radio4"
                                  name="Arrival"
                                />
                                <label htmlFor="radio4">
                                  Feb<span>24</span>Feb
                                </label>
                              </li>
                              <li>
                                <input
                                  type="radio"
                                  id="radio5"
                                  name="Arrival"
                                />
                                <label htmlFor="radio5">
                                  Sat<span>25</span>Feb
                                </label>
                              </li>
                            </ul>
                          </div>
                          <div className="mb-0">
                            <label className="form-label">Select Time</label>
                            <TimePicker
                              className="form-control"
                              onChange={onChangeTime}
                              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                            />
                          </div>
                        </div>
                        <div className="col-xl-6">
                          <div className="arrival-div arrival-dept">
                            <h5>Departure Time</h5>
                            <ul>
                              <li>
                                <input
                                  type="radio"
                                  id="Departure1"
                                  name="Departure"
                                />
                                <label htmlFor="Departure1">
                                  Tue<span>21</span>Feb
                                </label>
                              </li>
                              <li>
                                <input
                                  type="radio"
                                  id="Departure2"
                                  name="Departure"
                                  defaultChecked
                                />
                                <label htmlFor="Departure2">
                                  Wed<span>22</span>Feb
                                </label>
                              </li>
                              <li>
                                <input
                                  type="radio"
                                  id="Departure3"
                                  name="Departure"
                                />
                                <label htmlFor="Departure3">
                                  Thur<span>23</span>Feb
                                </label>
                              </li>
                              <li>
                                <input
                                  type="radio"
                                  id="Departure4"
                                  name="Departure"
                                />
                                <label htmlFor="Departure4">
                                  Feb<span>24</span>Feb
                                </label>
                              </li>
                              <li>
                                <input
                                  type="radio"
                                  id="Departure5"
                                  name="Departure"
                                />
                                <label htmlFor="Departure5">
                                  Sat<span>25</span>Feb
                                </label>
                              </li>
                            </ul>
                          </div>
                          <div className="review-form mb-0">
                            <label className="form-label">Select Time</label>
                            <TimePicker
                              className="form-control"
                              onChange={onChangeTime}
                              defaultOpenValue={dayjs("00:00:00", "HH:mm:ss")}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="card border-0 shadow-none bg-light">
                  <div className="card-body">
                    <div className="row align-items-center justify-content-end">
                      <div className="col-lg-4">
                        {/* start row */}
                        <div className="row row-gap-1 mb-2">
                          <div className="col-6 text-end">
                            <p className="mb-0">Booking Price</p>
                          </div>
                          <div className="col-6 text-end">
                            <p className="fw-semibold mb-0">$300</p>
                          </div>
                        </div>
                        {/* end row */}
                        {/* start row */}
                        <div className="row row-gap-1 mb-2">
                          <div className="col-6 text-end">
                            <p className="mb-0">Service Charge</p>
                          </div>
                          <div className="col-6 text-end">
                            <p className="fw-semibold mb-0">$10</p>
                          </div>
                        </div>
                        {/* end row */}
                        {/* start row */}
                        <div className="row row-gap-1">
                          <div className="col-6 text-end">
                            <p className="mb-0">Tax</p>
                          </div>
                          <div className="col-6 text-end">
                            <p className="fw-semibold mb-0">$5</p>
                          </div>
                        </div>
                        {/* end row */}
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
                <div className="card border-0 shadow-none bg-light">
                  <div className="card-body">
                    <div className="row align-items-center justify-content-end">
                      <div className="col-lg-4">
                        {/* start row */}
                        <div className="row mb-2">
                          <div className="col-6 text-end">
                            <h6 className="mb-0">Booking Price</h6>
                          </div>
                          <div className="col-6 text-end">
                            <h6 className="mb-0">$300</h6>
                          </div>
                        </div>
                        {/* end row */}
                      </div>
                    </div>
                  </div>
                  {/* end card body */}
                </div>
                {/* end card */}
                <div className="d-flex align-items-center justify-content-end">
                  <Link
                    to={all_routes.rentDetails}
                    className="btn btn-dark me-2"
                  >
                    Previous
                  </Link>
                  <Link
                    to={all_routes.rentalOrderDetails}
                    className="btn btn-primary me-2"
                  >
                    Go to Order Details
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
    </>
  );
};

export default RentalBooking;
