import { Link } from "react-router";
import { all_routes } from "../../../../routes/all_routes";
import { DatePicker } from "antd";

const Modal = () => {
  return (
    <>
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

      {/* Start Add Modal */}
      <div id="add_card" className="modal fade">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h4 className="text-dark modal-title fw-bold">Add New Card</h4>
                <button
                  type="button"
                  className="btn-close btn-close-modal custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="material-icons-outlined">close</i>
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Card Number<span className="text-danger ms-1">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Expiration Date<span className="text-danger ms-1">*</span>
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
                <div className="mb-0">
                  <label className="form-label">
                    CVV<span className="text-danger ms-1">*</span>
                  </label>
                  <input type="text" className="form-control" />
                </div>
              </div>
              <div className="modal-body border-top">
                <div className="d-flex align-items-center justify-content-end">
                  <button
                    type="button"
                    className="btn btn-lg btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-lg btn-primary">
                    Add New Card
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* End Add Modal */}
      {/* Start Add Modal */}
      <div id="edit_card" className="modal fade">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <form>
              <div className="modal-header">
                <h4 className="text-dark modal-title fw-bold">Edit Card</h4>
                <button
                  type="button"
                  className="btn-close btn-close-modal custom-btn-close"
                  data-bs-dismiss="modal"
                  aria-label="Close"
                >
                  <i className="material-icons-outlined">close</i>
                </button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label">
                    Card Number<span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue="1234 5678 9876 5432"
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">
                    Expiration Date<span className="text-danger ms-1">*</span>
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
                <div className="mb-0">
                  <label className="form-label">
                    CVV<span className="text-danger ms-1">*</span>
                  </label>
                  <input
                    type="text"
                    className="form-control"
                    defaultValue={645}
                  />
                </div>
              </div>
              <div className="modal-body border-top">
                <div className="d-flex align-items-center justify-content-end">
                  <button
                    type="button"
                    className="btn btn-lg btn-light me-2"
                    data-bs-dismiss="modal"
                  >
                    Close
                  </button>
                  <button type="submit" className="btn btn-lg btn-primary">
                    Save Changes
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
      {/* End Add Modal */}
      {/* Start Delete Modal  */}
      <div className="modal fade" id="delete_card">
        <div className="modal-dialog modal-dialog-centered modal-sm">
          <div className="modal-content">
            <div className="modal-body text-center">
              <div className="mb-3">
                <span className="avatar avatar-lg bg-danger rounded-circle text-white">
                  <i className="material-icons-outlined fs-24">delete</i>
                </span>
              </div>
              <h6 className="mb-1">Delete Confirmation</h6>
              <p className="mb-3">Are you sure want to delete?</p>
              <div className="d-flex justify-content-center">
                <Link
                  to="#"
                  className="btn btn-light position-relative z-1 me-3"
                  data-bs-dismiss="modal"
                >
                  Cancel
                </Link>
                <Link
                  to={all_routes.checkout}
                  className="btn btn-danger position-relative z-1"
                >
                  Yes, Delete
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Delete Modal  */}
      {/* Start Success Modal  */}
      <div className="modal fade" id="payment-success">
        <div className="modal-dialog modal-dialog-centered modal-md">
          <div className="modal-content payment">
            <div className="modal-body text-center">
              <div className="mb-3">
                <span className="avatar avatar-lg bg-success rounded-circle text-white">
                  <i className="material-icons-outlined fs-24">done_all</i>
                </span>
              </div>
              <h6 className="mb-2">Payment Successful</h6>
              <p className="mb-2">You Payment has been successfully done.</p>
              <p className="mb-4">Trasaction Id : #5064164454</p>
              <div className="d-flex justify-content-center">
                <Link to={all_routes.index} className="btn btn-lg btn-dark">
                  Back to Home
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* End Success Modal  */}
    </>
  );
};

export default Modal;
