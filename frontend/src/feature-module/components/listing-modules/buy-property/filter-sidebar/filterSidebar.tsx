import { Link } from "react-router";
import StickyBox from "react-sticky-box";
import {
  BathRoom,
  BedRoom,
  Location,
} from "../../../../../core/common/selectOption";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";
import { useState } from "react";
import { Slider } from "antd";

const FilterSidebar = () => {
  const [showMenu, setShowMenu] = useState(false);
  const [showMenu2, setShowMenu2] = useState(false);
  return (
    <>
      <StickyBox offsetTop={80} offsetBottom={20}>
        <div className="filter-sidebar buy-grid-sidebar-item-02 mb-lg-0">
          <div className="filter-head d-flex align-items-center justify-content-between">
            <h5 className="mb-0">Filter</h5>
            <Link to="#" className="text-danger">
              Reset
            </Link>
          </div>
          <div className="filter-body">
            {/* Items */}
            <div className="filter-set">
              <div className="d-flex align-items-center">
                <div
                  className="d-flex justify-content-between w-100 filter-search-head"
                  data-bs-toggle="collapse"
                  data-bs-target="#search"
                  aria-expanded="false"
                  role="button"
                >
                  <h6 className="d-inline-flex align-items-center mb-0">
                    <i className="material-icons-outlined me-2 text-secondary">
                      search
                    </i>
                    Search
                  </h6>
                  <i className="material-icons-outlined expand-arrow">
                    expand_less
                  </i>
                </div>
              </div>
              <div id="search" className="card-collapse collapse show mt-3">
                <div className="input-group input-group-flat mb-3">
                  <span className="input-group-text border-0">
                    <i className="material-icons-outlined">search</i>
                  </span>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search here..."
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label mb-1">Select Location</label>
                  <CommonSelect
                    options={Location}
                    className="select"
                    defaultValue={Location[0]}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label mb-1">No of Bedrooms</label>
                  <CommonSelect
                    options={BedRoom}
                    className="select"
                    defaultValue={BedRoom[0]}
                  />
                </div>
                <div className="mb-2">
                  <label className="form-label mb-1">No of Bathrooms</label>
                  <CommonSelect
                    options={BathRoom}
                    className="select"
                    defaultValue={BathRoom[0]}
                  />
                </div>
                <div>
                  <label className="form-label mb-1"> Min Sqft </label>
                  <div className="input-group input-group-flat mb-0">
                    <input
                      type="text"
                      className="form-control"
                      placeholder="Search here..."
                    />
                  </div>
                </div>
              </div>
            </div>
            {/* Items */}
            <div className="filter-set">
              <div className="d-flex align-items-center">
                <div
                  className="d-flex justify-content-between w-100 filter-search-head"
                  data-bs-toggle="collapse"
                  data-bs-target="#category"
                  aria-expanded="false"
                  role="button"
                >
                  <h6 className="mb-0 d-flex align-items-center">
                    <i className="material-icons-outlined me-2 text-secondary">
                      category
                    </i>
                    Categories
                  </h6>
                  <i className="material-icons-outlined expand-arrow">
                    expand_less
                  </i>
                </div>
              </div>
              <div id="category" className="card-collapse collapse show mt-3">
                <div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_1"
                    />
                    <label className="form-check-label ms-2" htmlFor="check_1">
                      Apartments (45)
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_2"
                    />
                    <label className="form-check-label ms-2" htmlFor="check_2">
                      Condos (32)
                    </label>
                  </div>
                  <div className="more-menu mt-2">
                    <div style={{ display: !showMenu ? "none" : "" }}>
                      <div className="form-check d-flex align-items-center ps-0 mb-2">
                        <input
                          className="form-check-input ms-0 mt-0"
                          name="category"
                          type="checkbox"
                          id="check_3"
                        />
                        <label
                          className="form-check-label ms-2"
                          htmlFor="check_3"
                        >
                          Houses (24)
                        </label>
                      </div>
                    </div>
                    <div style={{ display: !showMenu ? "none" : "" }}>
                      <div className="form-check d-flex align-items-center ps-0 mb-2">
                        <input
                          className="form-check-input ms-0 mt-0"
                          name="category"
                          type="checkbox"
                          id="check_4"
                        />
                        <label
                          className="form-check-label ms-2"
                          htmlFor="check_4"
                        >
                          Industrial (75)
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_5"
                    />
                    <label className="form-check-label ms-2" htmlFor="check_5">
                      Land (18)
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center ps-0 ">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_6"
                    />
                    <label className="form-check-label ms-2" htmlFor="check_6">
                      Office (12)
                    </label>
                  </div>
                  <div className="view-all d-inline-flex align-items-center">
                    <Link
                      to="#;"
                      className="viewall-button text-secondary"
                      onClick={() => {
                        setShowMenu(!showMenu);
                      }}
                    >
                      {showMenu ? "Less" : "See More"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* Items */}
            <div className="filter-set">
              <div className="d-flex align-items-center">
                <div
                  className="d-flex justify-content-between w-100 filter-search-head"
                  data-bs-toggle="collapse"
                  data-bs-target="#amenities"
                  aria-expanded="false"
                  role="button"
                >
                  <h6 className="mb-0 d-flex align-items-center">
                    <i className="material-icons-outlined me-2 text-secondary">
                      cake
                    </i>
                    Amenities
                  </h6>
                  <i className="material-icons-outlined expand-arrow">
                    expand_less
                  </i>
                </div>
              </div>
              <div id="amenities" className="card-collapse collapse show mt-3">
                <div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_7"
                    />
                    <label className="form-check-label ms-2" htmlFor="check_7">
                      Backyard (34)
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_8"
                    />
                    <label className="form-check-label ms-2" htmlFor="check_8">
                      Central Air (28)
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_9"
                    />
                    <label className="form-check-label ms-2" htmlFor="check_9">
                      Chair Accessable (39)
                    </label>
                  </div>
                  <div className="more-menu1 mt-2">
                    <div style={{ display: !showMenu2 ? "none" : "" }}>
                      <div className="form-check d-flex align-items-center ps-0 mb-2">
                        <input
                          className="form-check-input ms-0 mt-0"
                          name="category"
                          type="checkbox"
                          id="check_10"
                        />
                        <label
                          className="form-check-label ms-2"
                          htmlFor="check_10"
                        >
                          Elevator (16)
                        </label>
                      </div>
                    </div>
                    <div style={{ display: !showMenu2 ? "none" : "" }}>
                      <div className="form-check d-flex align-items-center ps-0">
                        <input
                          className="form-check-input ms-0 mt-0"
                          name="category"
                          type="checkbox"
                          id="check_11"
                        />
                        <label
                          className="form-check-label ms-2"
                          htmlFor="check_11"
                        >
                          Fireplace (23)
                        </label>
                      </div>
                    </div>
                  </div>
                  <div className="view-all d-inline-flex align-items-center">
                    <Link
                      to="#;"
                      className="viewall1-button text-secondary"
                      onClick={() => {
                        setShowMenu2(!showMenu2);
                      }}
                    >
                      {showMenu2 ? "Less" : "See More"}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
            {/* Items */}
            <div className="filter-set">
              <div className="d-flex align-items-center">
                <div
                  className="d-flex justify-content-between w-100 filter-search-head"
                  data-bs-toggle="collapse"
                  data-bs-target="#price"
                  aria-expanded="false"
                  role="button"
                >
                  <h6 className="mb-0 d-flex align-items-center">
                    <i className="material-icons-outlined me-2 text-secondary">
                      monetization_on
                    </i>
                    Price
                  </h6>
                  <i className="material-icons-outlined expand-arrow">
                    expand_less
                  </i>
                </div>
              </div>
              <div id="price" className="card-collapse collapse show mt-3">
                <div>
                  <div className="filter-range">
                  <Slider range  min={0} max={1000} defaultValue={[200, 5695]}  />
                    <p className="mb-0">
                      Range : <span className="text-dark">$200 - $5695</span>
                    </p>
                  </div>
                </div>
              </div>
            </div>
            {/* Items */}
            <div className="filter-set">
              <div className="d-flex align-items-center">
                <div
                  className="d-flex justify-content-between w-100 filter-search-head"
                  data-bs-toggle="collapse"
                  data-bs-target="#reviews"
                  aria-expanded="false"
                  role="button"
                >
                  <h6 className="mb-0 d-flex align-items-center">
                    <i className="material-icons-outlined me-2 text-secondary">
                      auto_awesome
                    </i>
                    Reviews
                  </h6>
                  <i className="material-icons-outlined expand-arrow">
                    expand_less
                  </i>
                </div>
              </div>
              <div id="reviews" className="card-collapse collapse show mt-3">
                <div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_12"
                    />
                    <label
                      className="form-check-label ms-2 d-flex align-items-center"
                      htmlFor="check_12"
                    >
                      <span className="review-star mb-0 d-flex align-items-center">
                        <i className="material-icons text-warning">star</i>
                        <i className="material-icons text-warning">star</i>
                        <i className="material-icons text-warning">star</i>
                        <i className="material-icons text-warning">star</i>
                        <i className="material-icons text-warning">star</i>
                      </span>
                      <span className="ms-2 mb-0"> 5 Star </span>
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_13"
                    />
                    <label
                      className="form-check-label ms-2 d-flex align-items-center"
                      htmlFor="check_13"
                    >
                      <span className="review-star mb-0 d-flex align-items-center">
                        <i className="material-icons text-warning">star</i>
                        <i className="material-icons text-warning">star</i>
                        <i className="material-icons text-warning">star</i>
                        <i className="material-icons text-warning">star</i>
                      </span>
                      <span className="ms-2 mb-0"> 4 Star </span>
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_14"
                    />
                    <label
                      className="form-check-label ms-2 d-flex align-items-center"
                      htmlFor="check_14"
                    >
                      <span className="review-star mb-0 d-flex align-items-center">
                        <i className="material-icons text-warning">star</i>
                        <i className="material-icons text-warning">star</i>
                        <i className="material-icons text-warning">star</i>
                      </span>
                      <span className="ms-2 mb-0"> 3 Star </span>
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_15"
                    />
                    <label
                      className="form-check-label ms-2 d-flex align-items-center"
                      htmlFor="check_15"
                    >
                      <span className="review-star mb-0 d-flex align-items-center">
                        <i className="material-icons text-warning">star</i>
                        <i className="material-icons text-warning">star</i>
                      </span>
                      <span className="ms-2 mb-0"> 2 Star </span>
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center ps-0 mb-0">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_16"
                    />
                    <label
                      className="form-check-label ms-2 d-flex align-items-center"
                      htmlFor="check_16"
                    >
                      <span className="review-star mb-0 d-flex align-items-center">
                        <i className="material-icons text-warning">star</i>
                      </span>
                      <span className="ms-2 mb-0"> 1 Star </span>
                    </label>
                  </div>
                </div>
              </div>
            </div>
            {/* Items */}
            <div className="filter-set">
              <div className="d-flex align-items-center">
                <div
                  className="d-flex justify-content-between w-100 filter-search-head"
                  data-bs-toggle="collapse"
                  data-bs-target="#style"
                  aria-expanded="false"
                  role="button"
                >
                  <h6 className="mb-0 d-flex align-items-center">
                    <i className="material-icons-outlined me-2 text-secondary">
                      corporate_fare
                    </i>
                    Style
                  </h6>
                  <i className="material-icons-outlined expand-arrow">
                    expand_less
                  </i>
                </div>
              </div>
              <div id="style" className="card-collapse collapse show mt-3">
                <div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_17"
                    />
                    <label
                      className="form-check-label ms-2 d-flex align-items-center"
                      htmlFor="check_17"
                    >
                      Budget
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_18"
                    />
                    <label
                      className="form-check-label ms-2 d-flex align-items-center"
                      htmlFor="check_18"
                    >
                      Midrange
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center ps-0 mb-2">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_19"
                    />
                    <label
                      className="form-check-label ms-2 d-flex align-items-center"
                      htmlFor="check_19"
                    >
                      Luxury
                    </label>
                  </div>
                  <div className="form-check d-flex align-items-center ps-0 mb-0">
                    <input
                      className="form-check-input ms-0 mt-0"
                      name="category"
                      type="checkbox"
                      id="check_20"
                    />
                    <label
                      className="form-check-label ms-2 d-flex align-items-center"
                      htmlFor="check_20"
                    >
                      Family Friendly
                    </label>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="filter-footer">
            <Link to="" className="btn btn-dark w-100">
              {" "}
              Apply Filter{" "}
            </Link>
          </div>
        </div>
      </StickyBox>
    </>
  );
};

export default FilterSidebar;
