import { Link } from "react-router";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";
import { Buy, Property_Type } from "../../../../../core/common/selectOption";
import { all_routes } from "../../../../routes/all_routes";

const SearchSection = () => {
  return (
    <>
      {/* Search Start */}
      <div className="home-search-2">
        <div className="container">
          <form>
            <div className="d-flex align-items-end flex-wrap flex-md-nowrap gap-3">
              <div className="flex-fill select-field">
                <label className="form-label">Buy / Sell</label>
                <CommonSelect
                  options={Buy}
                  className="select"
                  defaultValue={Buy[0]}
                />
              </div>
              <div className="flex-fill select-field">
                <label className="form-label">Type of Property</label>
                <CommonSelect
                  options={Property_Type}
                  className="select"
                  defaultValue={Property_Type[0]}
                />
              </div>
              <div className="flex-fill select-field">
                <label className="form-label">Location</label>
                <input type="text" className="form-control" />
              </div>
              <div className="flex-fill select-field ">
                <label className="form-label">Min Price</label>
                <input type="text" className="form-control" placeholder="$" />
              </div>
              <div className="flex-fill select-field ">
                <label className="form-label">Max Price</label>
                <input type="text" className="form-control" placeholder="$" />
              </div>
              <div className="custom-search-item d-flex align-items-end">
                <Link
                  to={all_routes.rentPropertyGridSidebar}
                  className="btn btn-primary home-btn"
                >
                  <i className="material-icons-outlined">search</i>
                </Link>
              </div>
            </div>
          </form>
        </div>
      </div>
      {/* Search End */}
    </>
  );
};

export default SearchSection;
