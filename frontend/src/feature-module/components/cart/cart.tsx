import { Link } from "react-router";
import Breadcrumb from "../../../core/common/Breadcrumb/breadcrumb";
import ImageWithBasePath from "../../../core/imageWithBasePath";
import StickyBox from "react-sticky-box";
import { useState } from "react";
import { all_routes } from "../../routes/all_routes";

const Cart = () => {
  const [quantity, setQuantity] = useState(1);
  const [quantity2, setQuantity2] = useState(1);

  const increment = () => {
    setQuantity((prev) => prev + 1);
  };
  const increment2 = () => {
    setQuantity2((prev) => prev + 1);
  };

  const decrement = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };
  const decrement2 = () => {
    setQuantity2((prev) => (prev > 1 ? prev - 1 : 1));
  };
  return (
    <>
      {/* ========================
			Start Page Content
		========================= */}
      <div className="page-wrapper">
        {/* Start Breadscrumb */}
        <Breadcrumb title="Cart" paths={[{ label: "Cart", active: true }]} />

        {/* End Breadscrumb */}
        {/* Start Content */}
        <div className="content">
          <div className="container">
            {/* start row */}
            <div className="row" id="cart-wrap">
              <div className="col-lg-12 mx-auto">
                <div className="cart-item-wrap">
                  {/* start row */}
                  <div className="row row-gap-3">
                    <div className="col-xl-9">
                      <div className="cart-item-01">
                        <div className="cart-title">
                          <div className="d-flex align-items-center justify-content-between">
                            <h5>3 Properties</h5>
                            <Link to="#" className="btn btn-danger">
                              <i className="material-icons-outlined">delete</i>
                              Clear Cart
                            </Link>
                          </div>
                          <hr />
                        </div>
                        <div className="cart-item-02">
                          {/* start row */}
                          <div className="row align-items-center row-gap-3">
                            <div className="col-lg-7">
                              <div className="row align-items-center row-gap-3">
                                <div className="col-lg-5">
                                  <ImageWithBasePath
                                    src="assets/img/property-type/property-type-01.jpg"
                                    alt="image"
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="col-lg-7">
                                  <div className="d-flex align-items-center mb-1">
                                    <h6 className="mb-0 me-2">
                                      Getaway Apartment
                                    </h6>
                                    <span className="badge badge-sm bg-secondary">
                                      Rental
                                    </span>
                                  </div>
                                  <p className="address mb-0">
                                    <i className="material-icons-outlined">
                                      location_on
                                    </i>
                                    54, Coral Sands, Gold Coast, AU
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* end col */}
                            <div className="col-lg-5">
                              <div className="cart-content-01 flex-wrap gap-3">
                                <div className="d-flex align-items-center btn-cover">
                                  <Link
                                    to="#"
                                    className="btn minus-btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      decrement();
                                    }}
                                  >
                                    -
                                  </Link>
                                  <input
                                    type="text"
                                    className="quantity-input"
                                    value={quantity}
                                    readOnly
                                  />
                                  <Link
                                    to="#"
                                    className="btn add-btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      increment();
                                    }}
                                  >
                                    +
                                  </Link>
                                </div>
                                <div>
                                  <h5 className="mb-0">$1630</h5>
                                </div>
                                <Link to="#" className="btn remove-btn">
                                  <i className="material-icons-outlined">
                                    delete
                                  </i>
                                  Remove
                                </Link>
                              </div>
                            </div>
                            {/* end col */}
                          </div>
                          {/* end row */}
                        </div>
                        <div className="cart-item-02">
                          {/* start row */}
                          <div className="row align-items-center row-gap-3">
                            <div className="col-lg-7">
                              <div className="row align-items-center row-gap-3">
                                <div className="col-lg-5">
                                  <ImageWithBasePath
                                    src="assets/img/property-type/property-type-02.jpg"
                                    alt="image"
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="col-lg-7">
                                  <div className="d-flex align-items-center mb-1">
                                    <h6 className="mb-0 me-2">
                                      Stylish Skyline Room
                                    </h6>
                                    <span className="badge badge-sm bg-secondary">
                                      Rental
                                    </span>
                                  </div>
                                  <p className="address mb-0">
                                    <i className="material-icons-outlined">
                                      location_on
                                    </i>
                                    18, Ocean View Heights, Malibu, US
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* end col */}
                            <div className="col-lg-5">
                              <div className="cart-content-01 flex-wrap gap-3">
                                <div className="d-flex align-items-center btn-cover">
                                  <Link
                                    to="#"
                                    className="btn minus-btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      decrement2();
                                    }}
                                  >
                                    -
                                  </Link>
                                  <input
                                    type="text"
                                    className="quantity-input"
                                    value={quantity2}
                                    readOnly
                                  />
                                  <Link
                                    to="#"
                                    className="btn add-btn"
                                    onClick={(e) => {
                                      e.preventDefault();
                                      increment2();
                                    }}
                                  >
                                    +
                                  </Link>
                                </div>
                                <div>
                                  <h5 className="mb-0">$1170</h5>
                                </div>
                                <Link to="#" className="btn remove-btn">
                                  <i className="material-icons-outlined">
                                    delete
                                  </i>
                                  Remove
                                </Link>
                              </div>
                            </div>
                            {/* end col */}
                          </div>
                          {/* end row */}
                        </div>
                        <div className="cart-item-02">
                          {/* start row */}
                          <div className="row align-items-center row-gap-3">
                            <div className="col-lg-7">
                              <div className="row align-items-center row-gap-3">
                                <div className="col-lg-5">
                                  <ImageWithBasePath
                                    src="assets/img/property-type/property-type-03.jpg"
                                    alt="image"
                                    className="img-fluid"
                                  />
                                </div>
                                <div className="col-lg-7">
                                  <div className="d-flex align-items-center mb-1">
                                    <h6 className="mb-0 me-2">Majestic Stay</h6>
                                    <span className="badge badge-sm bg-secondary">
                                      Rental
                                    </span>
                                  </div>
                                  <p className="address mb-0">
                                    <i className="material-icons-outlined">
                                      location_on
                                    </i>
                                    54, Coral Sands, Gold Coast, AU
                                  </p>
                                </div>
                              </div>
                            </div>
                            {/* end col */}
                            <div className="col-lg-5">
                              <div className="cart-content-01 flex-wrap gap-3">
                                <div className="d-flex align-items-center btn-cover">
                                  <Link to="#" className="btn minus-btn">
                                    -
                                  </Link>
                                  <input
                                    type="text"
                                    className="quantity-input"
                                    defaultValue={1}
                                  />
                                  <Link to="#" className="btn add-btn">
                                    +
                                  </Link>
                                </div>
                                <div>
                                  <h5 className="mb-0">$4500</h5>
                                </div>
                                <Link to="#" className="btn remove-btn">
                                  <i className="material-icons-outlined">
                                    delete
                                  </i>
                                  Remove
                                </Link>
                              </div>
                            </div>
                            {/* end col */}
                          </div>
                          {/* end row */}
                        </div>
                      </div>
                    </div>
                    {/* end col */}
                    <div className="col-xl-3 theiaStickySidebar">
                      <StickyBox offsetTop={80} offsetBottom={20}>
                        <div className="cart-item-03">
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
                          <div className="mb-3">
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
                          <Link
                            to={all_routes.checkout}
                            className="btn btn-success"
                          >
                            Continue to Checkout
                          </Link>
                        </div>
                      </StickyBox>
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
    </>
  );
};

export default Cart;
