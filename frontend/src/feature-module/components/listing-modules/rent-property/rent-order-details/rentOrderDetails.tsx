import { Link } from "react-router"
import Breadcrumb from "../../../../../core/common/Breadcrumb/breadcrumb"
import { all_routes } from "../../../../routes/all_routes"
import { useState } from "react"
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";

const RentOrderDetails = () => {
 const [phone, setPhone] = useState<string | undefined>()
  return (
   <>
  {/* ========================
			Start Page Content
		========================= */}
  <div className="page-wrapper">
    {/* Start Breadscrumb */}
   <Breadcrumb
          title="Rental Order Details"
          paths={[
            { label: "Shop", link: "/shop" },
            { label: "Rental Order Details", active: true },
          ]}
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
                  <i className="material-icons-outlined me-1">check_circle</i>
                  Modern apartment in the city centre is available for rental
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
                    <p className="fw-semibold text-dark mb-1">Booking Amount</p>
                    <h4 className="text-primary mb-0">
                      $300{" "}
                      <span className="text-dark fs-14 fw-normal">/ Day</span>
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
                <h6 className="mb-3">Property Booking Details</h6>
                <div className="d-flex align-items-center flex-wrap gap-2">
                  <div className="me-5">
                    <p className="fw-semibold text-dark mb-1">Arrival Time</p>
                    <p className="mb-0">21 Mar, 2025 - 10:00 AM</p>
                  </div>
                  <div>
                    <p className="fw-semibold text-dark mb-1">Departure Time</p>
                    <p className="mb-0">22 Mar, 2025 - 10:00 AM</p>
                  </div>
                </div>
              </div>
              {/* end card body */}
            </div>
            {/* end card */}
            <div className="card mb-5">
              <div className="card-body">
                <h6 className="mb-3">Fill Out This Quick Form</h6>
                {/* start row */}
                <div className="row">
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Name<span className="text-danger ms-1">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Phone Number<span className="text-danger ms-1">*</span>
                      </label>
                      <PhoneInput
                            defaultCountry="US"
                            value={phone}
                            onChange={setPhone}
                          
                          />

                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label">
                        Email Address<span className="text-danger ms-1">*</span>
                      </label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">Full Address</label>
                      <input type="text" className="form-control" />
                    </div>
                  </div>
                  {/* end col */}
                  <div className="col-md-12">
                    <div className="mb-3">
                      <label className="form-label">
                        Special Requests / Questions / Comments
                      </label>
                      <textarea
                        className="form-control"
                        rows={3}
                        placeholder="Type here..."
                        defaultValue={""}
                      />
                    </div>
                  </div>
                  {/* end col */}
                </div>
                {/* end row */}
              </div>
              {/* end card body */}
            </div>
            {/* end card */}
            <div className="d-flex align-items-center justify-content-end">
              <Link to={all_routes.rentBooking} className="btn btn-dark me-2">
                Back to Booking Details
              </Link>
              <Link
                to={all_routes.rentalOrderConfirmation}
                className="btn btn-primary me-2"
              >
                Go to Order Confirmation
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

  )
}

export default RentOrderDetails