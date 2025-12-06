import { Link } from "react-router";
import { all_routes } from "../../../../../routes/all_routes";

const Modal = () => {
  return (
    <>
      {/* Start Delete Modal  */}
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
      {/* End Delete Modal  */}
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
              <form
                className="search-form"
                id="search-form"
              >
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
                    <Link to={all_routes.rentPropertyGrid}>Beautiful Condo Room</Link>
                  </p>
                  <p>
                    <Link to={all_routes.rentPropertyGrid}>Royal Apartment</Link>
                  </p>
                  <p>
                    <Link to={all_routes.rentPropertyGrid}>Grand Villa House</Link>
                  </p>
                  <p>
                    <Link to={all_routes.rentPropertyGrid}>Grand Mahaka</Link>
                  </p>
                  <p>
                    <Link to={all_routes.rentPropertyGrid}>Lunaria Residence</Link>
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
    </>
  );
};

export default Modal;
