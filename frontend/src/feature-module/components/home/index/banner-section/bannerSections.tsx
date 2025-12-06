import { Link } from "react-router";
import {
  Keyword,
  Property_Type,
} from "../../../../../core/common/selectOption";
import CommonSelect from "../../../../../core/common/common-select/commonSelect";
import { all_routes } from "../../../../routes/all_routes";
import { useTranslation } from "react-i18next";

const BannerSections = () => {
  const { t } = useTranslation();
  return (
    <>
      {/* start banner section */}
      <section className="Home-banner-section">
        <div className="container">
          {/* start row */}
          <div className="row">
            <div className="col-lg-6">
              <div className="banner-content aos" data-aos="fade-up">
                <h1 className="mb-2">{t("home.banner.title")}</h1>
                <p className="mb-0">{t("home.banner.subtitle")}</p>
              </div>
            </div>
          </div>
          {/* end row */}
          {/* Search Start */}
          <div className="home-search-1 home-search-2">
            <ul
              className="nav nav-tabs justify-content-lg-start justify-content-center aos"
              data-aos="fade-up"
              role="tablist"
            >
              <li className="nav-item" role="presentation">
                <Link
                  className="nav-link active"
                  data-bs-toggle="tab"
                  to="#buy_property"
                  role="tab"
                  aria-controls="buy_property"
                  aria-selected="true"
                >
                  <i className="material-icons-outlined me-2">
                    shopping_basket
                  </i>
                  {t("home.banner.tabs.buy")}
                </Link>
              </li>
              <li className="nav-item" role="presentation">
                <Link
                  className="nav-link"
                  data-bs-toggle="tab"
                  to="#rent_property"
                  role="tab"
                  aria-controls="rent_property"
                  aria-selected="false"
                >
                  <i className="material-icons-outlined me-2">king_bed</i>
                  {t("home.banner.tabs.rent")}
                </Link>
              </li>
            </ul>
            <div
              className="tab-content aos"
              data-aos="fade-down"
              data-aos-duration={1000}
            >
              {/* Item-1 */}
              <div
                className="tab-pane fade show active"
                id="buy_property"
                role="tabpanel"
              >
                <div className="search-item">
                  <form>
                    <div className="d-flex align-items-bottom flex-wrap flex-lg-nowrap gap-3">
                      <div className="flex-fill select-field w-100">
                        <label className="form-label">
                          {t("home.banner.fields.keyword")}
                        </label>
                        <CommonSelect
                          options={Keyword}
                          className="select"
                          defaultValue={Keyword[0]}
                        />
                      </div>
                      <div className="flex-fill select-field w-100">
                        <label className="form-label">
                          {t("home.banner.fields.propertyType")}
                        </label>
                        <CommonSelect
                          options={Property_Type}
                          className="select"
                          defaultValue={Property_Type[0]}
                        />
                      </div>
                      <div className="flex-fill select-field w-100">
                        <label className="form-label">
                          {t("home.banner.fields.address")}
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="flex-fill select-field w-100">
                        <label className="form-label">
                          {t("home.banner.fields.minPrice")}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="$"
                        />
                      </div>
                      <div className="flex-fill select-field w-100">
                        <label className="form-label">
                          {t("home.banner.fields.maxPrice")}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="$"
                        />
                      </div>
                      <div className="custom-search-item d-flex align-items-end">
                        <Link
                          to={all_routes.buyPropertyGridSidebar}
                          className="btn btn-primary home-btn"
                        >
                          <i className="material-icons-outlined">search</i>
                        </Link>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              {/* Item-2 */}
              <div className="tab-pane fade" id="rent_property" role="tabpanel">
                <div className="search-item">
                  <form>
                    <div className="d-flex align-items-bottom flex-wrap flex-lg-nowrap gap-3">
                      <div className="flex-fill select-field  w-100">
                        <label className="form-label">
                          {t("home.banner.fields.keyword")}
                        </label>
                        <CommonSelect
                          options={Keyword}
                          className="select"
                          defaultValue={Keyword[0]}
                        />
                      </div>
                      <div className="flex-fill select-field w-100">
                        <label className="form-label">
                          {t("home.banner.fields.propertyType")}
                        </label>
                        <CommonSelect
                          options={Property_Type}
                          className="select"
                          defaultValue={Property_Type[0]}
                        />
                      </div>
                      <div className="flex-fill select-field w-100">
                        <label className="form-label">
                          {t("home.banner.fields.address")}
                        </label>
                        <input type="text" className="form-control" />
                      </div>
                      <div className="flex-fill select-field w-100">
                        <label className="form-label">
                          {t("home.banner.fields.minPrice")}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="$"
                        />
                      </div>
                      <div className="flex-fill select-field w-100">
                        <label className="form-label">
                          {t("home.banner.fields.maxPrice")}
                        </label>
                        <input
                          type="text"
                          className="form-control"
                          placeholder="$"
                        />
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
            </div>
          </div>
          {/* Search End */}
        </div>
      </section>
      {/* end banner section */}
    </>
  );
};

export default BannerSections;
