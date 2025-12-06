import StickyBox from "react-sticky-box";
import { Agency_Type, Select_Area, Select_Category, Select_City } from "../../../../../core/common/selectOption";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";

const AgencySidebar = () => {
  return (
    <StickyBox offsetTop={80} offsetBottom={20}>
      <div className="filter-sidebar border-0">
        <div className="filter-body">
          <div className="filter-set p-0">
            <div className="d-flex align-items-center">
              <div
                className="d-flex justify-content-between w-100 filter-search-head p-3"
                data-bs-toggle="collapse"
                data-bs-target="#search"
                aria-expanded="false"
                role="button"
              >
                <h6 className="d-inline-flex align-items-center mb-0">
                  Search
                </h6>
                <i className="material-icons-outlined expand-arrow">
                  expand_less
                </i>
              </div>
            </div>
            <div id="search" className="collapse show p-3 border-top">
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
              <div className="mb-3">
                <label className="form-label">Agency Type</label>
                <CommonSelect
                  options={Agency_Type}
                  className="select"
                  defaultValue={Agency_Type[0]}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Select City</label>
               <CommonSelect
                  options={Select_City}
                  className="select"
                  defaultValue={Select_City[0]}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Select Area</label>
                 <CommonSelect
                  options={Select_Area}
                  className="select"
                  defaultValue={Select_Area[0]}
                />
              </div>
              <div>
                <label className="form-label">Select Category</label>
                 <CommonSelect
                  options={Select_Category}
                  className="select"
                  defaultValue={Select_Category[0]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="filter-sidebar border-0 mb-xl-0">
        <div className="filter-body">
          <div className="filter-set p-0">
            <div className="d-flex align-items-center">
              <div
                className="d-flex justify-content-between w-100 filter-search-head p-3"
                data-bs-toggle="collapse"
                data-bs-target="#category"
                aria-expanded="false"
                role="button"
              >
                <h6 className="mb-0">Categories</h6>
                <i className="material-icons-outlined expand-arrow">
                  expand_less
                </i>
              </div>
            </div>
            <div id="category" className="collapse show p-3 border-top">
              <div>
                <div className="form-check d-flex align-items-center ps-0 mb-2">
                  <input
                    className="form-check-input ms-0 mt-0"
                    name="category"
                    type="checkbox"
                    id="check_1"
                  />
                  <label className="form-check-label ms-2" htmlFor="check_1">
                    Rentals (24)
                  </label>
                </div>
                <div className="form-check d-flex align-items-center ps-0">
                  <input
                    className="form-check-input ms-0 mt-0"
                    name="category"
                    type="checkbox"
                    id="check_2"
                  />
                  <label className="form-check-label ms-2" htmlFor="check_2">
                    Sales (75)
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StickyBox>
  );
};

export default AgencySidebar;
